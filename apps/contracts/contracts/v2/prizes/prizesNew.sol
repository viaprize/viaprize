//SPDX-License-Identifier:MIT
pragma solidity ^0.8.1;

import "./helperLibraries/SubmissionLibrary.sol";
import "./logicContracts/SubmissionAVLTree.sol";
import "./helperLibraries/hashLibrary.sol";
import "./helperLibraries/errorEventsLibrary.sol";
import "./logicContracts/logicFunctions.sol";
import "./helperLibraries/LogicFunctionsLibrary.sol";
import "../../helperContracts/safemath.sol";
import "../../helperContracts/ierc20_permit.sol";   
import "../../helperContracts/ierc20_weth.sol";
import "../../helperContracts/nonReentrant.sol";                                      
import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";
import "@uniswap/v3-core/contracts/interfaces/IUniswapV3Pool.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract PrizeV2 is ReentrancyGuard {
    
    /// @notice this will be the total amount of funds raised
    // uint256 public totalFunds; 
    /// @notice this will be the total amount of rewards available
    // uint256 public totalRewards; 
    uint256 public disputePeriod;
    /// @notice bool to check if rewards have been distributed with end_voting_period
    uint256 private totalVotes;
    uint256 private nonce;
    uint256 private votingTime; 
    /// @notice this will be the time that the submission period ends
    uint256 private submissionTime;
    uint8 private immutable proposerFee;
    uint8 private immutable platformFee;
    /// @notice this will be the time that the voting period ends
    

    bool public isActive = false;
    uint8 public constant  VERSION = 201;
    bool public distributed;
    bool public refunded;
    bool public votingPeriod = false;
    bool public submissionPeriod = false;

    /// @notice  person who proposed the prize;
    address public proposer;
    /// @notice this will be the address of the platform
    address private immutable platformAddress = 0x1f00DD750aD3A6463F174eD7d63ebE1a7a930d0c;
    address[] private platformAdmins;

    /// @notice  this will be a mapping of the addresses of the proposers to a boolean value of true or false
    mapping(address => bool) public isProposer;
    mapping(address => bool) public isContestant;
    mapping(address => bool) public isPlatformAdmin;
    
    /// @notice array of funders
    // address[] private cryptoFunders;
    // address[] private fiatFunders;
    address[] private refundRequestedFunders;
    // mapping(address => bool) public isCryptoFunder;
    // mapping(address => bool) public isFiatFunder;
    mapping(address => bool) public isRefundRequestedAddress;
    /// @notice this will be a mapping of the addresses of the funders to the amount of usd they have contributed
    // mapping(address => uint256) public cryptoFunderAmount;
    // mapping(address => uint256) public fiatFunderAmount;
    // mapping(address => uint256) public totalFunderAmount;
    // mapping(address => uint256) public individualFiatPercentage;
    // mapping(address => uint256) public individualCryptoPercentage;
    /// @notice mapping to store each funder's votes on each submission
    // mapping(address => mapping(bytes32 => uint256)) public funderVotes;

    using SafeMath for *;
    using VoteLibrary for *;
    using ErrorLibrary for *;

    IERC20Permit private immutable _usdc;
    IERC20Permit private immutable _usdcBridged;
    /// @notice initializing the interface for weth
    IWETH private immutable _weth; 

    /// @notice initializing swaprouter interface
    ISwapRouter public immutable swapRouter;
    /// @notice initializing brdiged usdc and usdc pool 
    IUniswapV3Pool public immutable bridgedUsdcPool;
    /// @notice initalizing eth and usdc pool
    IUniswapV3Pool public immutable ethUsdcPool;
    /// @notice initializing chainlink or oracle price aggregator
    AggregatorV3Interface public immutable ethPriceAggregator;

    /// @notice instance of SubmissionAVLTree and LogicContract contract
    SubmissionAVLTree private _submissionTree;
    LogicContract private _logicFunctions;

    bytes32 public constant REFUND_SUBMISSION_HASH = keccak256(abi.encodePacked("REFUND"));

    /// @notice minimum slippage fee percentage for minimum output in swap
    uint8 public minimumSlipageFeePercentage = 2;

    constructor(address _proposer, address[] memory _platformAdmins, uint8 _platFormFee, uint8 _proposerFee, address _usdcAddress, address _usdcBridgedAddress , address _swapRouter ,address _usdcToUsdcePool,address _usdcToEthPool,address _ethPriceAggregator,address _wethToken) {
        proposer = _proposer;
        isProposer[proposer] = true;
        for (uint i = 0; i < _platformAdmins.length; i++) {
            platformAdmins.push(_platformAdmins[i]);
            isPlatformAdmin[_platformAdmins[i]] = true;
        }
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
    function startSubmissionPeriod(uint256 _submissionTime) public onlyPlatformAdminOrProposer onlyActive {
        /// @notice submission time will be in minutes
        submissionTime = block.timestamp + _submissionTime * 1 minutes;
        submissionPeriod = true;
        emit ErrorLibrary.SubmissionStarted(block.timestamp, submissionTime);
    }

    /// @notice start the voting period 
    function startVotingPeriod(uint256 _votingTime) public onlyPlatformAdminOrProposer onlyActive {
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
            _logicFunctions.refundLogic();
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
        for(uint64 j=0; j<refundRequestedFunders.length; j++) {
            uint256 reward_amount = _submissionTree.submissionFunderBalances(REFUND_SUBMISSION_HASH,refundRequestedFunders[j]);
            reward -= reward_amount;
            if(reward_amount > 0) {
                if(_logicFunctions.isFiatFunder(refundRequestedFunders[j]) && _logicFunctions.isCryptoFunder(refundRequestedFunders[j])) {
                    uint256 fiatToSend = (reward_amount.mul(_logicFunctions.individualFiatPercentage(refundRequestedFunders[j]))).div(100);
                    uint256 cryptoToSend = (reward_amount.mul(_logicFunctions.individualCryptoPercentage(refundRequestedFunders[j]))).div(100);
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
            for (uint64 i = 0; i < allSubmissions.length;) {
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
            _logicFunctions.updateTotalRewards(0);
            if(_logicFunctions.totalFunds() > 0) {
                usdcPlatformReward = (_logicFunctions.totalFunds() * platformFee) / 100;
                usdcProposerReward = (_logicFunctions.totalFunds() * proposerFee) / 100;
                _logicFunctions.updateTotalFunds(_logicFunctions.totalFunds().sub(usdcPlatformReward.add(usdcProposerReward)));
                // totalFunds = totalFunds.sub(usdcPlatformReward.add(usdcProposerReward));
                _usdc.transfer(platformAddress, usdcPlatformReward);
                _usdc.transfer(proposer, usdcProposerReward);
            }
            distributed = true;
        }
        if(totalVotes == 0) {
            _logicFunctions.refundLogic();
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
        _submissionTree.updateFunderVotes(_submissionHash, sender, (_logicFunctions.retrieveFunderVotes(sender, _submissionHash).mul(100.sub(platformFee.add(proposerFee)))).div(100));
        
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
        if (_amount > _logicFunctions.totalFunderAmount(sender)) revert ErrorLibrary.NotEnoughFunds();

        SubmissionAVLTree.SubmissionInfo memory submissionCheck = _submissionTree.getSubmission(_submissionHash);
        /// @notice submission should return a struct with the submissionHash, the contestant, the submissionText, the threshhold, the votes, and the funded status 
        //  -- check if the submission hash is in the tree
        if (submissionCheck.submissionHash != _submissionHash) revert ErrorLibrary.SubmissionDoesntExist();
        if(_submissionHash == REFUND_SUBMISSION_HASH && !isRefundRequestedAddress[sender]) {
            refundRequestedFunders.push(sender);
            isRefundRequestedAddress[sender] = true;
        }
        _voteLogic(_amount, _submissionHash, sender);
    }

    function _changeSubmissionVoteLogic(bytes32 _previousSubmissionHash, bytes32 _newSubmissionHash) private {
        SubmissionAVLTree.SubmissionInfo memory previousSubmission = _submissionTree.getSubmission(_previousSubmissionHash);
        SubmissionAVLTree.SubmissionInfo memory newSubmission = _submissionTree.getSubmission(_newSubmissionHash);

        if (previousSubmission.usdcVotes <= 0) {
            _submissionTree.setFundedTrue(_previousSubmissionHash, false);
        }
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
        if (_logicFunctions.retrieveFunderVotes(sender,_previous_submissionHash) < amount) revert ErrorLibrary.NotYourVote();
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
        _logicFunctions.updateFunderVotes(_sender, _previous_submission_hash, _logicFunctions.retrieveFunderVotes(_sender, _previous_submission_hash).sub(amount));
        // funderVotes[_sender][_previous_submission_hash] -= amount;
        _logicFunctions.updateFunderVotes(_sender, _new_submission_hash, _logicFunctions.retrieveFunderVotes(_sender, _new_submission_hash).add(amount));
        // funderVotes[_sender][_new_submission_hash] += amount;
        _submissionTree.updateFunderVotes(_previous_submission_hash, _sender, (_logicFunctions.retrieveFunderVotes(_sender, _previous_submission_hash).mul(100.sub(platformFee.add(proposerFee)))).div(100));
        _submissionTree.updateFunderVotes(_new_submission_hash, _sender, (_logicFunctions.retrieveFunderVotes(_sender, _new_submission_hash).mul(100.sub(platformFee.add(proposerFee)))).div(100));
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

    function _tokenFundLogic(bool _fiatPayment, address sender, uint256 _amount) private {
        if(_fiatPayment) {
            _logicFunctions.tokenFundLogic(sender, _amount);
        } else {
            _logicFunctions.depositLogic(sender, _amount);
        }
    }
    
    function addUsdcFunds(address spender, uint256 _amountUsdc, uint256 _deadline, uint8 v, bytes32 s, bytes32 r, bytes32 _ethSignedMessageHash, bool _fiatPayment) public onlyActive nonReentrant payable {
        if(_amountUsdc <= 0) revert ErrorLibrary.NotEnoughFunds();
        address sender = ecrecover(_ethSignedMessageHash, v, r, s);
        _usdc.permit(sender, spender, _amountUsdc, _deadline,v,r,s);
        _tokenFundLogic(_fiatPayment, sender, _amountUsdc);
        _usdc.transferFrom(sender, address(this), _amountUsdc);
        emit ErrorLibrary.Donation(sender, address(_usdc), ErrorLibrary.DonationType.PAYMENT, ErrorLibrary.TokenType.TOKEN, _fiatPayment, _amountUsdc);
    }

    function addTokenFunds(address _voter, uint256 _amount, uint256 _deadline, uint8 v, bytes32 s, bytes32 r, bytes32 _ethSignedMessageHash, bool _fiatPayment) public {
        address sender = ecrecover(_ethSignedMessageHash, v, r, s);
        _usdc.permit(sender, address(this), _amount, _deadline,v,r,s);
        _tokenFundLogic(_fiatPayment, _voter, _amount);
        _usdc.transferFrom(sender, address(this), _amount);
        emit ErrorLibrary.Donation(_voter, address(_usdc), ErrorLibrary.DonationType.PAYMENT, ErrorLibrary.TokenType.TOKEN, _fiatPayment, _amount);
    }

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
        _swapRouterLogic(sender, eth_donation, address(_weth), ethUsdcPool.fee(), _amountOutMinimum );
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
       uint256 total_unused_usdc_votes = _logicFunctions.totalRewards().sub(total_usdc_votes);
       for(uint64 i=0; i<allSubmissions.length; i++) {
            if(total_unused_usdc_votes > 0 && allSubmissions[i].usdcVotes > 0) {
                uint256 individual_usdc_percentage = ((allSubmissions[i].usdcVotes.mul(10000)).div(total_usdc_votes));
                uint256 transferable_usdc_amount = (total_unused_usdc_votes.mul(individual_usdc_percentage)).div(10000);
                if(allSubmissions[i].submissionHash == REFUND_SUBMISSION_HASH) {
                    _logicFunctions.unusedRefundSubmissionLogic(transferable_usdc_amount, total_unused_usdc_votes);
                } 
                else if(transferable_usdc_amount > 0) {
                    _usdc.transfer(allSubmissions[i].contestant, transferable_usdc_amount);
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
        _logicFunctions.updateTotalFunds(_logicFunctions.totalFunds().sub(_amount));
        // totalFunds = totalFunds.sub(_amount);
        _logicFunctions.updateTotalRewards(_logicFunctions.totalRewards().sub((_amount.mul(100 - (platformFee + proposerFee))).div(100)));
        // totalRewards = totalRewards.sub((_amount.mul(100 - (platformFee + proposerFee))).div(100));
        token.transfer(_to, _amount); 
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

    /// @notice function to get total Funds and total Rewards
    function getTotalAndRewards() public view returns(uint256, uint256) {
        return(_logicFunctions.totalFunds(), _logicFunctions.totalRewards());
    }

   /// @notice function to retrieve all the cryptoFunders
   function getAllCryptoFunders() public view returns(address[] memory) {
        return _logicFunctions.getAllCryptoFunders();
   }

   /// @notice function to retrieve all the fiat funders
   function getAllFiatFunders() public view returns(address[] memory) {
    return _logicFunctions.getAllFiatFunders();
   }

   /// @notice function to retrieve funder votes to a specific submission
   function getFunderVotes(address funder, bytes32 submissionHash) public view returns(uint256) {
        return _logicFunctions.retrieveFunderVotes(funder, submissionHash);
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