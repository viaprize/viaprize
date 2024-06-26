// //SPDX-License-Identifier:MIT
// pragma solidity ^0.8.1;

// import "./SubmissionLibrary.sol";
// import "./SubmissionAVLTree.sol";
// import "../../helperContracts/safemath.sol";
// import "../../helperContracts/ierc20_permit.sol";                                         
// import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";
// import "@uniswap/v3-core/contracts/interfaces/IUniswapV3Pool.sol";
// import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
// import "../../helperContracts/ierc20_weth.sol";

// contract PrizeV2Judges {
//     /// @notice this will be the total amount of funds raised
//     uint256 public total_funds; 
//     /// @notice this will be the total amount of rewards available
//     uint256 public total_rewards; 
//     /// @notice this will be the total amount of rewards available for the platform
//     uint256 public platform_reward;
//     /// @notice this will be the total amount of rewards available for the proposer
//     uint256 public proposer_reward;
//     /// @notice bool to check if rewards have been distributed with end_voting_period
//     bool public distributed;
//     /// @notice this will be the time that the voting period ends
//     uint256 voting_time; 
//     /// @notice this will be the time that the submission period ends
//     uint256 submission_time;
//     /// @notice  this will be a mapping of the addresses of the proposers to a boolean value of true or false
//     mapping (address => bool) public isProposer;
//     /// @notice array of proposers;
//     address public proposer;
//     /// @notice this will be a mapping of the addresses of the funders to the amount of eth they have contributed
//     mapping (address => uint256) public funderAmount;
//     /// @notice array of funders
//     address[] public allFunders;
//     mapping(address => bool) public isFunder;
//     /// @notice Add a new mapping to store each funder's votes on each submission
//     mapping(address => mapping(bytes32 => uint256)) public funderVotes;
//     /// @notice Add a new mapping to check if a funder has received their refunds
//     mapping(bytes32 => mapping(address => bool)) public refunded;
//     /// @notice add a new refund mapping for address to bool
//     mapping(address => bool) public addressRefunded;
//     /// @notice to keep track the campaign is Alive or not
//     bool public isActive = false;
//     mapping(address => bool) public isUsdcContributor;
//     bool internal locked;
//     uint256 public totalUsdcFunds;
//     uint256 public totalUsdcRewards;
//     uint256 public totalBridgedUsdcFunds;
//     uint256 public totalBridgedUsdcRewards;

//     address[] public judges;
//     mapping(address => bool) public isJudge;
//     mapping (address => uint256) public judgeFunds;
//     mapping(address => mapping(bytes32 => uint256)) public judgeVotes;
//     uint public total_judge_votes;

//     using SafeMath for uint256;
//     uint proposerFee;
//     uint platformFee;

//     bool votingPeriod = false;
//     bool submissionPeriod = false;
        
//     address[] public platformAdmins;
//     mapping(address => bool) public isPlatformAdmin;

//     IERC20Permit private _usdc;
//     IERC20Permit private _usdcBridged;

//     ///@notice to test the things i am hardcoding this proposer contract
//     address public recipient;

//     /// @notice this will be the address of the platform
//     address public platformAddress;

//     /// @notice / @notice submissionTree contract
//     SubmissionAVLTree private submissionTree;

//     uint256 public totalVotes;
 
//     // Errors
//     /// @notice not admin error
//     error NotAdmin();

//     /// @notice error for not enough funds to vote
//     error NotEnoughFunds();

//     /// @notice error for trying to change someone elses vote
//     error NotYourVote();

//     /// @notice error for trying to claim a refund again
//     error RefundAlreadyClaimed();

//     /// @notice error for trying to claim a nonexistent refund
//     error RefundDoesntExist();

//     /// @notice if distribution has already happened
//     error RewardsAlreadyDistributed();

//     /// @notice error for trying to claim a refund when the voting period is still active
//     error RewardsNotDistributed();

//     /// @notice error for a submission that has already been made
//     error SubmissionAlreadyMade();

//     /// @notice error for trying to vote on a submission that has not been made
//     error SubmissionDoesntExist();

//     /// @notice error for when the submission period is not active
//     error SubmissionPeriodActive();

//     /// @notice error for when the submission period is not active
//     error SubmissionPeriodNotActive();

//     /// @notice error for when the voting period is not active
//     error VotingPeriodNotActive();

//     /// @notice error for trying to claim a refund when the voting period is still active
//     error VotingPeriodActive();

//     error NotJudgeToVote();

//     event SubmissionCreated(address indexed contestant, bytes32 indexed submissionHash);


