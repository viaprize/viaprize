//SPDX-License-Identifier:MIT
pragma solidity ^0.8.0;

import "./helperLibraries/errorEventsLibrary.sol";
import "../../helperContracts/safemath.sol";
import "../../helperContracts/ierc20_permit.sol";
import "../../helperContracts/ierc20_weth.sol";
import "../../helperContracts/ierc721.sol";
import "../../helperContracts/ierc1155.sol";
import "../../helperContracts/nonReentrant.sol";
import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";
import "@uniswap/v3-core/contracts/interfaces/IUniswapV3Pool.sol";
import "@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract PassThroughV2 is ReentrancyGuard {

    /// @notice this will be the total funds yet contributed to this campaign by funders
    uint256 public totalFunds;
    /// @notice this will be the total Rewards which goes to recipent after deducting platform fees
    uint256 public totalRewards;
    /// @notice to keep track of total platformAdmins
    uint256 public totalPlatformAdmins;
    /// @notice this will the percentage from totalFunds which goes to the platform address as Fee
    uint256 public  immutable platformFee;
    uint public minimumSlipageFeePercentage = 2; 

    /// @notice this is the address of visionary who deploys a contract
    address public visionary;
    /// @notice this is an usdc token address which will be assigned while deploying the contract.
    address public USDC;
    /// @notice this is an usdc token address which will be assigned while deploying the contract.
    address public USDC_E;
    /// @notice this is an Eth address which will be assigned while deploying the contract.
    address public WETH;
    /// @notice this will be the address to receive platform Fee
    address public immutable platformAddress = 0x1f00DD750aD3A6463F174eD7d63ebE1a7a930d0c;
    ///@notice array of platformAdmins address, there can be multiple platform admins
    address[] public platformAdmins;
    /// @notice this will be an array of address who funding to this campaign
    address[] public funders; 

    /// @notice bool to check status of campaign
    bool public isActive;
    
    /// @notice this will be a mapping of the address of a proposer to a boolean value of true or false
    mapping(address => bool) public isVisionary;
    /// @notice this will be a mapping of the addresses of a platformAdmins to a boolean value of true or false
    mapping(address => bool) public isPlatformAdmin;
    /// @notice this will be a mapping of the addresses of a funder to a boolean value of true or false
    mapping(address => bool) public isFunder;
    /// @notice this will be a mapping of the addresses of the funders to the amount they have contributed
    mapping(address => uint256) public funderAmount;
    /// @notice this mapping will be to track of votesToRevokePlatformAdmin for all the platformAdmins
    mapping(address => uint8) public votesToRevokePlatformAdmin;
    /// @notice this mapping will be to track of votes to add platformAdmin for all the platformAdmins
    mapping(address => uint8) public votesToAddPlatformAdmin;
   
    /// @notice initializing the erc20 interface for usdc token
    IERC20Permit private _usdc;
    /// @notice initializing the erc20 interface for usdc bridged usdc token
    IERC20Permit private _usdcBridged;
    /// @notice initializing the interface for weth
    IWETH private _weth;
    /// @notice initializing swaprouter interface
    ISwapRouter public immutable swapRouter;
    /// @notice initializing brdiged usdc and usdc pool 
    IUniswapV3Pool public immutable bridgedUsdcPool;
    /// @notice initalizing eth and usdc pool
    IUniswapV3Pool public immutable ethUsdcPool;
    /// @notice initializing chainlink or oracle price aggregator
    AggregatorV3Interface public immutable ethPriceAggregator;

    /// @notice This directive allows the use of the SafeMath and ErrorAndEventsLibrary libraries.
    using SafeMath for uint256;
    using ErrorAndEventsLibrary for *;

    /// @notice constructor where we pass all the required parameters before deploying the contract
    /// @param _visionary who creates this campaign
    /// @param _platformAdmins array of address of platform admins
    /// @param _tokenUsdc contract address of usdc token , 0x0b2c639c533813f4aa9d7837caf62653d097ff85 for op
    /// @param _bridgedTokenUsdc contract address of usdc.e token , 0x7f5c764cbc14f9669b88837ca1490cca17c31607 for op
    /// @param _wethToken contract address of eth , 0x4200000000000000000000000000000000000006 for op
    /// @param _platformFee percentage of amount that goes to the platformAddess 
    /// @param _swapRouter interface for initiating swaps, op swaps router  0xE592427A0AEce92De3Edee1F18E0157C05861564
    /// @param _usdcToUsdcePool 0x2aB22ac86b25BD448A4D9dC041Bd2384655299c4 for optimism
    /// @param  _usdcToEthPool 0x1fb3cf6e48f1e7b10213e7b6d87d4c073c7fdb7b for optimism
    /// @param _ethPriceAggregator 0x13e3Ee699D1909E989722E753853AE30b17e08c5 for optimism
    constructor(
        address _visionary,
        address[] memory _platformAdmins,
        uint256 _platformFee,
        address _tokenUsdc,
        address _bridgedTokenUsdc,
        address _wethToken,
        address _swapRouter,
        address _usdcToUsdcePool,
        address _usdcToEthPool,
        address _ethPriceAggregator
    ) {

        visionary = _visionary;
        isVisionary[_visionary] = true;
        totalPlatformAdmins = _platformAdmins.length;
        for(uint256 i=0; i<totalPlatformAdmins; i++) {
            platformAdmins.push(_platformAdmins[i]);
            isPlatformAdmin[_platformAdmins[i]] = true;
        }
        platformFee = _platformFee;
        isActive = true;
        _usdc = IERC20Permit(_tokenUsdc);
        _usdcBridged = IERC20Permit(_bridgedTokenUsdc);
        _weth = IWETH(_wethToken);
        USDC = _tokenUsdc;
        USDC_E = _bridgedTokenUsdc;
        WETH = _wethToken;
        swapRouter = ISwapRouter(_swapRouter);
        bridgedUsdcPool = IUniswapV3Pool(_usdcToUsdcePool);
        ethUsdcPool = IUniswapV3Pool(_usdcToEthPool);
        ethPriceAggregator = AggregatorV3Interface(_ethPriceAggregator);
    } 

    /// @notice Checks if the campaign is active. Reverts with NotActive error if not.
    function _onlyActive() private view {
        if (!isActive) revert ErrorAndEventsLibrary.NotActive();
    }
    /// @notice Modifier to ensure the function is only executed if the campaign is active.
    modifier onlyActive() {
        _onlyActive();
        _;
    }

    /// @notice Checks if the caller is a platform admin. Reverts with NP error if not.
    function _onlyPlatformAdmin() private view {
        if (!isPlatformAdmin[msg.sender]) revert ErrorAndEventsLibrary.NP();
    }
    /// @notice Modifier to ensure the function is only executed by platform admins.
    modifier onlyPlatformAdmin() {
        _onlyPlatformAdmin();
        _;
    }

    /// @notice Checks if the caller is either a platform admin or the visionary. Reverts with NPP error if not.
    function _onlyPlatformAdminOrVisionary() private view {
        if (!(isPlatformAdmin[msg.sender] || isVisionary[msg.sender])) revert ErrorAndEventsLibrary.NPP();
    }
    /// @notice Modifier to ensure the function is only executed by platform admins or the visionary.
    modifier onlyPlatformAdminOrVisionary() {
        _onlyPlatformAdminOrVisionary();
        _;
    }

    /// @notice Handles the logic for depositing cryptocurrency donations.
    /// @param sender The address of the funder making the donation.
    /// @param _donation The amount of cryptocurrency being donated.
    function _depositAndTransferLogic(address sender, uint256 _donation) private {
        if(!isFunder[sender]) {
            funders.push(sender);
            isFunder[sender] = true;
        }
        totalFunds = totalFunds.add(_donation);
        totalRewards = totalRewards.add((_donation.mul(100 - platformFee)).div(100));
        _usdc.transfer(visionary, (_donation.mul(100 - platformFee)).div(100));
        _usdc.transfer(platformAddress, (_donation.mul(platformFee)).div(100));
    }

    /// @notice function to add the tokens into campagin and give voting access to others
    /// @param _amountUsdc The amount of tokens being added.
    /// @param _deadline The deadline for the permit function.
    /// @param v The `v, r, s` component of the ECDSA signature.
    /// @param _ethSignedMessageHash The Ethereum signed message hash.
    /// @param _fiatPayment A boolean indicating whether the payment is in fiat.
    function addUsdcFunds(uint256 _amountUsdc, uint256 _deadline, uint8 v, bytes32 s, bytes32 r, bytes32 _ethSignedMessageHash, bool _fiatPayment) public nonReentrant onlyActive {
        if(_amountUsdc <= 0) revert ErrorAndEventsLibrary.NotEnoughFunds();
        address funder = ecrecover(_ethSignedMessageHash, v, r, s);
        _usdc.permit(funder, address(this), _amountUsdc, _deadline, v, r, s);
        _usdc.transferFrom(funder, address(this), _amountUsdc);
        uint256 _donation = _amountUsdc;
        _depositAndTransferLogic(funder, _donation);
        emit ErrorAndEventsLibrary.Donation(funder, address(_usdc), ErrorAndEventsLibrary.DonationType.PAYMENT, ErrorAndEventsLibrary.TokenType.TOKEN, _fiatPayment, _donation);
    }

    /// @notice function to handle the logic for swapping tokens through the router.
    /// @param sender The address of the funder making the swap.
    /// @param _amountUsdc The amount of USDC being swapped.
    /// @param swapFrom The address of the token being swapped from.
    /// @param poolFee The fee associated with the pool.
    /// @param _amountOutMinimum The minimum amount out from the swap.
    function _swapRouterLogic(address sender, uint256 _amountUsdc, address swapFrom, uint256 poolFee, uint256 _amountOutMinimum ) private {
        ISwapRouter.ExactInputParams memory params =
            ISwapRouter.ExactInputParams({
                path: abi.encodePacked(swapFrom, poolFee, address(_usdc)),
                recipient: address(this),
                deadline: block.timestamp,
                amountIn: _amountUsdc,
                amountOutMinimum: _amountOutMinimum
        });
        uint256 _donation  = swapRouter.exactInput(params);
        _depositAndTransferLogic(sender, _donation);
        emit ErrorAndEventsLibrary.Donation(sender, swapFrom, ErrorAndEventsLibrary.DonationType.PAYMENT, ErrorAndEventsLibrary.TokenType.TOKEN, false, _donation);
    }
    
    /// @notice Allows users to donate ETH to the campaign. The ETH is swapped to USDC via a router.
    /// @param _amountOutMinimum The minimum amount of USDC that must be received from the swap.
    function addEthFunds(uint256 _amountOutMinimum) public nonReentrant payable onlyActive{
        if(msg.value <= 0) revert ErrorAndEventsLibrary.NotEnoughFunds();
        uint256 eth_donation =  msg.value;
        address sender = msg.sender;
        _weth.deposit{value:msg.value}();
        _weth.approve(address(swapRouter), eth_donation);
        _swapRouterLogic(sender, eth_donation, address(_weth), ethUsdcPool.fee(), _amountOutMinimum);
    }

    /// @notice Allows users to add bridged USDC funds to the platform.
    /// @param _amountUsdc The amount of bridged USDC being added.
    function addBridgedUSDCFunds(uint256 _amountUsdc) public nonReentrant onlyActive {
        if(_amountUsdc <= 0) revert ErrorAndEventsLibrary.NotEnoughFunds();
        address sender = msg.sender;
        TransferHelper.safeTransferFrom(USDC_E, msg.sender, address(this), _amountUsdc);
        TransferHelper.safeApprove(USDC_E, address(swapRouter), _amountUsdc);
        uint256 _amountOutMinimum = _amountUsdc.mul(100-minimumSlipageFeePercentage).div(100);
        _swapRouterLogic(sender, _amountUsdc, address(_usdcBridged), bridgedUsdcPool.fee(), _amountOutMinimum );
    }

    /// @notice external function to receive eth funds
    receive() external payable {
        uint ethValue = msg.value;
        uint decimals = ethPriceAggregator.decimals() - uint256(_usdc.decimals());
        (, int256 latestPrice , , ,)  = ethPriceAggregator.latestRoundData();
        uint price_in_correct_decimals = uint(latestPrice)/ (10 ** decimals);
        addEthFunds((ethValue / price_in_correct_decimals).mul(100-minimumSlipageFeePercentage).div(100));
    }

    /**
     * @notice Gifts ERC1155 tokens.
     * @param _nft The address of the ERC1155 token contract.
     * @param _tokenId The ID of the token to be transferred.
     * @param _amount The amount of the token to be transferred.
     */
    function giftERC1155(address _nft , uint256 _tokenId, uint256 _amount) public nonReentrant onlyActive {
        IERC1155 nfts = IERC1155(_nft);
        nfts.safeTransferFrom(msg.sender, visionary, _tokenId, _amount,"");
        emit ErrorAndEventsLibrary.Donation(msg.sender,_nft, ErrorAndEventsLibrary.DonationType.GIFT, ErrorAndEventsLibrary.TokenType.NFT, false, _amount);
    }

    /**
     * @notice Gifts an ERC721 token.
     * @param _nft The address of the ERC721 token contract.
     * @param _tokenId The ID of the token to be transferred.
     */
    function giftERC721(address _nft , uint256 _tokenId) public nonReentrant onlyActive {
        IERC721 nft = IERC721(_nft);
        nft.safeTransferFrom(msg.sender, visionary, _tokenId);
        emit ErrorAndEventsLibrary.Donation(msg.sender, _nft, ErrorAndEventsLibrary.DonationType.GIFT, ErrorAndEventsLibrary.TokenType.NFT, false, 1);
    }

    /**
     * @notice Gifts ERC20 tokens.
     * @param _token The address of the ERC20 token contract.
     * @param _amount The amount of tokens to be transferred.
     */
    function giftTokens(address _token, uint256 _amount) public nonReentrant onlyActive {
        TransferHelper.safeTransferFrom(_token, msg.sender, visionary, _amount);
        emit ErrorAndEventsLibrary.Donation(msg.sender, _token, ErrorAndEventsLibrary.DonationType.GIFT, ErrorAndEventsLibrary.TokenType.TOKEN, false, _amount);
    }

    ///@notice function to get all the funders who donated to this campaign
    function retrieveAllFunders() public view  returns(address[] memory){
        return funders;
    }

    /// @notice function to end campaign manually and only proposer can do this
    function endCampaign() public onlyPlatformAdmin nonReentrant onlyActive{
        isActive = false;
    }

    /// @notice function to revoke access for platform admin, it will be called in voteToRevokePlatformAdmin
    /// @param _admin address of platformAdmin to vote for revoke
    function finalRevokePlatformAdmin(address _admin) private {
        isPlatformAdmin[_admin] = false;
        totalPlatformAdmins -= 1;
    }

    /// @notice function to add access for platform admin, it will be called in voteToAddPlatformAdmin
    /// @param _admin address of platformAdmin to vote for add
    function finalAddPlatformAdmin(address _admin) private {
        isPlatformAdmin[_admin] = true;
        totalPlatformAdmins += 1;
    }

    /// @notice function vote to add as a platformAdmin
    /// @param _admin is the address to vote for platform Admin
    function voteToAddPlatformAdmin(address _admin) public nonReentrant onlyPlatformAdmin {
        if(isPlatformAdmin[_admin]) revert("PAE"); //PAE -> Platform Admin Exists
        votesToAddPlatformAdmin[_admin] +=1;
        if(votesToAddPlatformAdmin[_admin] >= (2 * totalPlatformAdmins) / 3) {
            finalAddPlatformAdmin(_admin);
        }
    }

    /// @notice function to vote to revoke as a platformAdmin
    /// @param _admin address of platformAdmin to vote for revoke
    function voteToRevokePlatformAdmin(address _admin) public nonReentrant onlyPlatformAdmin{
        if(!isPlatformAdmin[_admin]) revert("PANE"); //NPNE -> Platform Adim Not Exists
        votesToRevokePlatformAdmin[_admin] +=1;
        if(votesToRevokePlatformAdmin[_admin] >= (2 * totalPlatformAdmins) / 3) {
            finalRevokePlatformAdmin(_admin);
        }
    }

    /// @notice function to change slippage tolerance of other token donations
    /// @param _minimumSlipageFeePercentage of new minimumSlipageFeePercentage
    function changeMinimumSlipageFeePercentage(uint256 _minimumSlipageFeePercentage) public onlyPlatformAdmin {
        minimumSlipageFeePercentage  = _minimumSlipageFeePercentage;
    } 
}