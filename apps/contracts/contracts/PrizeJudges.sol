/// @notice  SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./SubmissionAVLTree.sol";
import "./helperContracts/safemath.sol";
import "./SubmissionLibrary.sol";
import "./helperContracts/nonReentrant.sol";

contract PrizeJudges is ReentrancyGuard {
    /// @notice this will be the total amount of funds raised
    uint256 public total_funds; 
    /// @notice this will be the total amount of rewards available
    uint256 public total_rewards; 
    /// @notice this will be the total amount of rewards available for the platform
    uint256 public platform_reward;
    /// @notice this will be the total amount of rewards available for the proposer
    uint256 public proposer_reward;
    /// @notice bool to check if rewards have been distributed with end_voting_period
    bool public distributed;
    /// @notice bool to check if rewards have been refunded or not
    bool public refunded;
    /// @notice this will be the time that the voting period ends
    uint256 public voting_time; 
    /// @notice this will be the time that the submission period ends
    uint256 public submission_time;
    bool track_submission_time;
    /// @notice  this will be a mapping of the addresses of the proposers to a boolean value of true or false
    mapping (address => bool) public isProposer;
    /// @notice array of proposers;
    address[] public proposers;
    /// @notice this will be a mapping of the addresses of the patrons to the amount of eth they have contributed
    mapping (address => uint256) public patronAmount;
    /// @notice this will be a mapping of the addresses of the patrons to the amount of eth they have contributed and to keep track of original amount they donated
    mapping (address => uint256) public patronAmountForRefund;
    address[] public allPatrons;
    mapping(address => bool) public isPatron;
    /// @notice to keep track the campaign is Alive or not
    bool public isActive = false;

    address[] public judges;

    mapping(address => bool) public isJudge;
    mapping (address => uint256) public judgeFunds;
    mapping(address => mapping(bytes32 => uint256)) public judgeVotes;
    uint public total_judge_votes;

    using SafeMath for uint256;
    uint proposerFee;
    uint platformFee;
        
    address[] public platformAdmins;
    mapping(address => bool) public isPlatformAdmin;

    uint256 public totalVotes;

    ///@notice proposerAddress is the address of the proposer who created a prize
    address public proposerAddress;


    /// @notice this will be the address of the platform
    address public platformAddress;

    /// @notice / @notice submissionTree contract
    SubmissionAVLTree private submissionTree;
 
    // Errors
    /// @notice not admin error
    error NotAdmin();

    /// @notice error for not enough funds to vote
    error NotEnoughFunds();

    /// @notice error for trying to change someone elses vote
    error NotYourVote();

    /// @notice error for trying to claim a refund again
    error RefundAlreadyClaimed();

    /// @notice error for trying to claim a nonexistent refund
    error RefundDoesntExist();

    /// @notice if distribution has already happened
    error RewardsAlreadyDistributed();

    /// @notice error for trying to claim a refund when the voting period is still active
    error RewardsNotDistributed();

    /// @notice error for a submission that has already been made
    error SubmissionAlreadyMade();

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

    error NotJudgeToVote();

    event SubmissionCreated(address indexed submitter, bytes32 indexed submissionHash);


    constructor(address[] memory _proposers, address[] memory _platformAdmins, address[] memory _judges, uint _platFormFee, uint _proposerFee, address _platformAddress,uint _submission_time) {
        /// @notice add as many proposer addresses as you need to -- replace msg.sender with the address of the proposer(s) for now this means the deployer will be the sole admin
        
        for(uint i=0; i<_proposers.length; i++) {
            proposers.push(_proposers[i]);
            isProposer[_proposers[i]] = true;
        }
        proposerAddress = proposers[0];
        platformAddress = _platformAddress;
        for (uint i = 0; i < _platformAdmins.length; i++) {
            platformAdmins.push(_platformAdmins[i]);
            isPlatformAdmin[_platformAdmins[i]] = true;
        }

        for(uint i=0; i<_judges.length; i++) {
            judges.push(_judges[i]);
            isJudge[_judges[i]] = true;
        }
        
        /// @notice  Initialize the submissionTree
        submissionTree = SubmissionAVLTree(SubmissionLibrary.deploySubmission());
        proposerFee = _proposerFee;
        platformFee = _platFormFee;
        isActive = true;
        submission_time = block.timestamp +  _submission_time * 1 days;
        track_submission_time = true;
        distributed = false;
        refunded = false;
    }


    modifier onlyPlatformAdmin() {
        require(isPlatformAdmin[msg.sender]);
    _;
    }

    /// @notice create a function to start the submission period
    function start_submission_period(uint256 _submission_time) public {
        if(isProposer[msg.sender] == false && isPlatformAdmin[msg.sender] == false) revert NotAdmin();
        /// @notice submission time will be in days
        submission_time = block.timestamp + _submission_time * 1 days;
        track_submission_time = true;      
    }

    function end_submission_period() public onlyPlatformAdmin {
        if(submission_time == 0) revert SubmissionPeriodNotActive();
        submission_time = 0;
    }

    /// @notice start the voting period 
    function start_voting_period(uint256 _voting_time) public {
        if(isProposer[msg.sender] == false && isPlatformAdmin[msg.sender] == false) revert NotAdmin();
        if(track_submission_time == false) revert("before starting voting period you need to start and end the submission period");
        if(block.timestamp < submission_time) revert SubmissionPeriodActive();
        /// @notice voting time also in days
        voting_time = block.timestamp + _voting_time * 1 days;
    }

    function end_voting_period() public onlyPlatformAdmin {
        if(voting_time == 0) revert VotingPeriodNotActive();
        voting_time = 0;
        distribute_use_unused_votes_v2();
        distributeRewards();
        isActive = false;
    }

    function increase_submission_period(uint256 _submissionTime) public onlyPlatformAdmin {
        if(voting_time > 0) revert VotingPeriodActive();
        if(submission_time == 0) revert SubmissionPeriodNotActive();
        submission_time = submission_time + _submissionTime * 1 days;
        track_submission_time = true;
    }

    function increase_voting_period(uint256 _votingTime) public onlyPlatformAdmin {
        if(voting_time == 0) revert VotingPeriodNotActive();
        if(distributed == true) revert RewardsAlreadyDistributed();
        voting_time = voting_time + _votingTime * 1 days;
    }

        /// @notice function to allow patrons to add funds to the contract
    function addFunds() public payable nonReentrant {
        if(isActive == false) revert("campaign already ended");
        if (msg.value == 0) revert NotEnoughFunds();
        if (total_judge_votes > 0) revert("total judge votes not zero");
        if(isPatron[msg.sender]) {
            patronAmount[msg.sender] += msg.value;
            patronAmountForRefund[msg.sender] += msg.value;
        }
        if(!isPatron[msg.sender]) {
            patronAmount[msg.sender] += msg.value;
            patronAmountForRefund[msg.sender] += msg.value;
            allPatrons.push(msg.sender);
            isPatron[msg.sender] = true;
        }
        total_funds += msg.value;
        total_rewards += (msg.value * (100-platformFee-proposerFee)) / 100; /// @notice  platform fee will depend on the prize
        total_judge_votes = msg.value;
        assignJudgeVotes();
    }

    receive () external payable {
        addFunds();
    }

    /// @notice Distribute rewards
    function distributeRewards() private nonReentrant {
        if(isProposer[msg.sender] == false && isPlatformAdmin[msg.sender] == false) revert NotAdmin();
        if(distributed == true) revert RewardsAlreadyDistributed();
        SubmissionAVLTree.SubmissionInfo[] memory allSubmissions = getAllSubmissions();
        platform_reward = (total_funds * platformFee ) / 100;
        proposer_reward = (total_funds * proposerFee ) / 100;
        /// @notice  Count the number of funded submissions and add them to the fundedSubmissions array
        if(allSubmissions.length > 0 && totalVotes > 0) {
            for (uint256 i = 0; i < allSubmissions.length;) {
                if (allSubmissions[i].funded) {
                    uint256 reward = (allSubmissions[i].votes);
                    payable(allSubmissions[i].submitter).transfer(reward);
                } 
                unchecked { ++i; }
            }
            distributed = true;
            payable(platformAddress).transfer(platform_reward);
            payable(proposerAddress).transfer(proposer_reward);
        }

        if(allSubmissions.length == 0 || totalVotes == 0) {
            for(uint256 i=0; i<allPatrons.length;) {
                uint256 reward = patronAmount[allPatrons[i]];
                patronAmount[allPatrons[i]] = 0;
                payable(allPatrons[i]).transfer(reward);
                unchecked {++i;}
            }
            refunded = true;
        }
    }

    /// @notice addSubmission should return the submissionHash
    function addSubmission(address submitter, string memory submissionText) public returns(bytes32) {
        if (block.timestamp > submission_time) revert SubmissionPeriodNotActive();
        bytes32 submissionHash = keccak256(abi.encodePacked(submitter, submissionText));
        submissionTree.add_submission(submitter, submissionHash, submissionText);
        emit SubmissionCreated(submitter, submissionHash);
        return submissionHash;
    }

    /// @notice create a function to allow patrons to vote for a submission
    /// @notice  Update the vote function
    function vote(bytes32 _submissionHash, uint256 amount) public nonReentrant{
        if (block.timestamp > voting_time) revert VotingPeriodNotActive();
        if(!isJudge[msg.sender]) revert NotJudgeToVote();
        if (amount > judgeFunds[msg.sender]) revert NotEnoughFunds();

        judgeFunds[msg.sender] -= amount;
        SubmissionAVLTree.SubmissionInfo memory submissionCheck = submissionTree.getSubmission(_submissionHash);
        /// @notice submission should return a struct with the submissionHash, the submitter, the submissionText, the threshhold, the votes, and the funded status 
        //  -- check if the submission hash is in the tree
        if (submissionCheck.submissionHash != _submissionHash) revert SubmissionDoesntExist();
        uint256 amountToSubmission = amount * ((100 - platformFee - proposerFee)) / 100;
        submissionTree.addVotes(_submissionHash, amountToSubmission);
        totalVotes+=amountToSubmission;
        judgeVotes[msg.sender][_submissionHash] += amount;
        submissionTree.updateFunderBalance(_submissionHash, msg.sender, (judgeVotes[msg.sender][_submissionHash]*(100-platformFee-proposerFee))/100);
        SubmissionAVLTree.SubmissionInfo memory submission = submissionTree.getSubmission(_submissionHash);
        if (submission.votes > 0) {
            submissionTree.setFundedTrue(_submissionHash, true);
        }
    }

    /// @notice Change_votes should now stop folks from being able to change someone elses vote
    function change_vote(bytes32 _previous_submissionHash, bytes32 _new_submissionHash, uint256 amount) public nonReentrant {
        if (block.timestamp > voting_time) revert VotingPeriodNotActive();
        if (judgeVotes[msg.sender][_previous_submissionHash] < amount) revert NotYourVote();

        uint256 amountToSubmission = (amount * (100 - platformFee - proposerFee)) / 100;
        submissionTree.subVotes(_previous_submissionHash, amountToSubmission);
        submissionTree.addVotes(_new_submissionHash, amountToSubmission);
        submissionTree.updateFunderBalance(_previous_submissionHash, msg.sender, (judgeVotes[msg.sender][_previous_submissionHash]*(100-platformFee-proposerFee))/100);
        submissionTree.updateFunderBalance(_new_submissionHash, msg.sender, (judgeVotes[msg.sender][_new_submissionHash]*(100-platformFee-proposerFee))/100);
        judgeVotes[msg.sender][_previous_submissionHash] -= amount;
        judgeVotes[msg.sender][_new_submissionHash] += amount;

        SubmissionAVLTree.SubmissionInfo memory previousSubmission = submissionTree.getSubmission(_previous_submissionHash);

        if (previousSubmission.votes <= 0) {
            submissionTree.setFundedTrue(_previous_submissionHash, false);
        }

        SubmissionAVLTree.SubmissionInfo memory newSubmission = submissionTree.getSubmission(_new_submissionHash);

        if (newSubmission.votes > 0) {
            submissionTree.setFundedTrue(_new_submissionHash, true);
        }


        }

    /// @notice uses functionality of the AVL tree to get all submissions
    function getAllSubmissions() public view returns (SubmissionAVLTree.SubmissionInfo[] memory) {
        return submissionTree.inOrderTraversal();
    }

    /// @notice get submission by submissionHash
    function get_submission_by_hash(bytes32 submissionHash) public view returns (uint256){
        return submissionTree.getSubmissionVote(submissionHash);

    }

   /// @notice this fn sends the unused votes to the submitter based on their previous votes.
    function distribute_use_unused_votes_v2() public nonReentrant {
       if(isProposer[msg.sender] == false && isPlatformAdmin[msg.sender] == false) revert NotAdmin();

       SubmissionAVLTree.SubmissionInfo[] memory allSubmissions = getAllSubmissions();

       uint256 total_unused_votes = total_rewards.sub(totalVotes);
       if(total_unused_votes < 0) revert("total_unused_votes cant be negative");
       if(total_unused_votes > 0 && totalVotes > 0) {
            for(uint256 i=0; i<allSubmissions.length; i++) {
                uint256 individual_percentage = (allSubmissions[i].votes.mul(100)).div(totalVotes); 
                uint256 transferable_amount = (total_unused_votes.mul(individual_percentage)).div(100);
                payable(allSubmissions[i].submitter).transfer(transferable_amount);
            }
       }
   }

    function assignJudgeVotes() public {
        uint256 judge_funds = total_judge_votes / judges.length;
        total_judge_votes = 0;
        for(uint i=0; i<judges.length; i++) {
            judgeFunds[judges[i]] += judge_funds;
        }
    }

    function earlyRefund() public nonReentrant onlyPlatformAdmin {
        SubmissionAVLTree.SubmissionInfo[] memory allSubmissions = getAllSubmissions();
        totalVotes = 0;
        total_judge_votes = 0;
        for (uint256 i = 0; i < allSubmissions.length;) {
            if (allSubmissions[i].funded) {
                allSubmissions[i].votes = 0;
            } 
            unchecked { ++i; }
        }
        for(uint i=0; i<judges.length; i++) {
            judgeFunds[judges[i]] = 0;
        }
        for(uint256 i=0; i<allPatrons.length;) {
            uint256 reward = patronAmountForRefund[allPatrons[i]];
            patronAmountForRefund[allPatrons[i]] = 0;
            patronAmount[allPatrons[i]] = 0;
            payable(allPatrons[i]).transfer(reward);
            unchecked {++i;}
        }
        refunded = true;
        isActive = false;
    }

    function getPatrons() public view returns(address[] memory) {
        return allPatrons;
    }

    function getJudges() public view returns(address[] memory) {
        return judges;
    }

    function getAllSubmitters() public view returns (address[] memory) {
        return submissionTree.getAllSubmitters();
    }
}