//     constructor(address _proposer, address[] memory _platformAdmins, address[] memory _judges, uint _platFormFee, uint _proposerFee, address _platformAddress) {
//         /// @notice add as many proposer addresses as you need to -- replace msg.sender with the address of the proposer(s) for now this means the deployer will be the sole admin

//         proposer = _proposer;
//         isProposer[proposer] = true;
//         recipient = _proposer;
//         platformAddress = _platformAddress;
//         for (uint i = 0; i < _platformAdmins.length; i++) {
//             platformAdmins.push(_platformAdmins[i]);
//             isPlatformAdmin[_platformAdmins[i]] = true;
//         }
//         for(uint i=0; i<_judges.length; i++) {
//             judges.push(_judges[i]);
//             isJudge[_judges[i]] = true;
//         }
//         /// @notice  Initialize the submissionTree
//         submissionTree = SubmissionAVLTree(SubmissionLibrary.deploySubmission());
//         proposerFee = _proposerFee;
//         platformFee = _platFormFee;
//         _usdc = IERC20Permit(0x4DE0985B995666226f62855b1400D69ccbDa7d98);
//         _usdcBridged = IERC20Permit(0x4DE0985B995666226f62855b1400D69ccbDa7d98);
//         isActive = true;
//     }

//     modifier noReentrant() {
//         require(!locked, "No re-rentrancy");
//         locked = true;
//         _;
//         locked = false;
//     }

//     modifier onlyPlatformAdmin() {
//      require(isPlatformAdmin[msg.sender]);
//     _;
//     }

//     /// @notice create a function to start the submission period
//     function start_submission_period(uint256 _submission_time) public {
//         if(isProposer[msg.sender] == false && isPlatformAdmin[msg.sender] == false) revert NotAdmin();

//         /// @notice submission time will be in days
//         submission_time = block.timestamp + _submission_time * 1 days;
//         submissionPeriod = true;
//     }

//     /// @notice getter for submission time
//     function get_submission_time() public view returns (uint256) {
//         return submission_time;
//     }

//     /// @notice getter for voting time
//     function get_voting_time() public view returns (uint256) {
//         return voting_time;
//     }

//     function end_submission_period() public onlyPlatformAdmin {
//         if(submission_time == 0) revert SubmissionPeriodNotActive();
//         submission_time = 0;
//     }

//     /// @notice start the voting period 
//     function start_voting_period(uint256 _voting_time) public {
//         if(isProposer[msg.sender] == false && isPlatformAdmin[msg.sender] == false) revert NotAdmin();
//         if(block.timestamp < submission_time) revert SubmissionPeriodActive();
//         /// @notice voting time also in days
//         voting_time = block.timestamp + _voting_time * 1 days;
//         votingPeriod = true;
//     }

//     function end_voting_period() public onlyPlatformAdmin {
//         if(voting_time == 0) revert VotingPeriodNotActive();
//         voting_time = 0;
//         distribute_use_unused_votes_v2();
//         distributeRewards();
//         isActive = false;
//     }

//     function increase_submission_period(uint256 _submissionTime) public onlyPlatformAdmin {
//         if(votingPeriod) revert VotingPeriodActive();
//         if(!submissionPeriod) revert SubmissionPeriodNotActive();
//         submission_time = block.timestamp + _submissionTime * 1 days;
//     }

//     function increase_voting_period(uint256 _votingTime) public onlyPlatformAdmin {
//         if(!votingPeriod) revert VotingPeriodNotActive();
//         if(distributed == true) revert RewardsAlreadyDistributed();
//         voting_time = block.timestamp + _votingTime * 1 days;
//     }

//     /// @notice Distribute rewards
//     function distributeRewards() private {
//         if(isProposer[msg.sender] == false && isPlatformAdmin[msg.sender] == false) revert NotAdmin();
//         if(distributed == true) revert RewardsAlreadyDistributed();
//         SubmissionAVLTree.SubmissionInfo[] memory allSubmissions = getAllSubmissions();
//         uint256 usdcPlatformReward;
//         uint256 usdcProposerReward;
//         uint256 usdcBridgedPlatformReward;
//         uint256 usdcBridgedProposerReward;

