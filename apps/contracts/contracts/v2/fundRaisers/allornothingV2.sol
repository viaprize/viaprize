//SPDX-License-Identifier:MIT

pragma solidity ^0.8.0;

import "@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol";
import "../../helperContracts/safemath.sol";
import "../../helperContracts/ierc20_permit.sol";
import "../../helperContracts/ierc20_weth.sol";
import "../../helperContracts/ierc721.sol";
import "../../helperContracts/ierc1155.sol";
import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";
import "@uniswap/v3-core/contracts/interfaces/IUniswapV3Pool.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract AllOrNothingV2 {
    /// @notice this is the address of proposer who deploys a contract
    address public proposer;
    /// @notice this will be a mapping of the address of a proposer to a boolean value of true or false
    mapping(address => bool) public isProposer;
    ///@notice array of platformAdmins address, there can be multiple platform admins
    address[] public platformAdmins;
    /// @notice this will be a mapping of the addresses of a platformAdmins to a boolean value of true or false
    mapping(address => bool) public isPlatformAdmin;
    /// @notice this will be the address to receive campaign funds, it can be similar to proposer address
    address public receipent;
    /// @notice keeping track of goalAmount and set to 0 initially
    uint256 public goalAmount = 0;
    /// @notice keeping track of deadline and set to 0 initially
    uint256 public deadline = 0;
    /// @notice this will be the address to receive platform Fee
    address public immutable platformAddress = 0x1f00DD750aD3A6463F174eD7d63ebE1a7a930d0c;
    /// @notice this will the percentage from totalFunds which goes to the platform address as Fee
    uint256 public platformFee;
    /// @notice this will be an array of address who funding to this campaign
    address[] public funders; 
    /// @notice this will be a mapping of the addresses of a funder to a boolean value of true or false
    mapping(address => bool) public isFunder;
    /// @notice this will be a mapping of the addresses of the funders to the amount they have contributed
    mapping(address => uint256) public funderAmount;
    /// @notice this will be the total usdcFunds donated to the campaign
    uint256 public totalUsdcFunds;
    /// @notice this will be the total usdcRewards which goes to the recipient after deduction the platform fee from total usdc Funds.
    uint256 public totalUsdcRewards;
    /// @notice this will be the total bridged usdcFunds donated to the campaign
    uint256 public totalBridgedUsdcFunds;
    /// @notice this will be the total bridged usdcRewards which goes to the recipient after deducting the platform fee from total bridged usdcFunds
    uint256 public totalBridgedUsdcRewards;
    /// @notice this will be totalRewards(usdc + usdcBrdiged)
    uint256 public totalRewards;
    /// @notice this will be totalFunds(usdc + usdcBrdiged)
    uint256 public totalFunds;
    /// @notice bool to check does proposer need to allow donations above the goalAmount or not
    bool public allowDonationAboveGoalAmount;
    /// @notice this mapping will be to track of revokeVotes for all the platformAdmins
    mapping(address => uint) public revokeVotes;
    /// @notice to keep track of total platformAdmins
    uint256 public totalPlatformAdmins;
    /// @notice bool to check status of campaign
    bool public isActive;
    /// @notice To-Do
    bool internal locked;
    /// @notice mapping to verify the funder donated usdc or usdc.e 
    mapping(address => bool) public isUsdcContributer;


    uint public minimumSlipageFeePercentage = 2; 
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
    

    /// @notice this is an usdc token address which will be assigned while deploying the contract.
    address public USDC;
    /// @notice this is an usdc token address which will be assigned while deploying the contract.
    address public USDC_E;
    /// @notice this is an Eth address which will be assigned while deploying the contract.
    address public WETH;

    /// @notice error indicating the funding to the contract has ended
    error FundingToContractEnded();
    /// @notice error indicating the need of goal and deadline while deploying the contract
    error RequireGoalAndDeadline();
    /// @notice initializing the use of safemath
    using SafeMath for uint256;

    enum DonationType {
        GIFT,
        PAYMENT
    }
    enum TokenType {
        NFT,
        TOKEN
    }

    /// @notice Donation events triggered
    event Donation(address indexed donator ,address indexed token_or_nft, DonationType  indexed _donationType, TokenType _tokenType, uint256 amount);
    event Sender(address indexed _sender, uint256 indexed _amount);
    event Values(
        address receiverAddress,
        uint256 totalFunds,
        uint256 totalRewards,
        bool goalMet,
        bool allowDonationsAboveGoalAmount,
        uint256 deadline,
        uint256 goalAmount,
        bool deadlineAvailable,
        bool goalAmountAvailable
    );

    /// @notice constructor where we pass all the required parameters before deploying the contract
    /// @param _proposer who creates this campaign
    /// @param _platformAdmins array of address of platform admins
    /// @param _token contract address of usdc token
    /// @param _bridgedToken contract address of usdc.e token
    /// @param _goal is used to set the goalAmount for the campaign
    /// @param _deadline, deadline of the campaign
    /// @param _allowDonationAboveGoalAmount bool to decide to allow donations above the goalAmount
    /// @param _platformFee percentage of amount that goes to the platformAddess 
    constructor(
        address _proposer,
        address[] memory _platformAdmins,
        address _token,
        address _bridgedToken,
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
        if(_goal == 0 || _deadline == 0) revert RequireGoalAndDeadline();

        proposer = _proposer;
        isProposer[_proposer] = true;
        totalPlatformAdmins = _platformAdmins.length;
        for(uint256 i=0; i<totalPlatformAdmins; i++) {
            platformAdmins.push(_platformAdmins[i]);
            isPlatformAdmin[_platformAdmins[i]] = true;
        }

        receipent = _proposer;
        _usdc = IERC20Permit(_token);
        _usdcBridged = IERC20Permit(_bridgedToken);
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

    /// @notice re-entrancy modifier
    modifier noReentrant() {
        require(!locked, "No re-rentrancy");
        locked = true;
        _;
        locked = false;
    }

    /// @notice modifer where only proposer or platformAdmin can call the functions.
    modifier onlyProposerOrAdmin {
        require(isProposer[msg.sender] == true || isPlatformAdmin[msg.sender] == true, "You are not a proposer or admin.");
        _;
    }

    function recoverSigner(
        bytes32 _ethSignedMessageHash,
        bytes memory _signature
    ) public pure returns (address) {
        (bytes32 r, bytes32 s, uint8 v) = splitSignature(_signature);

        return ecrecover(_ethSignedMessageHash, v, r, s);
    }

    function splitSignature(bytes memory sig)
        public
        pure
        returns (bytes32 r, bytes32 s, uint8 v)
    {
        require(sig.length == 65, "invalid signature length");

        assembly {
            r := mload(add(sig, 32))
            s := mload(add(sig, 64))
            v := byte(0, mload(add(sig, 96)))
        }
    }

    function _depositLogic(address sender, uint256 _donation) private {
        funders.push(sender);
        isFunder[sender] = true;
        totalFunds = totalFunds.add(_donation);
        totalRewards = totalRewards.add((_donation.mul(100 - platformFee)).div(100));
    }

    /// @notice function to donate the usdc tokens into the campaign
    function addUsdcFunds(address spender, uint256 _amountUsdc, uint256 _deadline, uint8 v, bytes32 s, bytes32 r, bytes32 _ethSignedMessageHash) public noReentrant payable returns(uint256, uint256, uint256, bool, bool, bool) {
        require(_amountUsdc > 0, "funds should be greater than 0");
        if (!isActive) revert FundingToContractEnded();
        address funder = ecrecover(_ethSignedMessageHash, v, r, s);
        _usdc.permit(funder, spender, _amountUsdc, _deadline, v, r, s);
        _usdc.transferFrom(funder, spender, _amountUsdc);
        if(!isActive) revert FundingToContractEnded();
        uint256 _donation = _amountUsdc;
        // funders.push(msg.sender);
        // isFunder[msg.sender] = true;
        // isUsdcContributer[msg.sender] = true;
        // funderAmount[msg.sender] = funderAmount[msg.sender].add(_donation);
        // totalUsdcRewards = totalUsdcRewards.add((_donation.mul(100 - platformFee)).div(100));
        // totalUsdcFunds = totalUsdcFunds.add(_donation);
        // totalRewards = totalRewards.add((_donation.mul(100 - platformFee)).div(100));
        // totalFunds = totalFunds.add(_donation);
        _depositLogic(funder, _donation);

        bool goalAmountAvailable = goalAmount > 0;
        bool deadlineAvailable = deadline > 0;
        bool metDeadline = deadlineAvailable && deadline <= block.timestamp;
        bool metGoal = totalRewards >= goalAmount;

        if(allowDonationAboveGoalAmount) {
            if (metDeadline && metGoal) {
                // uint256 totalusdcrewards = totalUsdcRewards;
                // uint256 adminusdcrewards = totalUsdcFunds.sub(totalUsdcRewards);
                // uint256 totalbridgedusdcrewards = totalBridgedUsdcRewards;
                // uint256 adminbridgedusdcrewards = totalBridgedUsdcFunds.sub(totalBridgedUsdcRewards);
                // totalUsdcRewards = 0;
                // totalUsdcFunds = 0;
                // totalBridgedUsdcRewards = 0;
                // totalBridgedUsdcFunds = 0;
                // _usdc.transfer(receipent, totalusdcrewards);
                // _usdc.transfer(platformAddress, adminusdcrewards);
                // _usdcBridged.transfer(receiverAddress, totalbridgedusdcrewards);
                // _usdcBridged.transfer(platformAddress, adminbridgedusdcrewards);
                uint256 _totalProposerRewards = totalRewards;
                uint256 _totalPlatformRewards = totalFunds.sub(totalRewards);
                totalRewards = 0;
                totalFunds = 0;
                _usdc.transfer(receipent, _totalProposerRewards);
                _usdc.transfer(platformAddress, _totalPlatformRewards);
                isActive = false;
            }
            if(metDeadline && !metGoal) {
                for(uint i=0; i<funders.length; i++) {
                    uint transferableAmount = funderAmount[funders[i]];
                    funderAmount[funders[i]] = 0;
                    if(isUsdcContributer[funders[i]]){
                        _usdc.transfer(funders[i], transferableAmount);
                    }
                    if(!isUsdcContributer[funders[i]]) {
                        _usdcBridged.transfer(funders[i], transferableAmount);
                    }
            }
                isActive = false;
            }
        }

        if(!allowDonationAboveGoalAmount) {
            if(metGoal) {
                uint256 excessUsdcAmount;
                if(msg.value > goalAmount) {
                    excessUsdcAmount = totalRewards.sub(goalAmount);
                    totalRewards = totalRewards.sub(excessUsdcAmount);
                    // uint256 usdcMoneyToPlatform = (totalUsdcRewards.mul(platformFee)).div(uint256(100).sub(platformFee));
                    // _usdc.transfer(platformAddress, usdcMoneyToPlatform);
                    // _usdc.transfer(receiverAddress, totalUsdcRewards);
                    // _usdc.transfer(msg.sender, excessUsdcAmount);
                    // totalUsdcRewards = 0;
                    // usdcMoneyToPlatform = 0;
                    // uint256 bridgedUsdcMoneyToPlatform = (totalBridgedUsdcRewards.mul(platformFee)).div(uint256(100).sub(platformFee));
                    // _usdcBridged.transfer(platformAddress, bridgedUsdcMoneyToPlatform);
                    // _usdcBridged.transfer(receiverAddress, totalBridgedUsdcRewards);
                    // totalBridgedUsdcRewards = 0;
                    // bridgedUsdcMoneyToPlatform = 0;
                    uint256 _totalProposerRewards = totalRewards;
                    uint256 _totalPlatformRewards = totalFunds.sub(totalRewards);
                    totalRewards = 0;
                    totalFunds = 0;
                    _usdc.transfer(receipent, _totalProposerRewards);
                    _usdc.transfer(platformAddress, _totalPlatformRewards);
                    isActive = false;
                }
                if(msg.value == goalAmount){
                    // uint256 usdcMoneyToPlatform = (totalUsdcRewards.mul(platformFee)).div(uint256(100).sub(platformFee));
                    // _usdc.transfer(platformAddress, usdcMoneyToPlatform);
                    // _usdc.transfer(receiverAddress, totalUsdcRewards);
                    // totalUsdcRewards = 0;
                    // usdcMoneyToPlatform = 0;
                    // uint256 bridgedUsdcMoneyToPlatform = (totalBridgedUsdcRewards.mul(platformFee)).div(uint256(100).sub(platformFee));
                    // _usdcBridged.transfer(platformAddress, bridgedUsdcMoneyToPlatform);
                    // _usdcBridged.transfer(receiverAddress, totalBridgedUsdcRewards);
                    // totalBridgedUsdcRewards = 0;
                    // bridgedUsdcMoneyToPlatform = 0;
                    uint256 _totalProposerRewards = totalRewards;
                    uint256 _totalPlatformRewards = totalFunds.sub(totalRewards);
                    totalRewards = 0;
                    totalFunds = 0;
                    _usdc.transfer(receipent, _totalProposerRewards);
                    _usdc.transfer(platformAddress, _totalPlatformRewards);
                    isActive = false;
                }
                isActive = false;
            }
            if(metDeadline && !metGoal) {
                for(uint i=0; i<funders.length; i++) {
                    uint transferableAmount = funderAmount[funders[i]];
                    funderAmount[funders[i]] = 0;
                    if(isUsdcContributer[funders[i]]){
                        _usdc.transfer(funders[i], transferableAmount);
                    }
                    if(!isUsdcContributer[funders[i]]) {
                        _usdcBridged.transfer(funders[i], transferableAmount);
                    }
                }
                isActive = false;
            }
        }
        emit Values(
            receipent, 
            totalUsdcFunds, 
            totalUsdcRewards, 
            metGoal, 
            allowDonationAboveGoalAmount, 
            deadline, 
            goalAmount, 
            deadlineAvailable, 
            goalAmountAvailable
        );
        return (
            address(this).balance,
            goalAmount,
            totalUsdcRewards,
            totalUsdcRewards >= goalAmount,
            deadlineAvailable,
            goalAmountAvailable
        );
    }

    /// function to donate bridged tokens into campaign and swap to the usdc then sends to the campaign
    function addBridgedUsdcFunds(uint256 _amountUsdc) public noReentrant payable returns(uint256, uint256, uint256, bool, bool, bool) {
        if(!isActive) revert FundingToContractEnded();
        require(_amountUsdc > 0, "funds should be greater than 0");
        require(_usdcBridged.allowance(msg.sender, address(this)) >= _amountUsdc, "Not enough USDC approved"); 
        address sender = msg.sender;
        TransferHelper.safeTransferFrom(USDC_E, msg.sender, address(this), _amountUsdc);
        TransferHelper.safeApprove(USDC_E, address(swapRouter), _amountUsdc);
        // IUniswapV3Pool pool = IUniswapV3Pool(0x2aB22ac86b25BD448A4D9dC041Bd2384655299c4);
        ISwapRouter.ExactInputParams memory params =
            ISwapRouter.ExactInputParams({
                path: abi.encodePacked(USDC_E, bridgedUsdcPool.fee(), USDC),
                recipient: address(this),
                deadline: block.timestamp,
                amountIn: _amountUsdc,
                amountOutMinimum: _amountUsdc.mul(100-minimumSlipageFeePercentage).div(100)
        });
        // Executes the swap.
        uint256 _donation  = swapRouter.exactInput(params);
        _depositLogic(sender, _donation);
        // funders.push(msg.sender);
        // isFunder[msg.sender] = true;
        // isUsdcContributer[msg.sender] = false;
        // funderAmount[msg.sender] = funderAmount[msg.sender].add(_donation);
        // totalBridgedUsdcRewards = totalBridgedUsdcRewards.add((_donation.mul(100 - platformFee)).div(100));
        // totalBridgedUsdcFunds = totalBridgedUsdcFunds.add(_donation);
        // totalRewards = totalRewards.add((_donation.mul(100 - platformFee)).div(100));
        // totalFunds = totalFunds.add(_donation);

        bool goalAmountAvailable = goalAmount > 0;
        bool deadlineAvailable = deadline > 0;
        bool metDeadline = deadlineAvailable && deadline <= block.timestamp;
        bool metGoal = totalRewards >= goalAmount;

        if(allowDonationAboveGoalAmount) {
            if (metDeadline && metGoal) {
                // uint256 totalusdcrewards = totalUsdcRewards;
                // uint256 adminusdcrewards = totalUsdcFunds.sub(totalUsdcRewards);
                // uint256 totalbridgedusdcrewards = totalBridgedUsdcRewards;
                // uint256 adminbridgedusdcrewards = totalBridgedUsdcFunds.sub(totalBridgedUsdcRewards);
                // totalUsdcRewards = 0;
                // totalUsdcFunds = 0;
                // totalBridgedUsdcRewards = 0;
                // totalBridgedUsdcFunds = 0;
                // _usdc.transfer(receiverAddress, totalusdcrewards);
                // _usdc.transfer(platformAddress, adminusdcrewards);
                // _usdcBridged.transfer(receiverAddress, totalbridgedusdcrewards);
                // _usdcBridged.transfer(platformAddress, adminbridgedusdcrewards);
                // isActive = false;
                uint256 _totalProposerRewards = totalRewards;
                uint256 _totalPlatformRewards = totalFunds.sub(totalRewards);
                totalRewards = 0;
                totalFunds = 0;
                _usdc.transfer(receipent, _totalProposerRewards);
                _usdc.transfer(platformAddress, _totalPlatformRewards);
                isActive = false;
            }
            if(metDeadline && !metGoal) {
                for(uint i=0; i<funders.length; i++) {
                    uint transferableAmount = funderAmount[funders[i]];
                    funderAmount[funders[i]] = 0;
                    if(isUsdcContributer[funders[i]]){
                        _usdc.transfer(funders[i], transferableAmount);
                    }
                    if(!isUsdcContributer[funders[i]]) {
                        _usdcBridged.transfer(funders[i], transferableAmount);
                    }
            }
                isActive = false;
            }
        }

        if(!allowDonationAboveGoalAmount) {
            if(metGoal) {
                uint256 excessUsdcAmount;
                if(msg.value > goalAmount) {
                    excessUsdcAmount = totalRewards.sub(goalAmount);
                    totalRewards = totalRewards.sub(excessUsdcAmount);
                    // uint256 usdcMoneyToPlatform = (totalUsdcRewards.mul(platformFee)).div(uint256(100).sub(platformFee));
                    // _usdc.transfer(platformAddress, usdcMoneyToPlatform);
                    // _usdc.transfer(receiverAddress, totalUsdcRewards);
                    // _usdc.transfer(msg.sender, excessUsdcAmount);
                    // totalUsdcRewards = 0;
                    // usdcMoneyToPlatform = 0;
                    // uint256 bridgedUsdcMoneyToPlatform = (totalBridgedUsdcRewards.mul(platformFee)).div(uint256(100).sub(platformFee));
                    // _usdcBridged.transfer(platformAddress, bridgedUsdcMoneyToPlatform);
                    // _usdcBridged.transfer(receiverAddress, totalBridgedUsdcRewards);
                    // totalBridgedUsdcRewards = 0;
                    // bridgedUsdcMoneyToPlatform = 0;
                    uint256 _totalProposerRewards = totalRewards;
                    uint256 _totalPlatformRewards = totalFunds.sub(totalRewards);
                    totalRewards = 0;
                    totalFunds = 0;
                    _usdc.transfer(receipent, _totalProposerRewards);
                    _usdc.transfer(platformAddress, _totalPlatformRewards);
                    isActive = false;
                }
                if(msg.value == goalAmount){
                    // uint256 usdcMoneyToPlatform = (totalUsdcRewards.mul(platformFee)).div(uint256(100).sub(platformFee));
                    // _usdc.transfer(platformAddress, usdcMoneyToPlatform);
                    // _usdc.transfer(receiverAddress, totalUsdcRewards);
                    // totalUsdcRewards = 0;
                    // usdcMoneyToPlatform = 0;
                    // uint256 bridgedUsdcMoneyToPlatform = (totalBridgedUsdcRewards.mul(platformFee)).div(uint256(100).sub(platformFee));
                    // _usdcBridged.transfer(platformAddress, bridgedUsdcMoneyToPlatform);
                    // _usdcBridged.transfer(receiverAddress, totalBridgedUsdcRewards);
                    // totalBridgedUsdcRewards = 0;
                    // bridgedUsdcMoneyToPlatform = 0;
                    uint256 _totalProposerRewards = totalRewards;
                    uint256 _totalPlatformRewards = totalFunds.sub(totalRewards);
                    totalRewards = 0;
                    totalFunds = 0;
                    _usdc.transfer(receipent, _totalProposerRewards);
                    _usdc.transfer(platformAddress, _totalPlatformRewards);
                    isActive = false;
                }
            }
            if(metDeadline && !metGoal) {
                for(uint i=0; i<funders.length; i++) {
                    uint transferableAmount = funderAmount[funders[i]];
                    funderAmount[funders[i]] = 0;
                    if(isUsdcContributer[funders[i]]){
                        _usdc.transfer(funders[i], transferableAmount);
                    }
                    if(!isUsdcContributer[funders[i]]) {
                        _usdcBridged.transfer(funders[i], transferableAmount);
                    }
                }
                isActive = false;
            }
        }
        emit Values(
            receipent, 
            totalUsdcFunds, 
            totalUsdcRewards, 
            metGoal, 
            allowDonationAboveGoalAmount, 
            deadline, 
            goalAmount, 
            deadlineAvailable, 
            goalAmountAvailable
        );
        return (
            address(this).balance,
            goalAmount,
            totalUsdcRewards,
            totalUsdcRewards >= goalAmount,
            deadlineAvailable,
            goalAmountAvailable
        );
    }

    /// @notice function to end campaign early and refund to funders and can be called by only proposer or admin
    function endEarlyandRefund() public noReentrant onlyProposerOrAdmin {
        if(!isActive) revert("campaign is not active");
        if(funders.length > 0) {
            for(uint256 i=0; i<funders.length; i++) {
                uint256 transferableAmount = funderAmount[funders[i]];
                funderAmount[funders[i]] = 0;
                if(isUsdcContributer[funders[i]]){
                    _usdc.transfer(funders[i], transferableAmount);
                }
                if(!isUsdcContributer[funders[i]]) {
                    _usdcBridged.transfer(funders[i], transferableAmount);
                }
            }
            isActive = false;
        }
        isActive = false;
    }

    /// @notice function to end the campaign early
    // unlike endEarlyandRedund, this function checks the conditions and according to conditions met it executes
    function endKickStarterCampaign() public noReentrant onlyProposerOrAdmin {
        if(!isActive) revert("campaign is not active");
        bool deadlineAvailable = deadline > 0;
        bool metDeadline = deadlineAvailable && deadline <= block.timestamp;
        bool metGoal = totalRewards >= goalAmount;

        if(allowDonationAboveGoalAmount) {
            if ((metDeadline && metGoal) || (!metDeadline && metGoal)) {
                // uint256 totalusdcrewards = totalUsdcRewards;
                // uint256 adminusdcrewards = totalUsdcFunds.sub(totalUsdcRewards);
                // uint256 totalbridgedusdcrewards = totalBridgedUsdcRewards;
                // uint256 adminbridgedusdcrewards = totalBridgedUsdcFunds.sub(totalBridgedUsdcRewards);
                // totalUsdcRewards = 0;
                // totalUsdcFunds = 0;
                // totalBridgedUsdcRewards = 0;
                // totalBridgedUsdcFunds = 0;
                // _usdc.transfer(receiverAddress, totalusdcrewards);
                // _usdc.transfer(platformAddress, adminusdcrewards);
                // _usdcBridged.transfer(receiverAddress, totalbridgedusdcrewards);
                // _usdcBridged.transfer(platformAddress, adminbridgedusdcrewards);
                // isActive = false;
                uint256 _totalProposerRewards = totalRewards;
                uint256 _totalPlatformRewards = totalFunds.sub(totalRewards);
                totalRewards = 0;
                totalFunds = 0;
                _usdc.transfer(receipent, _totalProposerRewards);
                _usdc.transfer(platformAddress, _totalPlatformRewards);
                isActive = false;
            }
            if(metDeadline && !metGoal) {
                for(uint i=0; i<funders.length; i++) {
                    uint transferableAmount = funderAmount[funders[i]];
                    funderAmount[funders[i]] = 0;
                    if(isUsdcContributer[funders[i]]){
                        _usdc.transfer(funders[i], transferableAmount);
                    }
                    if(!isUsdcContributer[funders[i]]) {
                        _usdcBridged.transfer(funders[i], transferableAmount);
                    }
                }
                isActive = false;
            }
        }
        if(!allowDonationAboveGoalAmount) {
            if(metGoal) {
                // uint256 totalusdcrewards = totalUsdcRewards;
                // uint256 adminusdcrewards = totalUsdcFunds.sub(totalUsdcRewards);
                // uint256 totalbridgedusdcrewards = totalBridgedUsdcRewards;
                // uint256 adminbridgedusdcrewards = totalBridgedUsdcFunds.sub(totalBridgedUsdcRewards);
                // totalUsdcRewards = 0;
                // totalUsdcFunds = 0;
                // totalBridgedUsdcRewards = 0;
                // totalBridgedUsdcFunds = 0;
                // _usdc.transfer(receiverAddress, totalusdcrewards);
                // _usdc.transfer(platformAddress, adminusdcrewards);
                // _usdcBridged.transfer(receiverAddress, totalbridgedusdcrewards);
                // _usdcBridged.transfer(platformAddress, adminbridgedusdcrewards);
                // isActive = false;
                uint256 _totalProposerRewards = totalRewards;
                uint256 _totalPlatformRewards = totalFunds.sub(totalRewards);
                totalRewards = 0;
                totalFunds = 0;
                _usdc.transfer(receipent, _totalProposerRewards);
                _usdc.transfer(platformAddress, _totalPlatformRewards);
                isActive = false;
            }
            if(metDeadline && !metGoal) {
                for(uint i=0; i<funders.length; i++) {
                    uint transferableAmount = funderAmount[funders[i]];
                    funderAmount[funders[i]] = 0;
                    if(isUsdcContributer[funders[i]]){
                        _usdc.transfer(funders[i], transferableAmount);
                    }
                    if(!isUsdcContributer[funders[i]]) {
                        _usdcBridged.transfer(funders[i], transferableAmount);
                    }
                }
                isActive = false; 
            }
        }
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

    function giftNfts(address _nft , uint256 _tokenId, uint256 _amount) public noReentrant {
        if (!isActive) revert FundingToContractEnded();
        IERC1155 nfts = IERC1155(_nft);
        nfts.safeTransferFrom(msg.sender,receipent, _tokenId, _amount,"");
        emit Donation(msg.sender,_nft,DonationType.GIFT,TokenType.NFT,_amount);
    }

    function giftNfts(address _nft , uint256 _tokenId) public noReentrant {
        if (!isActive) revert FundingToContractEnded();
        IERC721 nft = IERC721(_nft);
        nft.safeTransferFrom(msg.sender,receipent,_tokenId);
        emit Donation(msg.sender,_nft,DonationType.GIFT,TokenType.NFT,1);
    }


    function giftTokens(address _token, uint256 _amount) public noReentrant {
        if (!isActive) revert FundingToContractEnded();
        TransferHelper.safeTransferFrom(_token, msg.sender, receipent, _amount);
        emit Donation(msg.sender, _token, DonationType.GIFT, TokenType.TOKEN,_amount);

    }
}