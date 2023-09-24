/// @notice  SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./SubmissionAVLTree.sol";

/* 
·--------------------------------------------|---------------------------|-------------|-----------------------------·
|            Solc version: 0.8.17            ·  Optimizer enabled: true  ·  Runs: 200  ·  Block limit: 30000000 gas  │
·············································|···························|·············|······························
|  Methods                                                                                                           │
·················|···························|·············|·············|·············|···············|··············
|  Contract      ·  Method                   ·  Min        ·  Max        ·  Avg        ·  # calls      ·  usd (avg)  │
·················|···························|·············|·············|·············|···············|··············
|  YourContract  ·  addFunds                 ·          -  ·          -  ·      88122  ·            7  ·          -  │
·················|···························|·············|·············|·············|···············|··············
|  YourContract  ·  addSubmission            ·     156299  ·     159237  ·     156987  ·            9  ·          -  │
·················|···························|·············|·············|·············|···············|··············
|  YourContract  ·  change_vote              ·          -  ·          -  ·     155682  ·            1  ·          -  │
·················|···························|·············|·············|·············|···············|··············
|  YourContract  ·  claimRefund              ·          -  ·          -  ·     122820  ·            1  ·          -  │
·················|···························|·············|·············|·············|···············|··············
|  YourContract  ·  end_submission_period    ·          -  ·          -  ·      23728  ·            7  ·          -  │
·················|···························|·············|·············|·············|···············|··············
|  YourContract  ·  end_voting_period        ·      98752  ·     128846  ·     111425  ·            3  ·          -  │
·················|···························|·············|·············|·············|···············|··············
|  YourContract  ·  start_submission_period  ·          -  ·          -  ·      46031  ·            9  ·          -  │
·················|···························|·············|·············|·············|···············|··············
|  YourContract  ·  start_voting_period      ·          -  ·          -  ·      48046  ·            7  ·          -  │
·················|···························|·············|·············|·············|···············|··············
|  YourContract  ·  vote                     ·     133606  ·     156329  ·     146542  ·            7  ·          -  │
·················|···························|·············|·············|·············|···············|··············
|  Deployments                               ·                                         ·  % of limit   ·             │
·············································|·············|·············|·············|···············|··············
|  SubmissionAVLTree                         ·          -  ·          -  ·    1340421  ·        4.5 %  ·          -  │
·············································|·············|·············|·············|···············|··············
|  YourContract                              ·    1780893  ·    1780905  ·    1780904  ·        5.9 %  ·          -  │
·--------------------------------------------|-------------|-------------|-------------|---------------|-------------·
*/