//         if(allSubmissions.length > 0) {
//             /// @notice  Count the number of funded submissions and add them to the fundedSubmissions array
//             for (uint256 i = 0; i < allSubmissions.length;) {
//                 if(allSubmissions[i].funded && allSubmissions[i].usdcVotes > 0) {
//                     uint256 reward = (allSubmissions[i].usdcVotes);
//                     allSubmissions[i].usdcVotes = 0;
//                     totalUsdcRewards.sub(reward);
//                     _usdc.transfer(allSubmissions[i].contestant, reward);
//                 }
//                 if(allSubmissions[i].funded c&& allSubmissions[i].usdcBridgedVotes > 0) {
//                     uint256 reward = (allSubmissions[i].usdcBridgedVotes);
//                     allSubmissions[i].usdcBridgedVotes = 0;
//                     totalBridgedUsdcRewards.sub(reward);
//                     _usdcBridged.transfer(allSubmissions[i].contestant, reward);
//                 } 
//                 unchecked { ++i; }
//             }
//             total_rewards = 0;
//             if(totalUsdcFunds > 0) {
//                 usdcPlatformReward = (totalUsdcFunds * platformFee) / 100;
//                 usdcProposerReward = (totalUsdcFunds * proposerFee) / 100;
//                 uint256 send_usdc_platform_reward = usdcPlatformReward;
//                 uint256 send_usdc_proposer_reward = usdcProposerReward;
//                 _usdc.transfer(platformAddress, send_usdc_platform_reward);
//                 _usdc.transfer(recipient, send_usdc_proposer_reward);
//             }
//             if(totalBridgedUsdcFunds > 0) {
//                 usdcBridgedPlatformReward = (totalUsdcFunds * platformFee) / 100;
//                 usdcBridgedProposerReward = (totalUsdcFunds * proposerFee) / 100;
//                 uint256 send_usdcBridged_platform_reward = usdcBridgedPlatformReward;
//                 uint256 send_usdcBridged_proposer_reward = usdcBridgedProposerReward;
//                 _usdcBridged.transfer(platformAddress, send_usdcBridged_platform_reward);
//                 _usdcBridged.transfer(recipient, send_usdcBridged_proposer_reward);
//             }
//             distributed = true;
//         }

//         if(allSubmissions.length == 0 || allFunders.length == 0 || totalVotes == 0) {
//             for(uint256 i=0; i<allFunders.length; i++) {
//                 if(isUsdcContributor[allFunders[i]]) {
//                     _usdc.transfer(allFunders[i], funderAmount[allFunders[i]]);
//                     funderAmount[allFunders[i]] = 0;
//                 }
//                 if(!isUsdcContributor[allFunders[i]]) {
//                     _usdcBridged.transfer(allFunders[i], funderAmount[allFunders[i]]);
//                     funderAmount[allFunders[i]] = 0;
//                 }
//             }
//             distributed = true;
//         }
//     }

//     /// @notice addSubmission should return the submissionHash
//     function addSubmission(address contestant, string memory submissionText) public returns(bytes32) {
//         if (block.timestamp > submission_time) revert SubmissionPeriodNotActive();
//         bytes32 submissionHash = keccak256(abi.encodePacked(contestant, submissionText));
//         submissionTree.add_submission(contestant, submissionHash, submissionText);
//         emit SubmissionCreated(contestant, submissionHash);
//         return submissionHash;
//     }

//     /// @notice create a function to allow funders to vote for a submission
//     /// @notice  Update the vote function
//     function vote(bytes32 _submissionHash, uint256 amount) public {
//         if (block.timestamp > voting_time) revert VotingPeriodNotActive();
//         if(!isJudge[msg.sender]) revert NotJudgeToVote();
//         if (amount > funderAmount[msg.sender]) revert NotEnoughFunds();

//         judgeFunds[msg.sender] -= amount;
//         SubmissionAVLTree.SubmissionInfo memory submissionCheck = submissionTree.getSubmission(_submissionHash);
//         /// @notice submission should return a struct with the submissionHash, the contestant, the submissionText, the threshhold, the votes, and the funded status 
//         //  -- check if the submission hash is in the tree
//         if (submissionCheck.submissionHash != _submissionHash) revert SubmissionDoesntExist();

//         if(isUsdcContributor[msg.sender]) {
//             funderAmount[msg.sender] -= amount;
//             submissionTree.addUsdcVotes(_submissionHash, amount);
//             funderVotes[msg.sender][_submissionHash].add(amount);
//             totalVotes.add(amount);
//             submissionTree.updateFunderBalance(_submissionHash, msg.sender, (funderVotes[msg.sender][_submissionHash] * (100-platformFee))/100);
//             SubmissionAVLTree.SubmissionInfo memory submission = submissionTree.getSubmission(_submissionHash);
//             if (submission.usdcVotes > 0) {
//                 submissionTree.setFundedTrue(_submissionHash, true);
//             }
//         }
//         if(!isUsdcContributor[msg.sender]) {
//             funderAmount[msg.sender] -= amount;
//             submissionTree.addUsdcBridgedVotes(_submissionHash, amount);
//             funderVotes[msg.sender][_submissionHash] += amount;
//             totalVotes.add(amount);
//             submissionTree.updateFunderBalance(_submissionHash, msg.sender, (funderVotes[msg.sender][_submissionHash] * (100-platformFee))/100);
//             SubmissionAVLTree.SubmissionInfo memory submission = submissionTree.getSubmission(_submissionHash);
//             if (submission.usdcBridgedVotes > 0) {
//                 submissionTree.setFundedTrue(_submissionHash, true);
//             }
//         }
//     }

