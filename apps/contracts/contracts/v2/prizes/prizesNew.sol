//SPDX-License-Identifier:MIT
pragma solidity ^0.8.1;

import "./SubmissionLibrary.sol";
import "./SubmissionAVLTree.sol";
import "./hashLibrary.sol";
import "./errorEventsLibrary.sol";
import "../../helperContracts/safemath.sol";
import "../../helperContracts/ierc20_permit.sol";                                         
import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";
import "@uniswap/v3-core/contracts/interfaces/IUniswapV3Pool.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "../../helperContracts/ierc20_weth.sol";
import "../../helperContracts/nonReentrant.sol";
import "./logicFunctions.sol";
import "./LogicFunctionsLibrary.sol";

contract PrizeV2 is ReentrancyGuard {
    
    bytes32 public constant REFUND_SUBMISSION_HASH = keccak256(abi.encodePacked("REFUND"));

    using VoteLibrary for *;
    using ErrorLibrary for *;

    /// @notice this will be the total amount of funds raised
    uint256 public totalFunds; 
    /// @notice this will be the total amount of rewards available
    uint256 public totalRewards; 
    /// @notice bool to check if rewards have been distributed with end_voting_period
    bool public distributed;
    bool public refunded;
    /// @notice this will be the time that the voting period ends
    uint256 private votingTime; 
    /// @notice this will be the time that the submission period ends
    uint256 private submissionTime;
    /// @notice  this will be a mapping of the addresses of the proposers to a boolean value of true or false
    mapping (address => bool) public isProposer;
    /// @notice  person who proposed the prize;
    address public proposer;
    /// @notice this will be a mapping of the addresses of the funders to the amount of usd they have contributed
    mapping (address => uint256) public cryptoFunderAmount;
    mapping(address => uint256) public fiatFunderAmount;
    /// @notice array of funders
    address[] private cryptoFunders;
    address[] private fiatFunders;
    // mapping(address => bool) public isCryptoFunder;
    // mapping(address => bool) public isFiatFunder;
    /// @notice Add a new mapping to store each funder's votes on each submission
    mapping(address => mapping(bytes32 => uint256)) public funderVotes;
    address[] private refundRequestedFunders;
    mapping(address => bool) public isRefundRequestedAddress;
    mapping(address => bool) public isContestant;
    mapping(address => uint256) public individualFiatPercentage;
    mapping(address => uint256) public individualCryptoPercentage;
    mapping(address => uint256) public totalFunderAmount;

    bool public isActive = false;
    uint8 public constant  VERSION = 201;
    // bool private _locked;

    using SafeMath for uint256;

    uint8 private proposerFee;
    uint8 private platformFee;

    bool public votingPeriod = false;
    bool public submissionPeriod = false;
        
    address[] private platformAdmins;
    mapping(address => bool) public isPlatformAdmin;

    IERC20Permit private immutable _usdc;
    IERC20Permit private immutable _usdcBridged;
    
    /// @notice minimum slippage fee percentage for minimum output in swap
    uint8 public minimumSlipageFeePercentage = 2; 

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

    /// @notice this will be the address of the platform
    address private immutable platformAddress = 0x1f00DD750aD3A6463F174eD7d63ebE1a7a930d0c;

    /// @notice / @notice _submissionTree contract
    SubmissionAVLTree private _submissionTree;

    LogicContract private _logicFunctions;

    uint256 private totalVotes;
    uint256 public disputePeriod;
    uint256 private nonce;

    constructor(address _proposer, address[] memory _platformAdmins, uint8 _platFormFee, uint8 _proposerFee, address _usdcAddress, address _usdcBridgedAddress , address _swapRouter ,address _usdcToUsdcePool,address _usdcToEthPool,address _ethPriceAggregator,address _wethToken) {
        /// @notice add as many proposer addresses as you need to -- replace msg.sender with the address of the proposer(s) for now this means the deployer will be the sole admin

        proposer = _proposer;
        isProposer[proposer] = true;
        for (uint i = 0; i < _platformAdmins.length; i++) {
            platformAdmins.push(_platformAdmins[i]);
            isPlatformAdmin[_platformAdmins[i]] = true;
        }
        /// @notice  Initialize the _submissionTree
        _submissionTree = SubmissionAVLTree(SubmissionLibrary.deploySubmission(address(this)));
        _logicFunctions = LogicContract(LogicLibrary.deployLogicFunctions(address(this), _proposerFee, _platFormFee, _usdcAddress));
        proposerFee = _logicFunctions.proposerFee();
        proposerFee = _proposerFee;
        platformFee = _platFormFee;
        _usdc = IERC20Permit(_usdcAddress);
        _usdcBridged = IERC20Permit(_usdcBridgedAddress);
        isActive = true;
        swapRouter = ISwapRouter(_swapRouter);
        bridgedUsdcPool = IUniswapV3Pool(_usdcToUsdcePool);
        ethUsdcPool = IUniswapV3Pool(_usdcToEthPool);
        ethPriceAggregator = AggregatorV3Interface(_ethPriceAggregator);
        _weth = IWETH(_wethToken);
        _submissionTree.addSubmission(platformAdmins[0], REFUND_SUBMISSION_HASH, "REFUND");
        
        emit ErrorLibrary.CampaignCreated(proposer, address(this));
    }

    function _onlyActive() private view {
        if(!isActive) revert ErrorLibrary.NotActive();
    }

    modifier onlyActive() {
        _onlyActive();        
        _;
    }

    function _onlyPlatformAdmin() private view {
        if(!isPlatformAdmin[msg.sender]) revert ErrorLibrary.NP();
    }

    modifier onlyPlatformAdmin() {
        _onlyPlatformAdmin();
        _;
    }

    function _onlyPlatformAdminOrProposer() private view {
        if(!(isPlatformAdmin[msg.sender] || isProposer[msg.sender])) revert ErrorLibrary.NPP();
    }

    modifier onlyPlatformAdminOrProposer() {
        // require(isPlatformAdmin[msg.sender] || isProposer[msg.sender], "NPP");
        _onlyPlatformAdminOrProposer();
        _;
    }

    function _disputePeriodActive() private view {
        if(disputePeriod < block.timestamp) revert ErrorLibrary.DPNA();
    }

    modifier disputePeriodActive() {
        _disputePeriodActive();
        _;
    }

    /// @notice create a function to start the submission period
    function startSubmissionPeriod(uint256 _submissionTime) public  onlyPlatformAdminOrProposer onlyActive {
        /// @notice submission time will be in minutes
        submissionTime = block.timestamp + _submissionTime * 1 minutes;
        submissionPeriod = true;
        emit ErrorLibrary.SubmissionStarted(block.timestamp, submissionTime);
    }

    /// @notice start the voting period 
    function startVotingPeriod(uint256 _votingTime) public  onlyPlatformAdminOrProposer onlyActive {
        if(block.timestamp < submissionTime) revert ErrorLibrary.SubmissionPeriodActive();
        /// @notice voting time also in minutes
        votingTime = block.timestamp + _votingTime * 1  minutes;
        /// @notice  tracks voting period
        votingPeriod = true;
        emit ErrorLibrary.VotingStarted(block.timestamp, votingTime);
    }

    /// @notice getter for submission time
    function getSubmissionTime() public view returns (uint256) {
        return submissionTime;
    }

    /// @notice getter for voting time
    function getVotingTime() public view returns (uint256) {
        return votingTime;
    }

    function endSubmissionPeriod() public onlyPlatformAdmin onlyActive{
        if(submissionTime == 0) revert ErrorLibrary.SubmissionPeriodNotActive();
        submissionPeriod = false;
        submissionTime = 0;
        SubmissionAVLTree.SubmissionInfo[] memory allSubmissions = getAllSubmissions();
        if(allSubmissions.length == 1 ) {
            for(uint256 i=0; i<cryptoFunders.length; i++) {
                uint256 transferable_amount = cryptoFunderAmount[cryptoFunders[i]];
                cryptoFunderAmount[cryptoFunders[i]] = 0;
                _usdc.transfer(cryptoFunders[i], transferable_amount);
            }
            for(uint256 i=0; i<fiatFunders.length; i++) {
                uint256 transferable_amount = fiatFunderAmount[fiatFunders[i]];
                fiatFunderAmount[fiatFunders[i]] = 0;
                _usdc.transfer(platformAddress, transferable_amount);
                emit ErrorLibrary.fiatFunderRefund(fiatFunders[i], transferable_amount, true);
            }
            refunded = true;
            distributed = true;
            isActive = false;
        }
        emit ErrorLibrary.SubmissionEnded(block.timestamp);
    }

    function endVotingPeriod() public onlyPlatformAdmin onlyActive {
        if(votingTime == 0) revert ErrorLibrary.VotingPeriodNotActive();
        votingTime = 0;
        votingPeriod = false;
        disputePeriod = block.timestamp + 2 days;
        emit ErrorLibrary.VotingEnded(block.timestamp);
    }

    function raiseDispute(bytes32 _submissionHash, uint8 v, bytes32 s, bytes32 r) public onlyActive disputePeriodActive {
        bytes32 signedMessageHash = VoteLibrary.DISPUTE_HASH(address(this), nonce+=1, _submissionHash);
        SubmissionAVLTree.SubmissionInfo memory submission = _submissionTree.getSubmission(_submissionHash);

        address sender =  ecrecover(signedMessageHash, v, r, s);
        if(sender != submission.contestant) revert ErrorLibrary.NAS(); //NAS - Not a Submitter
        emit ErrorLibrary.DisputeRaised(_submissionHash, sender);
    }

    function endDispute() public onlyPlatformAdmin disputePeriodActive onlyActive {
        _distributeUnusedVotes();
        _distributeRewards();
        isActive = false;
        emit ErrorLibrary.DisputeEnded(block.timestamp);
    }

    function changeSubmissionPeriod(uint256 _submissionTime) public onlyPlatformAdmin onlyActive {
        if(votingPeriod) revert ErrorLibrary.VotingPeriodActive();
        if(!submissionPeriod) revert ErrorLibrary.SubmissionPeriodNotActive();
        submissionTime = block.timestamp + _submissionTime * 1 minutes;
    }

    function changeVotingPeriod(uint256 _votingTime) public onlyPlatformAdmin onlyActive {
        if(!votingPeriod) revert ErrorLibrary.VotingPeriodNotActive();
        if(distributed == true) revert ErrorLibrary.RewardsAlreadyDistributed();
        votingTime = block.timestamp + _votingTime * 1 minutes;
    }

    function _distributeRewardsLogic(uint256 reward) private {
        for(uint256 j=0; j<refundRequestedFunders.length; j++) {
            uint256 reward_amount = _submissionTree.submissionFunderBalances(REFUND_SUBMISSION_HASH,refundRequestedFunders[j]);
            reward -= reward_amount;
            if(reward_amount > 0) {
                if(_logicFunctions.isFiatFunder(refundRequestedFunders[j]) && _logicFunctions.isCryptoFunder(refundRequestedFunders[j])) {
                    uint256 fiatToSend = (reward_amount.mul(individualFiatPercentage[refundRequestedFunders[j]])).div(100);
                    uint256 cryptoToSend = (reward_amount.mul(individualCryptoPercentage[refundRequestedFunders[j]])).div(100);
                    reward_amount = 0;
                    _usdc.transfer(platformAddress, fiatToSend);
                    emit ErrorLibrary.fiatFunderRefund(refundRequestedFunders[j], fiatToSend, true);
                    _usdc.transfer(refundRequestedFunders[j], cryptoToSend);
                } else if(_logicFunctions.isFiatFunder(refundRequestedFunders[j])) {
                    _usdc.transfer(platformAddress, reward_amount);
                    emit ErrorLibrary.fiatFunderRefund(refundRequestedFunders[j], reward_amount, true);
                    reward_amount = 0;
                } else if(_logicFunctions.isCryptoFunder(refundRequestedFunders[j])) {
                    _usdc.transfer(refundRequestedFunders[j], reward_amount);
                    reward_amount = 0;
                }
            }
        }
    }

    /// @notice Distribute rewards
    function _distributeRewards() private {
        if(distributed == true) revert ErrorLibrary.RewardsAlreadyDistributed();
        SubmissionAVLTree.SubmissionInfo[] memory allSubmissions = getAllSubmissions();
        uint256 usdcPlatformReward;
        uint256 usdcProposerReward;
        if(allSubmissions.length > 0 && totalVotes > 0 ) {
            /// @notice  Count the number of funded submissions and add them to the fundedSubmissions array
            for (uint256 i = 0; i < allSubmissions.length;) {
                if(allSubmissions[i].funded && allSubmissions[i].usdcVotes > 0) {
                    uint256 reward = allSubmissions[i].usdcVotes;
                    if(allSubmissions[i].submissionHash == REFUND_SUBMISSION_HASH && reward > 0) {
                        _distributeRewardsLogic(reward);
                    } else {
                        allSubmissions[i].usdcVotes = 0;
                        _usdc.transfer(allSubmissions[i].contestant, reward);
                    }
                }
                unchecked { ++i; }
            }
            totalRewards = 0;
            if(totalFunds > 0) {
                usdcPlatformReward = (totalFunds * platformFee) / 100;
                usdcProposerReward = (totalFunds * proposerFee) / 100;
                totalFunds = totalFunds.sub(usdcPlatformReward.add(usdcProposerReward));
                _usdc.transfer(platformAddress, usdcPlatformReward);
                _usdc.transfer(proposer, usdcProposerReward);
            }
            distributed = true;
        }
        if(totalVotes == 0) {
            for(uint256 i=0; i<cryptoFunders.length; i++) {
                _usdc.transfer(cryptoFunders[i], cryptoFunderAmount[cryptoFunders[i]]);
                cryptoFunderAmount[cryptoFunders[i]] = 0;
            }
            for(uint256 i=0; i<fiatFunders.length; i++) {
                _usdc.transfer(platformAddress, fiatFunderAmount[fiatFunders[i]]);
                emit ErrorLibrary.fiatFunderRefund(fiatFunders[i], fiatFunderAmount[fiatFunders[i]], true);
                fiatFunderAmount[fiatFunders[i]] = 0;
            }
            distributed = true;
        }
    }

    /// @notice addSubmission should return the submissionHash
    function addSubmission(address contestant, string memory submissionText) public onlyActive onlyPlatformAdmin nonReentrant returns(bytes32) {
        if (block.timestamp > submissionTime) revert ErrorLibrary.SubmissionPeriodNotActive();
        if(isContestant[contestant]) revert ErrorLibrary.CAE(); // CAE -> Contestant already Exists
        bytes32 submissionHash = keccak256(abi.encodePacked(contestant, submissionText));
        isContestant[contestant] = true;
        _submissionTree.addSubmission(contestant, submissionHash, submissionText);
        emit ErrorLibrary.SubmissionCreated(contestant, submissionHash);
        return submissionHash;
    }

    function _voteLogic(uint256 _amount, bytes32 _submissionHash, address sender) private {
        _logicFunctions.voteLogic(_amount, _submissionHash, sender);
        uint256 amountToSubmission = (_amount * (100 - platformFee - proposerFee)) / 100;
        _submissionTree.addUsdcVotes(_submissionHash, amountToSubmission);
        _submissionTree.updateFunderVotes(_submissionHash, sender, (funderVotes[sender][_submissionHash] * (100-platformFee-proposerFee))/100);
        
        totalVotes = totalVotes.add(amountToSubmission);
        SubmissionAVLTree.SubmissionInfo memory submission = _submissionTree.getSubmission(_submissionHash);
        if (submission.usdcVotes > 0) {
            _submissionTree.setFundedTrue(_submissionHash, true);
        }
        emit ErrorLibrary.Voted(_submissionHash, sender, _amount);
    }

    /// @notice create a function to allow funders to vote for a submission
    /// @notice  Update the vote function
    function vote(bytes32 _submissionHash, uint256 _amount, uint8 v, bytes32 s, bytes32 r) onlyActive nonReentrant public {
        if (block.timestamp > votingTime) revert ErrorLibrary.VotingPeriodNotActive();
        bytes32 hash = VoteLibrary.VOTE_HASH(address(this), nonce+=1, _submissionHash, _amount);
        address sender =  ecrecover(hash, v, r, s);
        if(!(_logicFunctions.isFiatFunder(sender) || _logicFunctions.isCryptoFunder(sender))) revert ErrorLibrary.NAF(); // NAF -> Not a Funder
        if (_amount > totalFunderAmount[sender]) revert ErrorLibrary.NotEnoughFunds();

        SubmissionAVLTree.SubmissionInfo memory submissionCheck = _submissionTree.getSubmission(_submissionHash);
        /// @notice submission should return a struct with the submissionHash, the contestant, the submissionText, the threshhold, the votes, and the funded status 
        //  -- check if the submission hash is in the tree
        if (submissionCheck.submissionHash != _submissionHash) revert ErrorLibrary.SubmissionDoesntExist();
        if(_submissionHash == REFUND_SUBMISSION_HASH) {
            if(!isRefundRequestedAddress[sender]) {
                refundRequestedFunders.push(sender);
                isRefundRequestedAddress[sender] = true;
            }
        }
        _voteLogic(_amount, _submissionHash, sender);
    }

    function _changeSubmissionVoteLogic(bytes32 _previousSubmissionHash, bytes32 _newSubmissionHash) private {

        SubmissionAVLTree.SubmissionInfo memory previousSubmission = _submissionTree.getSubmission(_previousSubmissionHash);

        if (previousSubmission.usdcVotes <= 0) {
            _submissionTree.setFundedTrue(_previousSubmissionHash, false);
        }

        SubmissionAVLTree.SubmissionInfo memory newSubmission = _submissionTree.getSubmission(_newSubmissionHash);

        if (newSubmission.usdcVotes > 0) {
            _submissionTree.setFundedTrue(_newSubmissionHash, true);
        }
    }

    /// @notice Change_votes should now stop folks from being able to change someone elses vote
    function changeVote(bytes32 _previous_submissionHash, bytes32 _new_submissionHash, uint8 v, bytes32 s, bytes32 r, uint256 amount) onlyActive nonReentrant public {
        if (block.timestamp > votingTime) revert ErrorLibrary.VotingPeriodNotActive();
        if(_previous_submissionHash == _new_submissionHash) revert ErrorLibrary.SS(); //SME -> Same Submission
        bytes32 signedMessageHash = VoteLibrary.CHANGE_VOTE_HASH(address(this), nonce+=1, _previous_submissionHash, amount, _new_submissionHash);
        address sender = ecrecover(signedMessageHash, v, r, s);
        if (funderVotes[sender][_previous_submissionHash] < amount) revert ErrorLibrary.NotYourVote();
        if(!_logicFunctions.isCryptoFunder(sender) || !_logicFunctions.isFiatFunder(sender)) revert ErrorLibrary.NAF(); // NF -> Not a Funder
        _changeVote(sender, _previous_submissionHash, _new_submissionHash, amount);
        _changeSubmissionVoteLogic(_previous_submissionHash, _new_submissionHash);
        emit ErrorLibrary.Voted(_new_submissionHash, sender, amount);
    }

    function _changeVote(address _sender,bytes32 _previous_submission_hash,bytes32 _new_submission_hash,uint256 amount) private {
        uint256 amountToSubmission = (amount * (100 - platformFee - proposerFee)) / 100;
        if(_new_submission_hash == REFUND_SUBMISSION_HASH && !isRefundRequestedAddress[_sender]){
            refundRequestedFunders.push(_sender);
            isRefundRequestedAddress[_sender] = true;
        }
        _submissionTree.subUsdcVotes(_previous_submission_hash, amountToSubmission);
        _submissionTree.addUsdcVotes(_new_submission_hash, amountToSubmission);
        funderVotes[_sender][_previous_submission_hash] -= amount;
        funderVotes[_sender][_new_submission_hash] += amount;
        _submissionTree.updateFunderVotes(_previous_submission_hash, _sender, (funderVotes[_sender][_previous_submission_hash]*(100-platformFee-proposerFee))/100);
        _submissionTree.updateFunderVotes(_new_submission_hash, _sender, (funderVotes[_sender][_new_submission_hash]*(100-platformFee - proposerFee))/100);
        if(_previous_submission_hash == REFUND_SUBMISSION_HASH && _submissionTree.submissionFunderBalances(REFUND_SUBMISSION_HASH,_sender) == 0) {
            isRefundRequestedAddress[_sender] = false;
        }
    }
    function disputeChangeVote( bytes32  _previousSubmissionHash, bytes32 _newSubmissionHash, address[] calldata _funders, uint256[] calldata _amounts) onlyActive onlyPlatformAdmin disputePeriodActive public {
        if(_funders.length != _amounts.length) revert ErrorLibrary.LM(); //LM -> Length Mismatch
        for (uint256 i = 0; i < _funders.length; i++) {
            _changeVote(_funders[i], _previousSubmissionHash, _newSubmissionHash, _amounts[i]);
        }
        _changeSubmissionVoteLogic(_previousSubmissionHash, _newSubmissionHash);
    }

    /// @notice uses functionality of the AVL tree to get all submissions
    function getAllSubmissions() public view returns (SubmissionAVLTree.SubmissionInfo[] memory) {
        return _submissionTree.getAllSubmissions();
    }

    /// @notice get submission by submissionHash
    function getSubmissionByHash(bytes32 submissionHash) public view returns (SubmissionAVLTree.SubmissionInfo memory){
        SubmissionAVLTree.SubmissionInfo memory submission = _submissionTree.getSubmission(submissionHash);
        return submission;
    }

    function getTotalAndRewards() public view returns(uint256, uint256) {
        return(_logicFunctions.totalFunds(), _logicFunctions.totalRewards());
    }
    

    function addUsdcFunds(address spender, uint256 _amountUsdc, uint256 _deadline, uint8 v, bytes32 s, bytes32 r, bytes32 _ethSignedMessageHash, bool _fiatPayment) public onlyActive nonReentrant payable {
        // require(_amountUsdc > 0, "F<0"); // F<0 -> funds should be greater than zero.
        if(_amountUsdc <= 0) revert ErrorLibrary.NotEnoughFunds();
        address sender = ecrecover(_ethSignedMessageHash, v, r, s);
        _usdc.permit(sender, spender, _amountUsdc, _deadline,v,r,s);
        if(_fiatPayment) {
            if(!_logicFunctions.isFiatFunder(sender)) {
                fiatFunders.push(sender);
                _logicFunctions.setFiatFunderStatus(sender, true);
            }
            fiatFunderAmount[sender] = fiatFunderAmount[sender].add(_amountUsdc);
            totalFunderAmount[sender] = totalFunderAmount[sender].add(_amountUsdc);
            totalRewards = totalRewards.add((_amountUsdc.mul(100 - (platformFee + proposerFee))).div(100));
            individualFiatPercentage[sender] = (fiatFunderAmount[sender].mul(100)).div(totalFunderAmount[sender]);
            individualCryptoPercentage[sender] = (cryptoFunderAmount[sender].mul(100)).div(totalFunderAmount[sender]);
            totalFunds = totalFunds.add(_amountUsdc);
        }
        else {
            _logicFunctions.depositLogic(sender, _amountUsdc);
        }
        _usdc.transferFrom(sender, address(this), _amountUsdc);
        emit ErrorLibrary.Donation(sender, address(_usdc), ErrorLibrary.DonationType.PAYMENT, ErrorLibrary.TokenType.TOKEN, _fiatPayment, _amountUsdc);
    }

    function _swapRouterLogic(address sender, uint256 _amountUsdc, address swapFrom, uint256 poolFee, uint256 _amountOutMinimum ) private {
        ISwapRouter.ExactInputParams memory params =
            ISwapRouter.ExactInputParams({
                path: abi.encodePacked(address(_usdcBridged), poolFee, address(_usdc)),
                recipient: address(this),
                deadline: block.timestamp,
                amountIn: _amountUsdc,
                amountOutMinimum: _amountOutMinimum
        });
        uint256 _donation  = swapRouter.exactInput(params);
        _logicFunctions.depositLogic(sender, _donation);
        emit ErrorLibrary.Donation(sender, swapFrom, ErrorLibrary.DonationType.PAYMENT, ErrorLibrary.TokenType.TOKEN, false, _donation);
    }

    function addBridgedUsdcFunds(uint256 _amountUsdc) public onlyActive nonReentrant payable {
        if(_amountUsdc <= 0) revert ErrorLibrary.NotEnoughFunds();
        address sender = msg.sender; 
        _usdcBridged.transferFrom(sender,address(this),_amountUsdc);
        _usdcBridged.approve(address(swapRouter), _amountUsdc);
        uint256 _amountOutMinimum = _amountUsdc.mul(100-minimumSlipageFeePercentage).div(100);
        _swapRouterLogic(sender, _amountUsdc, address(_usdcBridged), bridgedUsdcPool.fee(), _amountOutMinimum );
    }

    /// @notice function to donate eth into the campaign
    function addEthFunds(uint256 _amountOutMinimum) public onlyActive nonReentrant payable  {
        if(msg.value <= 0) revert ErrorLibrary.NotEnoughFunds();
        uint256 eth_donation =  msg.value;
        address sender = msg.sender;
        _weth.deposit{value:msg.value}();
        _weth.approve(address(swapRouter), eth_donation);
        _swapRouterLogic(sender, eth_donation, address(_usdcBridged), bridgedUsdcPool.fee(), _amountOutMinimum );
    }

    function addTokenFunds(address _voter, uint256 _amount, uint256 _deadline, uint8 v, bytes32 s, bytes32 r, bytes32 _ethSignedMessageHash, bool _fiatPayment) public {
        address sender = ecrecover(_ethSignedMessageHash, v, r, s);
        _usdc.permit(sender, address(this), _amount, _deadline,v,r,s);
        if(_fiatPayment) {
            if(!_logicFunctions.isFiatFunder(_voter)) {
                fiatFunders.push(_voter);
                _logicFunctions.setFiatFunderStatus(_voter, true);
            }
            fiatFunderAmount[_voter] = fiatFunderAmount[_voter].add(_amount);
            totalFunderAmount[_voter] = totalFunderAmount[_voter].add(_amount);
            totalRewards = totalRewards.add((_amount.mul(100 - (platformFee + proposerFee))).div(100));
            individualFiatPercentage[_voter] = (fiatFunderAmount[sender].mul(100)).div(totalFunderAmount[_voter]);
            individualCryptoPercentage[_voter] = (cryptoFunderAmount[sender].mul(100)).div(totalFunderAmount[_voter]);
            totalFunds = totalFunds.add(_amount);
        }
        else {
            _logicFunctions.depositLogic(_voter, _amount);
        }
        _usdc.transferFrom(sender, address(this), _amount);
        emit ErrorLibrary.Donation(sender, address(_usdc), ErrorLibrary.DonationType.PAYMENT, ErrorLibrary.TokenType.TOKEN, _fiatPayment, _amount);
    }

    /// @notice external function to receive eth funds
    receive() external payable {
        uint ethValue = msg.value;
        uint decimals = ethPriceAggregator.decimals() - uint256(_usdc.decimals());
        (, int256 latestPrice , , ,)  = ethPriceAggregator.latestRoundData();
        uint price_in_correct_decimals = uint(latestPrice)/ (10 ** decimals);
        addEthFunds((ethValue / price_in_correct_decimals).mul(100-minimumSlipageFeePercentage).div(100));
    }

   /// @notice this fn sends the unused votes to the contestant based on their previous votes.
    function _distributeUnusedVotes() private {
       uint256 total_usdc_votes = 0;       
       SubmissionAVLTree.SubmissionInfo[] memory allSubmissions = getAllSubmissions();
       for(uint256 i=0; i<allSubmissions.length; i++) {
           total_usdc_votes += allSubmissions[i].usdcVotes;
       }
       uint256 total_unused_usdc_votes = totalRewards.sub(total_usdc_votes);
       for(uint256 i=0; i<allSubmissions.length; i++) {
            if(total_unused_usdc_votes > 0 && allSubmissions[i].usdcVotes > 0) {
                uint256 individual_usdc_percentage = ((allSubmissions[i].usdcVotes.mul(10000)).div(total_usdc_votes));
                uint256 transferable_usdc_amount = (total_unused_usdc_votes.mul(individual_usdc_percentage)).div(10000);
                if(allSubmissions[i].submissionHash == REFUND_SUBMISSION_HASH) {
                    _logicFunctions.unusedRefundSubmissionLogic(transferable_usdc_amount, total_unused_usdc_votes);
                } else {
                    if(transferable_usdc_amount > 0) {
                        _usdc.transfer(allSubmissions[i].contestant, transferable_usdc_amount);
                    }
                }
            } 
       }
   }

   /// @notice backdoor function to withdraw tokens
   /// @param _tokenAddress contract address of the token
   /// @param _to receiver address
   /// @param _amount amount to withdraw
   function withdrawTokens(address _tokenAddress, address _to, uint256 _amount) public onlyPlatformAdmin nonReentrant {
        IERC20Permit token = IERC20Permit(_tokenAddress);
        uint256 balance = token.balanceOf(address(this));
        if(balance == 0) revert("TNE"); //TNE -> Tokens Not Exists
        require(_amount <= balance, "AEB"); //AEB -> Amount Exceeds Balance
        totalFunds = totalFunds.sub(_amount);
        totalRewards = totalRewards.sub(_amount);
        token.transfer(_to, _amount); 
   }

   /// @notice function to retrieve all the cryptoFunders
   function getAllCryptoFunders() public view returns(address[] memory) {
        return cryptoFunders;
   }

   /// @notice function to retrieve all the fiat funders
   function getAllFiatFunders() public view returns(address[] memory) {
    return fiatFunders;
   }

   /// @notice function to retrieve all the platformAdmins
   function getAllPlatformAdmins() public view returns(address[] memory) {
        return platformAdmins;
   }

   /// @notice function to end the dispute period early
   function endDisputePeriodEarly() public onlyActive onlyPlatformAdmin {
        disputePeriod = block.timestamp - 1 seconds;
        endDispute();
   }

    /// @notice function to change slippage tolerance of other token donations
    /// @param _minimumSlipageFeePercentage of new minimumSlipageFeePercentage
    function changeMinimumSlipageFeePercentage(uint8 _minimumSlipageFeePercentage) public onlyPlatformAdmin {
        minimumSlipageFeePercentage  = _minimumSlipageFeePercentage;
    } 
} 