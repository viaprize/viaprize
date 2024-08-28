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

    /// @notice this is the address of proposer who deploys a contract
    address public proposer;
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
    
    /// @notice this will be a mapping of the addresses of a funder to a boolean value of true or false
    mapping(address => bool) public isCryptoFunder;
    mapping(address => bool) public isFiatFunder;
    /// @notice this will be a mapping of the addresses of the funders to the amount they have contributed
    mapping(address => uint256) public cryptoFunderAmount;
    mapping(address => uint256) public fiatFunderAmount;
    /// @notice this will be a mapping of the address of a proposer to a boolean value of true or false
    mapping(address => bool) public isProposer;
    /// @notice this will be a mapping of the addresses of a platformAdmins to a boolean value of true or false
    mapping(address => bool) public isPlatformAdmin;
    /// @notice this mapping will be to track of revokeVotes for all the platformAdmins
    mapping(address => uint) public revokeVotes;
    /// @notice mapping to verify the funder donated usdc or usdc.e 
    mapping(address => bool) public isUsdcContributer;

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
    /// @param _proposer who creates this campaign
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
        address _proposer,
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
        proposer = _proposer;
        isProposer[_proposer] = true;
        totalPlatformAdmins = _platformAdmins.length;
        for(uint256 i=0; i<totalPlatformAdmins; i++) {
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

    /// @notice modifer where only proposer or platformAdmin can call the functions.
    modifier onlyProposerOrAdmin {
        require(isProposer[msg.sender] == true || isPlatformAdmin[msg.sender] == true, "You are not a proposer or admin.");
        _;
    }

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
                    _transferLogic();
                }
                _transferLogic();
            }
            else if(metDeadline) { // if metdeadline but not goal
                _refundLogic();
            }
        }
    } 

    /// @notice function to donate the usdc tokens into the campaign
    function addUsdcFunds(uint256 _amountUsdc, uint256 _deadline, uint8 v, bytes32 s, bytes32 r, bytes32 _ethSignedMessageHash, bool _fiatPayment) public nonReentrant payable {
        require(_amountUsdc > 0, "funds should be greater than 0");
        if (!isActive) revert ErrorAndEventsLibrary.NotActive();
        address sender = ecrecover(_ethSignedMessageHash, v, r, s);
        _usdc.permit(sender, address(this), _amountUsdc, _deadline, v, r, s);
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
        _usdc.transferFrom(sender, address(this), _amountUsdc);
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
    function addBridgedUsdcFunds(uint256 _amountUsdc) public nonReentrant payable {
        if(!isActive) revert ErrorAndEventsLibrary.NotActive();
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
    function addEthFunds(uint256 _amountOutMinimum) public nonReentrant payable  {
        if (msg.value == 0) revert ErrorAndEventsLibrary.NotEnoughFunds();
        if (!isActive) revert ErrorAndEventsLibrary.NotActive();
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

    /// @notice function to end the campaign early
    // unlike endEarlyandRedund, this function checks the conditions and according to conditions met it executes
    function endKickStarterCampaign() public nonReentrant onlyProposerOrAdmin {
        if(!isActive) revert("campaign is not active");
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

    function _refundLogic() private {
        for (uint256 i = 0; i < cryptoFunders.length; i++) {
            uint256 transferableAmount = cryptoFunderAmount[cryptoFunders[i]];
            if (transferableAmount > 0) {
                cryptoFunderAmount[cryptoFunders[i]] = 0;
                _usdc.transfer(cryptoFunders[i], transferableAmount);
            }
        }
        for (uint256 i = 0; i < fiatFunders.length; i++) {
            uint256 transferableAmount = fiatFunderAmount[fiatFunders[i]];
            if (transferableAmount > 0) {
                fiatFunderAmount[fiatFunders[i]] = 0;
                _usdc.transfer(platformAddress, transferableAmount);
            }
        }
        refunded = (cryptoFunders.length > 0 || fiatFunders.length > 0);
        isActive = false;
    }

    function _transferLogic() private {
        uint256 _totalProposerRewards = totalRewards;
        uint256 _totalPlatformRewards = totalFunds.sub(totalRewards);
        totalRewards = 0;
        totalFunds = 0;
        _usdc.transfer(proposer, _totalProposerRewards);
        _usdc.transfer(platformAddress, _totalPlatformRewards);
        isActive = false;
    }

    /// @notice function to vote to revoke as a platformAdmin
    /// @param _admin address of platformAdmin to vote for revoke
    function voteToRevokePlatformAdmin(address _admin) public {
        require(isPlatformAdmin[msg.sender], "you are not an platform admin to vote for revoke");
        revokeVotes[_admin] +=1;
        if(revokeVotes[_admin] >= (2 * totalPlatformAdmins) / 3) {
            finalRevoke(_admin);
        }
    }
    /// @notice function to revoke access for platform admin, it will be called in voteToRevokePlatformAdmin
    /// @param _admin address of platformAdmin to vote for revoke
    function finalRevoke(address _admin) private {
        isPlatformAdmin[_admin] = false;
    }

    function giftERC1155(address _nft , uint256 _tokenId, uint256 _amount) public nonReentrant {
        if (!isActive) revert ErrorAndEventsLibrary.NotActive();
        IERC1155 nfts = IERC1155(_nft);
        nfts.safeTransferFrom(msg.sender, proposer, _tokenId, _amount,"");
    }

    function giftERC721(address _nft , uint256 _tokenId) public nonReentrant {
        if (!isActive) revert ErrorAndEventsLibrary.NotActive();
        IERC721 nft = IERC721(_nft);
        nft.safeTransferFrom(msg.sender, proposer,_tokenId);
    }

    function giftTokens(address _token, uint256 _amount) public nonReentrant {
        if (!isActive) revert ErrorAndEventsLibrary.NotActive();
        TransferHelper.safeTransferFrom(_token, msg.sender, proposer, _amount);
    }

    /// @notice function to end campaign early and refund to funders and can be called by only proposer
    function endEarlyandRefund() public nonReentrant onlyProposerOrAdmin {
        if(!isActive) revert("campaign is not active");
        _refundLogic();
    }
}