//     /// @notice Change_votes should now stop folks from being able to change someone elses vote
//     function change_vote(bytes32 _previous_submissionHash, bytes32 _new_submissionHash, uint256 amount) public {
//         if (block.timestamp > voting_time) revert VotingPeriodNotActive();
//         if (funderVotes[msg.sender][_previous_submissionHash] < amount) revert NotYourVote();
//         if(!isFunder[msg.sender]) revert("you are not a funder");
//         if(isUsdcContributor[msg.sender]) {
//             submissionTree.subUsdcVotes(_previous_submissionHash, amount);
//             submissionTree.addUsdcVotes(_new_submissionHash, amount);
//             submissionTree.updateFunderBalance(_previous_submissionHash, msg.sender, (funderVotes[msg.sender][_previous_submissionHash]*(100-platformFee))/100);
//             submissionTree.updateFunderBalance(_new_submissionHash, msg.sender, (funderVotes[msg.sender][_new_submissionHash]*(100-platformFee))/100);
//             funderVotes[msg.sender][_previous_submissionHash] -= amount;
//             funderVotes[msg.sender][_new_submissionHash] += amount;

//             SubmissionAVLTree.SubmissionInfo memory previousSubmission = submissionTree.getSubmission(_previous_submissionHash);

//             if (previousSubmission.usdcVotes <= 0) {
//                 submissionTree.setFundedTrue(_previous_submissionHash, false);
//             }

//             SubmissionAVLTree.SubmissionInfo memory newSubmission = submissionTree.getSubmission(_new_submissionHash);

//             if (newSubmission.usdcVotes > 0) {
//                 submissionTree.setFundedTrue(_new_submissionHash, true);
//             }
//         }
//         if(!isUsdcContributor[msg.sender]) {
//             submissionTree.subBridgedUsdcVotes(_previous_submissionHash, amount);
//             submissionTree.addUsdcBridgedVotes(_new_submissionHash, amount);
//             submissionTree.updateFunderBalance(_previous_submissionHash, msg.sender, (funderVotes[msg.sender][_previous_submissionHash]*(100-platformFee))/100);
//             submissionTree.updateFunderBalance(_new_submissionHash, msg.sender, (funderVotes[msg.sender][_new_submissionHash]*(100-platformFee))/100);
//             funderVotes[msg.sender][_previous_submissionHash] -= amount;
//             funderVotes[msg.sender][_new_submissionHash] += amount;

//             SubmissionAVLTree.SubmissionInfo memory previousSubmission = submissionTree.getSubmission(_previous_submissionHash);

//             if (previousSubmission.usdcBridgedVotes <= 0) {
//                 submissionTree.setFundedTrue(_previous_submissionHash, false);
//             }

//             SubmissionAVLTree.SubmissionInfo memory newSubmission = submissionTree.getSubmission(_new_submissionHash);

//             if (newSubmission.usdcBridgedVotes > 0) {
//                 submissionTree.setFundedTrue(_new_submissionHash, true);
//             }
//         }
//     }

//     /// @notice uses functionality of the AVL tree to get all submissions
//     function getAllSubmissions() public view returns (SubmissionAVLTree.SubmissionInfo[] memory) {
//         return submissionTree.inOrderTraversal();
//     }

//     /// @notice get submission by submissionHash
//     function get_submission_by_hash(bytes32 submissionHash) public view returns (SubmissionAVLTree.SubmissionInfo memory){
//         SubmissionAVLTree.SubmissionInfo memory submission = submissionTree.getSubmission(submissionHash);
//         return submission;
//     }