contract ViaPrize {
    /// @notice this will be the total amount of funds raised
    uint256 public total_funds; 
    /// @notice this will be the total amount of rewards available
    uint256 public total_rewards; 
    /// @notice this will be the total amount of rewards available for the platform
    uint256 public platform_reward;
    /// @notice bool to check if rewards have been distributed with end_voting_period
    bool public distributed;
    /// @notice this will be the time that the voting period ends
    uint256 voting_time; 
    /// @notice this will be the time that the submission period ends
    uint256 submission_time;
    /// @notice  this will be a mapping of the addresses of the admins to a boolean value of true or false
    mapping (address => bool) public admins; 
    /// @notice this will be a mapping of the addresses of the funders to the amount of eth they have contributed
    mapping (address => uint256) public funders;
    /// @notice Add a new mapping to store each funder's votes on each submission
    mapping(address => mapping(bytes32 => uint256)) public funderVotes;
    /// @notice Add a new mapping to check if a funder has received their refunds
    mapping(bytes32 => mapping(address => bool)) public refunded;
    /// @notice add a new refund mapping for address to bool
    mapping(address => bool) public addressRefunded;

    uint proposerFee;
    uint platformFee;

    bool votingPeriod = false;

    address[] public Platformadmins;
    mapping(address => bool) public isPlatformAdmin;


    /// @notice this will be the address of the platform
    address public constant PLATFORM_ADDRESS = 0xcd258fCe467DDAbA643f813141c3560FF6c12518; 

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


    constructor(address submissionContract, uint _platFormFee, uint _proposerFee) {
        /// @notice add as many admins as you need to -- replace msg.sender with the address of the admin(s) for now this means the deployer will be the sole admin
        admins[msg.sender] = true;
        Platformadmins = [0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2, 0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db];
        for (uint i = 0; i < Platformadmins.length; i++) {
            isPlatformAdmin[Platformadmins[i]] = true;
        }
        /// @notice  Initialize the submissionTree
        submissionTree = SubmissionAVLTree(submissionContract); 
        proposerFee = _proposerFee;
        platformFee = _platFormFee;
    }


    modifier onlyPlatformAdmin() {
    require(isPlatformAdmin[msg.sender]);
    _;
    }

    /// @notice create a function to start the submission period
    function start_submission_period(uint256 _submission_time) public {
        if(admins[msg.sender] == false || isPlatformAdmin[msg.sender] == false) revert NotAdmin();

        /// @notice submission time will be in days
        submission_time = block.timestamp + _submission_time * 1 days;
     
    }

    /// @notice getter for submission time
    function get_submission_time() public view returns (uint256) {
        return submission_time;
    }

    /// @notice getter for voting time
    function get_voting_time() public view returns (uint256) {
        return voting_time;
    }

    function end_submission_period() public onlyPlatformAdmin {
        submission_time = 0;
    }

    /// @notice start the voting period
    function start_voting_period(uint256 _voting_time) public {
        if(admins[msg.sender] == false || isPlatformAdmin[msg.sender] == false) revert NotAdmin();
        if(block.timestamp < submission_time) revert SubmissionPeriodActive();

        /// @notice voting time also in days
        voting_time = block.timestamp + _voting_time * 1 days;
        votingPeriod = true;

    }

     function end_voting_period() public onlyPlatformAdmin {
            voting_time = 0;
            distributeRewards();
    }

    /// @notice end the voting period
//     function distribute_rewards() public {
//         require(votingPeriod == true, "you cant distribute rewards without starting votingPeriod");
//         if(block.timestamp < voting_time) revert VotingPeriodActive();
//         distributeRewards();
//         votingPeriod = false;
// }

    /// @notice Distribute rewards
    function distributeRewards() private {
        if(admins[msg.sender] == false) revert NotAdmin();
        if(distributed == true) revert RewardsAlreadyDistributed();
        SubmissionAVLTree.SubmissionInfo[] memory allSubmissions = getAllSubmissions();
        platform_reward = (total_funds * platformFee ) / 100;
        /// @notice  Count the number of funded submissions and add them to the fundedSubmissions array
        for (uint256 i = 0; i < allSubmissions.length;) {
        if (allSubmissions[i].funded) {
            uint256 reward = (allSubmissions[i].votes * (100-proposerFee-platformFee)) / 100;
            total_rewards -= reward;
            payable(allSubmissions[i].submitter).transfer(reward);
        } 
        unchecked { ++i; }
    }
        // total_rewards = 0;
        /// @notice  Send the platform reward
        uint256 _send_platform_reward = platform_reward;
        // platform_reward = 0;
        distributed = true;
        payable(PLATFORM_ADDRESS).transfer(_send_platform_reward);
    }

    /// @notice addSubmission should return the submissionHash
    function addSubmission(address submitter, string memory submissionText) public returns (bytes32) {
        if (block.timestamp > submission_time) revert SubmissionPeriodNotActive();
        bytes32 submissionHash = keccak256(abi.encodePacked(submitter, submissionText));
        submissionTree.add_submission(submitter, submissionHash, submissionText);

        return submissionHash;
    }

    /// @notice create a function to allow funders to vote for a submission
    /// @notice  Update the vote function
    function vote(bytes32 _submissionHash, uint256 amount) public {
        if (block.timestamp > voting_time) revert VotingPeriodNotActive();
        if (amount > funders[msg.sender]) revert NotEnoughFunds();

        funders[msg.sender] -= amount;
        SubmissionAVLTree.SubmissionInfo memory submissionCheck = submissionTree.getSubmission(_submissionHash);
        /// @notice submission should return a struct with the submissionHash, the submitter, the submissionText, the threshhold, the votes, and the funded status 
        //  -- check if the submission hash is in the tree
        if (submissionCheck.submissionHash != _submissionHash) revert SubmissionDoesntExist();

        submissionTree.addVotes(_submissionHash, amount);
        funderVotes[msg.sender][_submissionHash] += amount;
        submissionTree.updateFunderBalance(_submissionHash, msg.sender, (funderVotes[msg.sender][_submissionHash]*(100-platformFee))/100);

        // SubmissionAVLTree.SubmissionInfo memory submission = submissionTree.getSubmission(_submissionHash);
        // if (submission.votes >= submission.threshhold) {
        // submissionTree.setThresholdCrossed(_submissionHash, true);
        // }


    }

    /// @notice Change_votes should now stop folks from being able to change someone elses vote
    function change_vote(bytes32 _previous_submissionHash, bytes32 _new_submissionHash, uint256 amount) public {
        if (block.timestamp > voting_time) revert VotingPeriodNotActive();
        if (funderVotes[msg.sender][_previous_submissionHash] < amount) revert NotYourVote();

        submissionTree.subVotes(_previous_submissionHash, amount);
        submissionTree.addVotes(_new_submissionHash, amount);
        submissionTree.updateFunderBalance(_previous_submissionHash, msg.sender, (funderVotes[msg.sender][_previous_submissionHash]*(100-platformFee))/100);
        submissionTree.updateFunderBalance(_new_submissionHash, msg.sender, (funderVotes[msg.sender][_new_submissionHash]*(100-platformFee))/100);
        funderVotes[msg.sender][_previous_submissionHash] -= amount;
        funderVotes[msg.sender][_new_submissionHash] += amount;

        // SubmissionAVLTree.SubmissionInfo memory previousSubmission = submissionTree.getSubmission(_previous_submissionHash);

        // if (previousSubmission.votes < previousSubmission.threshhold) {
        //     submissionTree.setThresholdCrossed(_previous_submissionHash, false);
        // }

        // SubmissionAVLTree.SubmissionInfo memory newSubmission = submissionTree.getSubmission(_new_submissionHash);

        // if (newSubmission.votes >= newSubmission.threshhold) {
        //     submissionTree.setThresholdCrossed(_new_submissionHash, true);
        // }


        }

    /// @notice uses functionality of the AVL tree to get all submissions
    function getAllSubmissions() public view returns (SubmissionAVLTree.SubmissionInfo[] memory) {
        return submissionTree.inOrderTraversal();
    }

    /// @notice function to allow funders to add funds to the contract
    function addFunds() public payable {
        if (msg.value == 0) revert NotEnoughFunds();
            funders[msg.sender] += msg.value;
            total_funds += msg.value;
            total_rewards += (msg.value * (100-platformFee)) / 100; /// @notice  platform fee will depend on the prize
    }

    receive () external payable {
        addFunds();
    }

    /// @notice create function to allow admins to withdraw funds to the submission winners and the platform but do not iterate through an unknown length array
    function use_unused_votes(bytes32 _submissionHash) public {
        if(admins[msg.sender] == false) revert NotAdmin();
        if (block.timestamp > voting_time) revert VotingPeriodNotActive();

        uint256 unused_admin_votes = total_funds - total_rewards;
        submissionTree.addVotes(_submissionHash, unused_admin_votes);
        unused_admin_votes = 0;
    }

    /// @notice Allows users to withdraw funds that they have voted for but did not cross threshhold as well as unused funds 
    function claimRefund(address recipient) public {
        if (block.timestamp < voting_time) revert VotingPeriodActive();
        if (addressRefunded[recipient] == true) revert RefundAlreadyClaimed();
        if (recipient != msg.sender) revert NotYourVote();
        if (funders[recipient] <= 0) revert RefundDoesntExist();
        if (distributed != true) revert RewardsNotDistributed();

        SubmissionAVLTree.SubmissionInfo[] memory allSubmissions = getAllSubmissions();

        uint256 totalRefundAmount = 0;

        /// @notice  Count the number of funded submissions and add them to the fundedSubmissions array
        for (uint256 i = 0; i < allSubmissions.length;) {
            if (!allSubmissions[i].funded) {
                uint256 refundAmount = submissionTree.submissionFunderBalances(allSubmissions[i].submissionHash, recipient);
                if (refundAmount == 0) revert RefundDoesntExist();
                if (refunded[allSubmissions[i].submissionHash][recipient]) revert RefundAlreadyClaimed();

                refunded[allSubmissions[i].submissionHash][recipient] = true;
                totalRefundAmount += refundAmount;
            }
        unchecked { ++i; }
        }

        /// @notice - remember that 5% of the fees go to the platform as a reward. 

        totalRefundAmount += (funders[recipient]*(100-platformFee))/100;
        totalRefundAmount -= tx.gasprice;

        addressRefunded[recipient] = true;
        if (address(this).balance <  totalRefundAmount) revert NotEnoughFunds();
        total_funds -= totalRefundAmount;
        payable(recipient).transfer(totalRefundAmount);


    }      

    /// @notice Simple view functions to check the refund amount
    function check_refund_amount(address recipient) public view returns (uint256 _refundAmount) {
        if(admins[msg.sender] == false) revert NotAdmin();
        if(block.timestamp < voting_time) revert VotingPeriodActive();
        SubmissionAVLTree.SubmissionInfo[] memory allSubmissions = getAllSubmissions();

        uint256 refundAmount = 0;

        /// @notice  Count the number of unfunded submissions
        for (uint256 i = 0; i < allSubmissions.length;) {
            if (!allSubmissions[i].funded) {
                uint256 subRefundAmount = submissionTree.submissionFunderBalances(allSubmissions[i].submissionHash, recipient);
                refundAmount += subRefundAmount;
                return refundAmount;
            }
        unchecked { ++i; }
        }
        
    }

}