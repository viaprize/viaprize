//SPDX-License-Identifier:MIT
pragma solidity ^0.8.1;

import "./SubmissionLibrary.sol";
import "./SubmissionAVLTree.sol";
import "../../helperContracts/safemath.sol";
import "../../helperContracts/ierc20_permit.sol";                                         
import "../../helperContracts/ierc20_weth.sol";

contract PrizeV2 {
    uint256 public constant PRECISION = 10000;

    bytes32 public constant REFUND_SUBMISSION_HASH = keccak256(abi.encodePacked("REFUND"));

    /// @notice this will be the total amount of funds raised
    uint256 public totalFunds; 
    /// @notice this will be the total amount of rewards available
    uint256 public totalRewards; 
    /// @notice bool to check if rewards have been distributed with end_voting_period
    bool public distributed;
    bool public refunded;
    /// @notice this will be the time that the voting period ends
    uint256 votingTime; 
    /// @notice this will be the time that the submission period ends
    uint256 submissionTime;
    /// @notice  this will be a mapping of the addresses of the proposers to a boolean value of true or false
    mapping (address => bool) public isProposer;
    /// @notice  person who proposed the prize;
    address public proposer;
    /// @notice this will be a mapping of the addresses of the funders to the amount of usd they have contributed
    mapping (address => uint256) public cryptoFunderAmount;
    mapping(address => uint256) public fiatFunderAmount;
    /// @notice array of funders
    address[] public cryptoFunders;
    address[] public fiatFunders;
    mapping(address => bool) public isCryptoFunder;
    mapping(address => bool) public isFiatFunder;
    /// @notice Add a new mapping to store each funder's votes on each submission
    mapping(address => mapping(bytes32 => uint256)) public funderVotes;
    address[] public refundRequestedFunders;
    mapping(address => bool) public isRefundRequestedAddress;
    mapping(address => bool) public isContestant;
    mapping(address => uint256) public individualFiatPercentage;
    mapping(address => uint256) public individualCryptoPercentage;
    mapping(address => uint256) public totalFunderAmount;

    bool public isActive = false;
    uint8 public constant  VERSION = 201;
    bool private _locked;

    using SafeMath for uint256;

    uint public proposerFee;
    uint public platformFee;

    bool public votingPeriod = false;
    bool public submissionPeriod = false;
        
    address[] public platformAdmins;
    mapping(address => bool) public isPlatformAdmin;

    IERC20Permit private immutable _usdc;


    /// @notice this will be the address of the platform
    address public immutable platformAddress = 0x1f00DD750aD3A6463F174eD7d63ebE1a7a930d0c;

    /// @notice this will be the address where the refund  of fiat will be sent
    address public immutable refundAddress = 0xF7D1D901d15BBf60a8e896fbA7BBD4AB4C1021b3;

    /// @notice / @notice _submissionTree contract
    SubmissionAVLTree private _submissionTree;

    uint256 public totalVotes;
    uint256 public disputePeriod;
    uint256 public nonce;

    /// @notice error for not enough funds to vote
    error NotEnoughFunds();

    /// @notice error for trying to change someone elses vote
    error NotYourVote();

    /// @notice if distribution has already happened
    error RewardsAlreadyDistributed();

    /// @notice error for trying to vote on a submission that has not been made
    error SubmissionDoesntExist();

    /// @notice error for when the submission period is not active
    error SubmissionPeriodActive();

    /// @notice error for when the submission period is not active
    error SubmissionPeriodNotActive();

    /// @notice error for when the voting period is not active
    error VotingPeriodNotActive();

    /// @notice error for trying to claim a refund when the voting period is still active
    error VotingPeriodActive();

    enum DonationType {
        GIFT,
        PAYMENT
    }
    enum TokenType {
        NFT,
        TOKEN
    }

    event SubmissionCreated(address indexed contestant, bytes32 indexed submissionHash);
    event CampaignCreated(address indexed proposer, address indexed contractAddress);
    event Voted(bytes32 indexed votedTo, address indexed votedBy, uint256 amountVoted);
    event Donation(address indexed donator ,address indexed token_or_nft, DonationType  indexed _donationType, TokenType _tokenType, bool _isFiat, uint256 amount);
    event DisputeRaised(bytes32 indexed _submissionHash, address indexed _contestant);
    event FiatFunderRefund(address indexed _address, uint256 _amount);

    constructor(address _proposer, address[] memory _platformAdmins, uint _platFormFee, uint _proposerFee, address _usdcAddress) {
        /// @notice add as many proposer addresses as you need to -- replace msg.sender with the address of the proposer(s) for now this means the deployer will be the sole admin

        proposer = _proposer;
        isProposer[proposer] = true;
        for (uint i = 0; i < _platformAdmins.length; i++) {
            platformAdmins.push(_platformAdmins[i]);
            isPlatformAdmin[_platformAdmins[i]] = true;
        }
        /// @notice  Initialize the _submissionTree
        _submissionTree = SubmissionAVLTree(SubmissionLibrary.deploySubmission(address(this)));
        proposerFee = _proposerFee;
        platformFee = _platFormFee;
        _usdc = IERC20Permit(_usdcAddress);
        isActive = true;
        _submissionTree.addSubmission(platformAdmins[0], REFUND_SUBMISSION_HASH, "REFUND");
        
        emit CampaignCreated(proposer, address(this));
    }

    modifier noReentrant() {
        require(!_locked, "NR");
        _locked = true;
        _;
        _locked = false;
    }

    modifier onlyActive() {
        require(isActive, "FCE");
        _;
    }

    modifier onlyPlatformAdmin() {
     require(isPlatformAdmin[msg.sender],"NP");
    _;
    }

    modifier onlyPlatformAdminOrProposer() {
        require(isPlatformAdmin[msg.sender] || isProposer[msg.sender], "NPP");
        _;
    }

     function VOTE_HASH(uint256 _nonce,bytes32 _submission, uint256 _amount) public view returns (bytes32) {
        bytes32 _messageHash = keccak256(
            abi.encodePacked("VOTE FOR " ,_submission , " WITH AMOUNT ", _amount, " AND NONCE ", _nonce," WITH PRIZE CONTRACT ", address(this))
        );
        return  keccak256(
            abi.encodePacked("\x19Ethereum Signed Message:\n32", _messageHash)
        );
    }

    function CHANGE_VOTE_HASH(uint256 _nonce,bytes32 _old_submission, uint256 _amount,bytes32 _new_submission) public view returns (bytes32){
        bytes32 _messageHash = keccak256(
            abi.encodePacked("CHANGE VOTE FROM ",_old_submission, " TO ", _new_submission, " WITH AMOUNT ", _amount, " AND NONCE ", _nonce," WITH PRIZE CONTRACT ", address(this))
        );
        return  keccak256(
            abi.encodePacked("\x19Ethereum Signed Message:\n32", _messageHash)
        );
    }

    function DISPUTE_HASH(uint256 _nonce,bytes32 _submission) public view returns (bytes32) {
        bytes32 _messageHash = keccak256(
            abi.encodePacked("DISPUTE FOR ",_submission," AND NONCE ", _nonce," WITH PRIZE CONTRACT ", address(this))
        );
        return  keccak256(
            abi.encodePacked("\x19Ethereum Signed Message:\n32", _messageHash)
        );
    }

    /// @notice create a function to start the submission period
    function startSubmissionPeriod(uint256 _submissionTime) public  onlyPlatformAdminOrProposer {
        /// @notice submission time will be in minutes
        submissionTime = block.timestamp + _submissionTime * 1 minutes;
        submissionPeriod = true;
    }

    /// @notice start the voting period 
    function startVotingPeriod(uint256 _votingTime) public  onlyPlatformAdminOrProposer onlyActive {
        if(block.timestamp < submissionTime) revert SubmissionPeriodActive();
        /// @notice voting time also in minutes
        votingTime = block.timestamp + _votingTime * 1  minutes;
        /// @notice  tracks voting period
        votingPeriod = true;
    }

    /// @notice getter for submission time
    function getSubmissionTime() public view returns (uint256) {
        return submissionTime;
    }

    /// @notice getter for voting time
    function getVotingTime() public view returns (uint256) {
        return votingTime;
    }

    function endSubmissionPeriod() public onlyPlatformAdmin {
        if(submissionTime == 0) revert SubmissionPeriodNotActive();
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
                _usdc.transfer(refundAddress, transferable_amount);
                emit FiatFunderRefund(fiatFunders[i], transferable_amount);
            }
            refunded = true;
            distributed = true;
            isActive = false;
        }
    }

    function endVotingPeriod() public onlyPlatformAdmin onlyActive {
        if(votingTime == 0) revert VotingPeriodNotActive();
        votingTime = 0;
        votingPeriod = false;
        disputePeriod = block.timestamp + 2 days;
    }

    function raiseDispute(bytes32 _submissionHash, uint8 v, bytes32 s, bytes32 r) public onlyActive {
        require(disputePeriod > block.timestamp, "DPNA"); //DPNA - Dispute Period Not Active
        bytes32 signedMessageHash = DISPUTE_HASH(nonce+=1, _submissionHash);
        SubmissionAVLTree.SubmissionInfo memory submission = _submissionTree.getSubmission(_submissionHash);

        address sender =  ecrecover(signedMessageHash, v, r, s);
        require(sender == submission.contestant, "NAS"); //NAS - Not a Submitter
        emit DisputeRaised(_submissionHash, sender);
    }

    function endDispute() public onlyPlatformAdmin {
        require(disputePeriod < block.timestamp, "DPA"); // DPA -> Dispute Period is in Active
        _distributeUnusedVotes();
        _distributeRewards();
        isActive = false;
    }

    function changeSubmissionPeriod(uint256 _submissionTime) public onlyPlatformAdmin {
        if(votingPeriod) revert VotingPeriodActive();
        if(!submissionPeriod) revert SubmissionPeriodNotActive();
        submissionTime = block.timestamp + _submissionTime * 1 minutes;
    }

    function changeVotingPeriod(uint256 _votingTime) public onlyPlatformAdmin {
        if(!votingPeriod) revert VotingPeriodNotActive();
        if(distributed == true) revert RewardsAlreadyDistributed();
        votingTime = block.timestamp + _votingTime * 1 minutes;
    }

    /// @notice Distribute rewards
    function _distributeRewards() private {
        if(distributed == true) revert RewardsAlreadyDistributed();
        SubmissionAVLTree.SubmissionInfo[] memory allSubmissions = getAllSubmissions();
        uint256 usdcPlatformReward;
        uint256 usdcProposerReward;
        if(allSubmissions.length > 0 && totalVotes > 0 ) {
            /// @notice  Count the number of funded submissions and add them to the fundedSubmissions array
            for (uint256 i = 0; i < allSubmissions.length;) {
                if(allSubmissions[i].funded && allSubmissions[i].usdcVotes > 0) {
                    if(allSubmissions[i].submissionHash == REFUND_SUBMISSION_HASH) {
                        uint256 reward = allSubmissions[i].usdcVotes;
                        if(reward > 0) {
                            for(uint256 j=0; j<refundRequestedFunders.length; j++) {
                                uint256 reward_amount = _submissionTree.submissionFunderBalances(REFUND_SUBMISSION_HASH,refundRequestedFunders[j]);
                                reward -= reward_amount;
                                if(reward_amount > 0) {
                                    if(isFiatFunder[refundRequestedFunders[j]] && isCryptoFunder[refundRequestedFunders[j]]) {
                                        uint256 fiatToSend = (reward_amount.mul(individualFiatPercentage[refundRequestedFunders[j]])).div(100);
                                        uint256 cryptoToSend = (reward_amount.mul(individualCryptoPercentage[refundRequestedFunders[j]])).div(100);
                                        reward_amount = 0;
                                        _usdc.transfer(refundAddress, fiatToSend);
                                        emit FiatFunderRefund(refundRequestedFunders[j], fiatToSend);
                                        _usdc.transfer(refundRequestedFunders[j], cryptoToSend);
                                    } else if(isFiatFunder[refundRequestedFunders[j]]) {
                                        _usdc.transfer(refundAddress, reward_amount);
                                        emit FiatFunderRefund(refundRequestedFunders[j], reward_amount);
                                        reward_amount = 0;
                                    } else if(isCryptoFunder[refundRequestedFunders[j]]) {
                                        _usdc.transfer(refundRequestedFunders[j], reward_amount);
                                        reward_amount = 0;
                                    }
                                }
                            }
                        }
                    } else {
                        uint256 reward = (allSubmissions[i].usdcVotes);
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
                uint256 transferable_amount = fiatFunderAmount[fiatFunders[i]];
                fiatFunderAmount[fiatFunders[i]] = 0;
                _usdc.transfer(refundAddress, transferable_amount);
                emit FiatFunderRefund(fiatFunders[i], transferable_amount);
            }
            distributed = true;
        }
    }

    /// @notice addSubmission should return the submissionHash
    function addSubmission(address contestant, string memory submissionText) public onlyPlatformAdmin returns(bytes32) {
        if (block.timestamp > submissionTime) revert SubmissionPeriodNotActive();
        if(isContestant[contestant]) revert("CAE"); // CAE -> Contestant already Exists
        bytes32 submissionHash = keccak256(abi.encodePacked(contestant, submissionText));
        isContestant[contestant] = true;
        _submissionTree.addSubmission(contestant, submissionHash, submissionText);
        emit SubmissionCreated(contestant, submissionHash);
        return submissionHash;
    }

    function _voteLogic(uint256 _amount, bytes32 _submissionHash, address sender) onlyActive private {
        uint256 amountToSubmission = (_amount * (100 - platformFee - proposerFee)) / 100;
        _submissionTree.addUsdcVotes(_submissionHash, amountToSubmission);
        _submissionTree.updateFunderVotes(_submissionHash, sender, (funderVotes[sender][_submissionHash] * (100-platformFee-proposerFee))/100);
        
        totalVotes = totalVotes.add(amountToSubmission);
        SubmissionAVLTree.SubmissionInfo memory submission = _submissionTree.getSubmission(_submissionHash);
        if (submission.usdcVotes > 0) {
            _submissionTree.setFundedTrue(_submissionHash, true);
        }
        emit Voted(_submissionHash, sender, _amount);
    }

    /// @notice create a function to allow funders to vote for a submission
    /// @notice  Update the vote function
    function vote(bytes32 _submissionHash, uint256 _amount, uint8 v, bytes32 s, bytes32 r) onlyActive public {
        if (block.timestamp > votingTime) revert VotingPeriodNotActive();
        bytes32 hash = VOTE_HASH(nonce+=1, _submissionHash, _amount);
        address sender =  ecrecover(hash, v, r, s);
        if(!(isFiatFunder[sender] || isCryptoFunder[sender])) revert("NAF"); // NAF -> Not a Funder
        if (_amount > totalFunderAmount[sender]) revert NotEnoughFunds();

        SubmissionAVLTree.SubmissionInfo memory submissionCheck = _submissionTree.getSubmission(_submissionHash);
        /// @notice submission should return a struct with the submissionHash, the contestant, the submissionText, the threshhold, the votes, and the funded status 
        //  -- check if the submission hash is in the tree
        if (submissionCheck.submissionHash != _submissionHash) revert SubmissionDoesntExist();
        if(_submissionHash == REFUND_SUBMISSION_HASH) {
            if(!isRefundRequestedAddress[sender]) {
                refundRequestedFunders.push(sender);
                isRefundRequestedAddress[sender] = true;
            }
        }
        if(cryptoFunderAmount[sender] > 0 && fiatFunderAmount[sender] > 0){
            uint256 cryptoAmountToVote = (_amount.mul(individualCryptoPercentage[sender])).div(100);
            uint256 fiatAmountToVote = (_amount.mul(individualFiatPercentage[sender])).div(100);
            if(!(_amount == cryptoAmountToVote + fiatAmountToVote)) revert("VM,PPEIL"); // VM,PPEIL -> votes mismatch, probably precise error in logic
            cryptoFunderAmount[sender] = cryptoFunderAmount[sender].sub(cryptoAmountToVote);
            fiatFunderAmount[sender] = fiatFunderAmount[sender].sub(fiatAmountToVote);
            totalFunderAmount[sender] = totalFunderAmount[sender].sub(cryptoAmountToVote + fiatAmountToVote);
            funderVotes[sender][_submissionHash] = funderVotes[sender][_submissionHash].add(_amount);
            cryptoAmountToVote = 0;
            fiatAmountToVote = 0;
        } else if(cryptoFunderAmount[sender] > 0) {
            uint256 cryptoAmountToVote = (_amount.mul(individualCryptoPercentage[sender])).div(100);
            if(!(_amount == cryptoAmountToVote)) revert("VM,PPEIL"); // VM,PPEIL -> votes mismatch, probably precise error in logic
            cryptoFunderAmount[sender] = cryptoFunderAmount[sender].sub(cryptoAmountToVote);
            totalFunderAmount[sender] = totalFunderAmount[sender].sub(cryptoAmountToVote);
            funderVotes[sender][_submissionHash] = funderVotes[sender][_submissionHash].add(_amount);
            cryptoAmountToVote = 0;
        } else if(fiatFunderAmount[sender] > 0) {
            uint256 fiatAmountToVote = (_amount.mul(individualFiatPercentage[sender])).div(100);
            if(!(_amount == fiatAmountToVote)) revert("VM,PPEIL"); // VM,PPEIL -> votes mismatch, probably precise error in logic
            fiatFunderAmount[sender] = fiatFunderAmount[sender].sub(fiatAmountToVote);
            totalFunderAmount[sender] = totalFunderAmount[sender].sub(fiatAmountToVote);
            funderVotes[sender][_submissionHash] = funderVotes[sender][_submissionHash].add(_amount);
            fiatAmountToVote = 0;
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
    function changeVote(bytes32 _previous_submissionHash, bytes32 _new_submissionHash, uint8 v, bytes32 s, bytes32 r, uint256 amount) onlyActive public {
        if (block.timestamp > votingTime) revert VotingPeriodNotActive();
        if(_previous_submissionHash == _new_submissionHash) revert("SME"); //SME -> Same Submission
        bytes32 signedMessageHash = CHANGE_VOTE_HASH(nonce+=1, _previous_submissionHash, amount, _new_submissionHash);
        address sender = ecrecover(signedMessageHash, v, r, s);
        if (funderVotes[sender][_previous_submissionHash] < amount) revert NotYourVote();
        if(!isCryptoFunder[sender] || !isFiatFunder[sender]) revert("NF"); // NF -> Not a Funder
        _changeVote(sender, _previous_submissionHash, _new_submissionHash, amount);
        _changeSubmissionVoteLogic(_previous_submissionHash, _new_submissionHash);
        emit Voted(_new_submissionHash, sender, amount);
    }

    function _changeVote(address _sender,bytes32 _previous_submission_hash,bytes32 _new_submission_hash,uint256 amount) private {
        uint256 amountToSubmission = (amount * (100 - platformFee - proposerFee)) / 100;
        if(_new_submission_hash == REFUND_SUBMISSION_HASH){
            if(!isRefundRequestedAddress[_sender]){
                refundRequestedFunders.push(_sender);
                isRefundRequestedAddress[_sender] = true;
            }
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
    function disputeChangeVote( bytes32  _previousSubmissionHash, bytes32 _newSubmissionHash, address[] calldata _funders, uint256[] calldata _amounts) onlyActive onlyPlatformAdmin public {
        require(_funders.length == _amounts.length, "LM"); //LM -> Length Mismatch
        require(disputePeriod > block.timestamp, "DPNA");  //DPNA -> Dispute Period Not Active
        for (uint256 i = 0; i < _funders.length; i++) {
            address funder = _funders[i];
            uint256 amount = _amounts[i];
            _changeVote(funder, _previousSubmissionHash, _newSubmissionHash, amount);
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

    function _depositLogic(address sender, uint256 donation) private {
        if(!isCryptoFunder[sender]) {
            isCryptoFunder[sender] = true;
            cryptoFunders.push(sender);
        }
        cryptoFunderAmount[sender] = cryptoFunderAmount[sender].add(donation);
        totalFunderAmount[sender] = totalFunderAmount[sender].add(donation);
        individualCryptoPercentage[sender] = (cryptoFunderAmount[sender].mul(100)).div(totalFunderAmount[sender]);
        individualFiatPercentage[sender] = (fiatFunderAmount[sender].mul(100)).div(totalFunderAmount[sender]);
        totalFunds = totalFunds.add(donation);
        totalRewards = totalRewards.add((donation.mul(100 - (platformFee + proposerFee))).div(100));
    }

    function addUsdcFunds(address spender, uint256 _amountUsdc, uint256 _deadline, uint8 v, bytes32 s, bytes32 r, bytes32 _ethSignedMessageHash, bool _fiatPayment) public onlyActive noReentrant payable {
        require(_amountUsdc > 0, "F<0"); // F<0 -> funds should be greater than zero.
        address sender = ecrecover(_ethSignedMessageHash, v, r, s);
        _usdc.permit(sender, spender, _amountUsdc, _deadline,v,r,s);
        if(_fiatPayment) {
            if(!isFiatFunder[sender]) {
                fiatFunders.push(sender);
                isFiatFunder[sender] = true;
            }
            fiatFunderAmount[sender] = fiatFunderAmount[sender].add(_amountUsdc);
            totalFunderAmount[sender] = totalFunderAmount[sender].add(_amountUsdc);
            totalRewards = totalRewards.add((_amountUsdc.mul(100 - (platformFee + proposerFee))).div(100));
            individualFiatPercentage[sender] = (fiatFunderAmount[sender].mul(100)).div(totalFunderAmount[sender]);
            individualCryptoPercentage[sender] = (cryptoFunderAmount[sender].mul(100)).div(totalFunderAmount[sender]);
            totalFunds = totalFunds.add(_amountUsdc);
        }
        else {
            _depositLogic(sender, _amountUsdc);
        }
        _usdc.transferFrom(sender, address(this), _amountUsdc);
        emit Donation(sender, address(_usdc), DonationType.PAYMENT, TokenType.TOKEN, _fiatPayment, _amountUsdc);
    }




    function _unusedRefundSubmissionLogic(uint256 transferable_usdc_amount, uint256 total_unused_usdc_votes) private {
        uint256 _PRECISION = PRECISION;
        if(transferable_usdc_amount > 0) {
            for(uint256 j=0; j<cryptoFunders.length; j++) {
                if(cryptoFunderAmount[cryptoFunders[j]] > 0){
                    uint256 individual_unused_votes = cryptoFunderAmount[cryptoFunders[j]].mul(100 - platformFee - proposerFee).div(100);
                    uint256 individual_refund_usdc_percentage =   (individual_unused_votes.mul(_PRECISION).div(total_unused_usdc_votes));
                    uint256 individual_transferable_usdc_amount = (transferable_usdc_amount.mul(individual_refund_usdc_percentage).div(_PRECISION));
                    if(individual_transferable_usdc_amount > 0) {
                        _usdc.transfer(cryptoFunders[j], individual_transferable_usdc_amount);
                    }
                }
            
            }
            for(uint256 j=0; j<fiatFunders.length; j++) {
                if(fiatFunderAmount[fiatFunders[j]] > 0) {
                    uint256 individual_unused_votes = fiatFunderAmount[fiatFunders[j]].mul(100 - platformFee - proposerFee).div(100);
                    uint256 individual_refund_usdc_percentage =   (individual_unused_votes.mul(_PRECISION).div(total_unused_usdc_votes));
                    uint256 individual_transferable_usdc_amount = (transferable_usdc_amount.mul(individual_refund_usdc_percentage).div(_PRECISION));
                    if(individual_transferable_usdc_amount > 0) {
                        _usdc.transfer(refundAddress, individual_transferable_usdc_amount);
                        emit FiatFunderRefund(fiatFunders[j], individual_transferable_usdc_amount);
                    }
                }
            }
        }
    }

   /// @notice this fn sends the unused votes to the contestant based on their previous votes.
    function _distributeUnusedVotes() private returns(uint256,uint256)  {
       uint256 total_usdc_votes = 0;
       uint256 _PRECISION = PRECISION;
       
       SubmissionAVLTree.SubmissionInfo[] memory allSubmissions = getAllSubmissions();
       for(uint256 i=0; i<allSubmissions.length; i++) {
           total_usdc_votes += allSubmissions[i].usdcVotes;
       }
       uint256 total_unused_usdc_votes = totalRewards.sub(total_usdc_votes);
       for(uint256 i=0; i<allSubmissions.length; i++) {
            if(total_unused_usdc_votes > 0 && allSubmissions[i].usdcVotes > 0) {
                uint256 individual_usdc_percentage = ((allSubmissions[i].usdcVotes.mul(_PRECISION)).div(total_usdc_votes));
                uint256 transferable_usdc_amount = (total_unused_usdc_votes.mul(individual_usdc_percentage)).div(_PRECISION);
                if(allSubmissions[i].submissionHash == REFUND_SUBMISSION_HASH) {
                    _unusedRefundSubmissionLogic(transferable_usdc_amount, total_unused_usdc_votes);
                } else {
                    if(transferable_usdc_amount > 0) {
                        _usdc.transfer(allSubmissions[i].contestant, transferable_usdc_amount);
                    }
                }
            } 
       }
       return (total_usdc_votes, totalRewards);
   }

   /// @notice backdoor function to withdraw tokens
   /// @param _tokenAddress contract address of the token
   /// @param _to receiver address
   /// @param _amount amount to withdraw
   function withdrawTokens(address _tokenAddress, address _to, uint256 _amount) public onlyPlatformAdmin noReentrant {
        IERC20Permit token = IERC20Permit(_tokenAddress);
        uint256 balance = token.balanceOf(address(this));
        if(balance == 0) revert("TNE"); //TNE -> Tokens Not Exists
        require(_amount <= balance, "AEB"); //AEB -> Amount Exceeds Balance
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
   function endDisputePeriodEarly() public onlyPlatformAdmin {
        disputePeriod = block.timestamp - 1 seconds;
        endDispute();
   }
} 