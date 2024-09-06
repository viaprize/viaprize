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

contract AllOrNothingV2 is ReentrancyGuard {

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
    /// @notice this will be an array of address who funding to this campaign
    address[] public cryptoFunders; 
    address[] public fiatFunders;
    ///@notice array of platformAdmins address, there can be multiple platform admins
    address[] public platformAdmins;

    /// @notice keeping track of goalAmount and set to 0 initially
    uint256 public goalAmount = 0;
    /// @notice keeping track of deadline and set to 0 initially
    uint256 public deadline = 0;
    /// @notice this will the percentage from totalFunds which goes to the platform address as Fee
    uint256 public platformFee;
    /// @notice this will be totalRewards after deducting platform cut
    uint256 public totalRewards;
    /// @notice this will be totalFunds including platform cut
    uint256 public totalFunds;
    /// @notice to keep track of total platformAdmins
    uint256 public totalPlatformAdmins;
    uint8 public minimumSlipageFeePercentage = 2;
    uint8 public constant  VERSION = 2;
    
    /// @notice this will be a mapping of the addresses of the funders to the amount they have contributed
    mapping(address => uint256) public cryptoFunderAmount;
    mapping(address => uint256) public fiatFunderAmount;
    /// @notice this mapping will be to track of votesToRevokePlatformAdmin for all the platformAdmins
    mapping(address => uint8) public votesToRevokePlatformAdmin;
    /// @notice this mapping will be to track of votes to add platformAdmin for all the platformAdmins
    mapping(address => uint8) public votesToAddPlatformAdmin;
    /// @notice this will be a mapping of the address of a proposer to a boolean value of true or false
    mapping(address => bool) public isVisionary;
    /// @notice this will be a mapping of the addresses of a platformAdmins to a boolean value of true or false
    mapping(address => bool) public isPlatformAdmin;
    /// @notice this mapping will be to track of revokeVotes for all the platformAdmins
    mapping(address => uint) public revokeVotes;
    /// @notice mapping to verify the funder donated usdc or usdc.e 
    mapping(address => bool) public isUsdcContributer;
    /// @notice this will be a mapping of the addresses of a funder to a boolean value of true or false
    mapping(address => bool) public isCryptoFunder;
    mapping(address => bool) public isFiatFunder;

    /// @notice bool to check does proposer need to allow donations above the goalAmount or not
    bool public allowDonationAboveGoalAmount;
    /// @notice bool to check status of campaign
    bool public isActive;
    /// @notice boolean variable to keep track refunded or not
    bool public refunded;
    
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
    /// @param _tokenUsdc contract address of usdc token
    /// @param _bridgedTokenUsdc contract address of usdc.e token
    /// @param _wethToken contract address of wraped eth
    /// @param _swapRouter address for swaping the tokens
    /// @param _usdcToUsdcePool pool address to swap from usdc.e to usdc
    /// @param _usdcToEthPool pool address to swap from eth to usdc
    /// @param _ethPriceAggregator address to fetch the realtime eth price
    /// @param _goal is used to set the goalAmount for the campaign
    /// @param _deadline, deadline of the campaign
    /// @param _allowDonationAboveGoalAmount bool to decide to allow donations above the goalAmount
    /// @param _platformFee percentage of amount that goes to the platformAddess 
    constructor(
        address _visionary,
        address[] memory _platformAdmins,
        address _tokenUsdc,
        address _bridgedTokenUsdc,
        address _wethToken,
        address _swapRouter,
        address _usdcToUsdcePool,
        address _usdcToEthPool,
        address _ethPriceAggregator,
        uint256 _goal,
        uint256 _deadline,
        bool _allowDonationAboveGoalAmount,
        uint256 _platformFee
    ) {
        if(_goal == 0 || _deadline == 0) revert ErrorAndEventsLibrary.RequireGoalOrDeadline();
        visionary = _visionary;
        isVisionary[_visionary] = true;
        totalPlatformAdmins = _platformAdmins.length;
        for(uint8 i=0; i<totalPlatformAdmins; i++) {
            platformAdmins.push(_platformAdmins[i]);
            isPlatformAdmin[_platformAdmins[i]] = true;
        }
        platformFee = _platformFee;
        goalAmount = _goal;
        deadline = _deadline;
        allowDonationAboveGoalAmount = _allowDonationAboveGoalAmount;
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

    /// @notice function to add the tokens into campagin and give voting access to others
    /// @param _amountUsdc The amount of tokens being added.
    /// @param _deadline The deadline for the permit function.
    /// @param v The `v, r, s` component of the ECDSA signature.
    /// @param _ethSignedMessageHash The Ethereum signed message hash.
    /// @param _fiatPayment A boolean indicating whether the payment is in fiat.
    function addUsdcFunds(uint256 _amountUsdc, uint256 _deadline, uint8 v, bytes32 s, bytes32 r, bytes32 _ethSignedMessageHash, bool _fiatPayment) public onlyActive nonReentrant payable {
        require(_amountUsdc > 0, "funds should be greater than 0");
        address sender = ecrecover(_ethSignedMessageHash, v, r, s);
        _usdc.permit(sender, address(this), _amountUsdc, _deadline, v, r, s);
         _usdc.transferFrom(sender, address(this), _amountUsdc);
        if(_fiatPayment == true) {
            if(!isFiatFunder[sender]) {
                fiatFunders.push(sender);
                isFiatFunder[sender] = true;
            }
            fiatFunderAmount[sender] = fiatFunderAmount[sender].add(_amountUsdc);
            totalRewards = totalRewards.add((_amountUsdc.mul(100 - (platformFee))).div(100));
            totalFunds = totalFunds.add(_amountUsdc);
        } else {
            _depositAndTransferLogic(sender, _amountUsdc);
        }
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

    /// @notice Allows users to add bridged USDC funds to the platform.
    /// @param _amountUsdc The amount of bridged USDC being added.
    function addBridgedUsdcFunds(uint256 _amountUsdc) public onlyActive nonReentrant payable {
        if(_amountUsdc <= 0) revert ErrorAndEventsLibrary.NotEnoughFunds();
        require(_usdcBridged.allowance(msg.sender, address(this)) >= _amountUsdc, "Not enough USDC approved"); 
        address sender = msg.sender;
        TransferHelper.safeTransferFrom(USDC_E, msg.sender, address(this), _amountUsdc);
        TransferHelper.safeApprove(USDC_E, address(swapRouter), _amountUsdc);
        uint256 _amountOutMinimum = _amountUsdc.mul(100-minimumSlipageFeePercentage).div(100);
        _swapRouterLogic(sender, _amountUsdc, address(_usdcBridged), bridgedUsdcPool.fee(), _amountOutMinimum );
    }

    /// @notice Allows users to donate ETH to the campaign. The ETH is swapped to USDC via a router.
    /// @param _amountOutMinimum The minimum amount of USDC that must be received from the swap.
    function addEthFunds(uint256 _amountOutMinimum) public onlyActive nonReentrant payable  {
        if (msg.value == 0) revert ErrorAndEventsLibrary.NotEnoughFunds();
        uint256 eth_donation =  msg.value;
        address sender = msg.sender;
        _weth.deposit{value:msg.value}();
        _weth.approve(address(swapRouter), eth_donation);
        _swapRouterLogic(sender, eth_donation, address(_weth), ethUsdcPool.fee(), _amountOutMinimum);
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
    function giftERC1155(address _nft , uint256 _tokenId, uint256 _amount) public onlyActive nonReentrant {
        IERC1155 nfts = IERC1155(_nft);
        nfts.safeTransferFrom(msg.sender, visionary, _tokenId, _amount,"");
        emit ErrorAndEventsLibrary.Donation(msg.sender,_nft, ErrorAndEventsLibrary.DonationType.GIFT, ErrorAndEventsLibrary.TokenType.NFT, false, _amount);
    }

    /**
     * @notice Gifts an ERC721 token.
     * @param _nft The address of the ERC721 token contract.
     * @param _tokenId The ID of the token to be transferred.
     */
    function giftERC721(address _nft , uint256 _tokenId) public onlyActive nonReentrant {
        IERC721 nft = IERC721(_nft);
        nft.safeTransferFrom(msg.sender, visionary,_tokenId);
        emit ErrorAndEventsLibrary.Donation(msg.sender, _nft, ErrorAndEventsLibrary.DonationType.GIFT, ErrorAndEventsLibrary.TokenType.NFT, false, 1);
    }

    /**
     * @notice Gifts ERC20 tokens.
     * @param _token The address of the ERC20 token contract.
     * @param _amount The amount of tokens to be transferred.
     */
    function giftTokens(address _token, uint256 _amount) public onlyActive nonReentrant {
        TransferHelper.safeTransferFrom(_token, msg.sender, visionary, _amount);
        emit ErrorAndEventsLibrary.Donation(msg.sender, _token, ErrorAndEventsLibrary.DonationType.GIFT, ErrorAndEventsLibrary.TokenType.TOKEN, false, _amount);
    }

    /// @notice function to end the campaign early
    // unlike endEarlyandRedund, this function checks the conditions and according to conditions met it executes
    function endKickStarterCampaign() public nonReentrant onlyActive onlyPlatformAdminOrVisionary {
        bool deadlineAvailable = deadline > 0;
        bool metDeadline = deadlineAvailable && deadline <= block.timestamp;
        bool metGoal = totalRewards >= goalAmount;

        if(metGoal) {
            _transferLogic();
        }
        else if(metDeadline) {
            _refundLogic();
        }
    }

    /// @notice Handles the logic for depositing cryptocurrency donations.
    /// @param sender The address of the funder making the donation.
    /// @param _donation The amount being donated to the campaign.
    function _depositAndTransferLogic(address sender, uint256 _donation) private {
        cryptoFunders.push(sender);
        isCryptoFunder[sender] = true;
        totalFunds = totalFunds.add(_donation);
        totalRewards = totalRewards.add((_donation.mul(100 - platformFee)).div(100));
        cryptoFunderAmount[sender] = cryptoFunderAmount[sender].add(_donation);

        bool goalAmountAvailable = goalAmount > 0;
        bool deadlineAvailable = deadline > 0;
        bool metDeadline = deadlineAvailable && deadline <= block.timestamp;
        bool metGoal = totalRewards >= goalAmount;

        if(allowDonationAboveGoalAmount) {
            if(metDeadline && metGoal) {
                _transferLogic();
            }
            if(metDeadline && !metGoal) {
                _refundLogic();
            }
        }
        if(!allowDonationAboveGoalAmount) {
            if(metGoal) {
                uint256 excessAmount = totalRewards.sub(goalAmount);
                if(totalRewards > goalAmount) {
                    totalRewards = totalRewards.sub(excessAmount);
                    _usdc.transfer(msg.sender, excessAmount);
                }
                _transferLogic();
            }
            else if(metDeadline) { // if metdeadline but not goal
                _refundLogic();
            }
        }
    }

    /// @notice handles the refund logic.
    function _refundLogic() private {
        for (uint32 i = 0; i < cryptoFunders.length; i++) {
            uint256 transferableAmount = cryptoFunderAmount[cryptoFunders[i]];
            if (transferableAmount > 0) {
                cryptoFunderAmount[cryptoFunders[i]] = 0;
                _usdc.transfer(cryptoFunders[i], transferableAmount);
            }
        }
        for (uint32 i = 0; i < fiatFunders.length; i++) {
            uint256 transferableAmount = fiatFunderAmount[fiatFunders[i]];
            if (transferableAmount > 0) {
                fiatFunderAmount[fiatFunders[i]] = 0;
                _usdc.transfer(platformAddress, transferableAmount);
            }
        }
        refunded = (cryptoFunders.length > 0 || fiatFunders.length > 0);
        isActive = false;
    }

    /// @notice hadles the only transfer logic, used in _depositAndTransferLogic() and endKickStarterCampaign()
    function _transferLogic() private {
        uint256 _totalProposerRewards = totalRewards;
        uint256 _totalPlatformRewards = totalFunds.sub(totalRewards);
        totalRewards = 0;
        totalFunds = 0;
        _usdc.transfer(visionary, _totalProposerRewards);
        _usdc.transfer(platformAddress, _totalPlatformRewards);
        isActive = false;
    }

    /// @notice function to end campaign early and refund to funders and can be called by only proposer
    function endEarlyandRefund() public nonReentrant onlyActive onlyPlatformAdminOrVisionary {
        _refundLogic();
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
    function changeMinimumSlipageFeePercentage(uint8 _minimumSlipageFeePercentage) public onlyPlatformAdmin {
        minimumSlipageFeePercentage  = _minimumSlipageFeePercentage;
    } 
}