//     function addUsdcFunds(address sender, address spender, uint256 _amountUsdc, uint256 _deadline, uint8 v, bytes32 r, bytes32 s) public noReentrant payable {
//         require(_amountUsdc > 0, "funds should be greater than 0");
//          require(_amountUsdc > 0, "funds should be greater than 0");
//         _usdc.permit(sender, spender, _amountUsdc, _deadline, v, r, s);
//         _usdc.transferFrom(msg.sender, address(this), _amountUsdc);
//         if(!isActive) revert("Funding to contract ended");
//         uint256 _donation = _amountUsdc;
//         isFunder[msg.sender] = true;
//         isUsdcContributor[msg.sender] = true;
//         funderAmount[msg.sender] = funderAmount[msg.sender].add(_donation);
//         totalUsdcRewards = totalUsdcRewards.add((_donation.mul(100 - (platformFee + proposerFee))).div(100));
//         totalUsdcFunds = totalUsdcFunds.add(_donation);
//         total_rewards = total_rewards.add((_donation.mul(100 - (platformFee + proposerFee))).div(100));
//         total_funds = total_funds.add(_donation);
//         funderAmount[msg.sender].add(msg.value);
//         allFunders.push(msg.sender);
//     }

//     function addBridgedUsdcFunds(address sender, address spender, uint256 _amountUsdc, uint256 _deadline, uint8 v, bytes32 r, bytes32 s) public noReentrant payable {
//         require(_amountUsdc > 0, "funds should be greater than 0");
//          require(_amountUsdc > 0, "funds should be greater than 0");
//         _usdcBridged.permit(sender, spender, _amountUsdc, _deadline, v, r, s);
//         _usdcBridged.transferFrom(msg.sender, address(this), _amountUsdc);
//         if(!isActive) revert("Funding to contract ended");
//         uint256 _donation = _amountUsdc;
//         isFunder[msg.sender] = true;
//         isUsdcContributor[msg.sender] = false;
//         funderAmount[msg.sender] = funderAmount[msg.sender].add(_donation);
//         totalBridgedUsdcRewards = totalBridgedUsdcRewards.add((_donation.mul(100 - (platformFee + proposerFee))).div(100));
//         totalBridgedUsdcFunds = totalUsdcFunds.add(_donation);
//         total_rewards = total_rewards.add((_donation.mul(100 - (platformFee + proposerFee))).div(100));
//         total_funds = total_funds.add(_donation);
//         funderAmount[msg.sender].add(msg.value);
//         allFunders.push(msg.sender);
//     }

//    /// @notice this fn sends the unused votes to the contestant based on their previous votes.
//     function distribute_use_unused_votes_v2() private returns(uint256, uint256, uint256, uint256){
//        if(isProposer[msg.sender] == false && isPlatformAdmin[msg.sender] == false) revert NotAdmin();
//        uint256 total_usdc_votes = 0;
//        uint256 total_usdcBridged_votes = 0;

//        SubmissionAVLTree.SubmissionInfo[] memory allSubmissions = getAllSubmissions();
//        for(uint256 i=0; i<allSubmissions.length; i++) {
//            total_usdc_votes += allSubmissions[i].usdcVotes;
//            total_usdcBridged_votes += allSubmissions[i].usdcBridgedVotes;
//        }
//        uint256 total_unused_usdc_votes = totalUsdcRewards.sub(total_usdc_votes);
//        uint256 total_unused_usdcBridged_votes = totalBridgedUsdcRewards.sub(total_usdcBridged_votes);

//        for(uint256 i=0; i<allSubmissions.length; i++) {
//             if(total_unused_usdc_votes > 0) {
//                 uint256 individual_usdc_percentage = (allSubmissions[i].usdcVotes.mul(100)).div(total_usdc_votes); 
//                 uint256 transferable_usdc_amount = (total_unused_usdc_votes.mul(individual_usdc_percentage)).div(100);
//                 _usdc.transfer(allSubmissions[i].contestant, transferable_usdc_amount);
//             }
//             if(total_unused_usdcBridged_votes > 0) {
//                 uint256 individual_usdcBridged_percentage = (allSubmissions[i].usdcBridgedVotes.mul(100)).div(total_usdcBridged_votes); 
//                 uint256 transferable_usdcBridged_amount = (total_unused_usdcBridged_votes.mul(individual_usdcBridged_percentage)).div(100);
//                 _usdcBridged.transfer(allSubmissions[i].contestant, transferable_usdcBridged_amount);
//             }
//        }
//        return (total_usdc_votes, total_usdcBridged_votes, totalUsdcRewards, totalBridgedUsdcRewards);
//    }

//     function assignUsdcJudgeVotes() public {
//         uint256 judge_funds = total_judge_votes / judges.length;
//         total_judge_votes = 0;
//         for(uint i=0; i<judges.length; i++) {
//             judgeFunds[judges[i]] += judge_funds;
//         }
//     }

//     function getFunders() public view returns(address[] memory) {
//         return allFunders;
//     }

//     function getJudges() public view returns(address[] memory) {
//         return judges;
//     }
// }