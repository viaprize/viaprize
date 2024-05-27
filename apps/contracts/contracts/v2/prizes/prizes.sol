/// @notice  SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./SubmissionLibrary.sol";
import "./SubmissionAVLTree.sol";
import "../../helperContracts/safemath.sol";
import "../../helperContracts/ierc20_permit.sol";                                         
import "../../helperContracts/nonReentrant.sol";
import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";


// // import "./helperContracts/safemath.sol";
// interface IERC20Permit is IERC20 {
//     function permit(address owner, address spender, uint256 value, uint256 deadline, uint8 v, bytes32 r, bytes32 s) external;
// }


contract ViaPrize is ReentrancyGuard {
    /// @notice this will be the total amount of funds raised
    uint256 public totalFunds; 
    /// @notice this will be the total amount of rewards available
    uint256 public totalRewards; 
    /// @notice this will be the total amount of rewards available for the platform
    // uint256 public platformReward;
    /// @notice this will be the total amount of rewards available for the proposer
    // uint256 public proposer_reward;
    /// @notice bool to check if rewards have been distributed with end_voting_period
    bool public distributed;
    /// @notice this will be the time that the voting period ends
    uint256 votingTime; 
    /// @notice this will be the time that the submission period ends
    uint256 submissionTime;
    /// @notice  this will be a mapping of the addresses of the proposers to a boolean value of true or false
    mapping (address => bool) public isProposer;
    /// @notice  person who proposed the prize;
    address public proposer;
    /// @notice this will be a mapping of the addresses of the funders to the amount of eth they have contributed
    mapping (address => uint256) public funderAmount;
    /// @notice array of funders
    address[] public allFunders;
    mapping(address => bool) public isFunder;
    /// @notice Add a new mapping to store each funder's votes on each submission
    mapping(address => mapping(bytes32 => uint256)) public funderVotes;
    /// @notice Add a new mapping to check if a funder has received their refunds
    mapping(bytes32 => mapping(address => bool)) public refunded;
    /// @notice add a new refund mapping for address to bool
    mapping(address => bool) public addressRefunded;
    /// @notice to keep track the campaign is Alive or not
    bool public isActive = false;
    uint8 public constant VERSION = 2;
    mapping(address => bool) public isUsdcContributor;
    bool internal locked;
    uint256 public totalUsdcFunds;
    uint256 public totalUsdcRewards;
    uint256 public totalBridgedUsdcFunds;
    uint256 public totalBridgedUsdcRewards;

    using SafeMath for uint256;
    uint proposerFee;
    uint platformFee;

    bool public votingPeriod = false;
    bool public submissionPeriod = false;
        
    address[] public platformAdmins;
    mapping(address => bool) public isPlatformAdmin;

    IERC20Permit private _usdc;
    IERC20Permit private _usdcBridged;

    /// @notice initializing swaprouter interface
    ISwapRouter public immutable swapRouter;

    /// @notice initializing brdiged usdc and usdc pool 
    IUniswapV3Pool public immutable bridgedUsdcPool;

    /// @notice 

    /// @notice this will be the address of the platform
    address public platformAddress;

    /// @notice / @notice submissionTree contract
    SubmissionAVLTree private submissionTree;

    uint256 public totalVotes;
 
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

    event SubmissionCreated(address indexed contestant, bytes32 indexed submissionHash);
    event CampaignCreated(address indexed proposer, address indexed contractAddress);
    event Voted(bytes32 indexed votedTo, address indexed votedBy, uint256 amountVoted);


    constructor(address _proposer, address[] memory _platformAdmins, uint _platFormFee, uint _proposerFee, address _platformAddress, address _usdcAddress, address _usdcBridgedAddress , address _swapRouter ,address _usdcToUsdcePool,address _usdcToEthPool,address _ethPriceAggregator) {
        /// @notice add as many proposer addresses as you need to -- replace msg.sender with the address of the proposer(s) for now this means the deployer will be the sole admin

        proposer = _proposer;
        isProposer[proposer] = true;
        platformAddress = _platformAddress;
        for (uint i = 0; i < _platformAdmins.length; i++) {
            platformAdmins.push(_platformAdmins[i]);
            isPlatformAdmin[_platformAdmins[i]] = true;
        }
        /// @notice  Initialize the submissionTree
        submissionTree = SubmissionAVLTree(SubmissionLibrary.deploySubmission());
        proposerFee = _proposerFee;
        platformFee = _platFormFee;
        _usdc = IERC20Permit(_usdcAddress);
        _usdcBridged = IERC20Permit(_usdcBridgedAddress);
        isActive = true;
        swapRouter = ISwapRouter(_swapRouter);
        ridgedUsdcPool = IUniswapV3Pool(_usdcToUsdcePool);
        ethUsdcPool = IUniswapV3Pool(_usdcToEthPool);
        ethPriceAggregator = AggregatorV3Interface(_ethPriceAggregator);
        
        emit CampaignCreated(proposer, address(this));
    }

    modifier noReentrant() {
        require(!locked, "NR");
        locked = true;
        _;
        locked = false;
    }

    modifier onlyPlatformAdmin() {
     require(isPlatformAdmin[msg.sender],"NP");
    _;
    }

    modifier onlyPlatformAdminOrProposer() {
        require(isPlatformAdmin[msg.sender] || isProposer[msg.sender], "NPP");
        _;
    }

    /// @notice create a function to start the submission period
    function startSubmissionPeriod(uint256 _submissionTime) public  onlyPlatformAdminOrProposer {
        /// @notice submission time will be in minutes
        submissionTime = block.timestamp + _submissionTime * 1 minutes;
        submissionPeriod = true;
    }

    /// @notice start the voting period 
    function startVotingPeriod(uint256 _votingTime) public  onlyPlatformAdminOrProposer {
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
    }

    function endVotingPeriod() public onlyPlatformAdmin {
        if(votingTime == 0) revert VotingPeriodNotActive();
        votingTime = 0;
        distributeUnusedVotes();
        distributeRewards();
        votingPeriod = false;
        isActive = false;

    }

    function increaseSubmissionPeriod(uint256 _submissionTime) public onlyPlatformAdmin {
        if(votingPeriod) revert VotingPeriodActive();
        if(!submissionPeriod) revert SubmissionPeriodNotActive();
        submissionTime = block.timestamp + _submissionTime * 1 minutes;
    }

    function increaseVotingPeriod(uint256 _votingTime) public onlyPlatformAdmin {
        if(!votingPeriod) revert VotingPeriodNotActive();
        if(distributed == true) revert RewardsAlreadyDistributed();
        votingTime = block.timestamp + _votingTime * 1 minutes;
    }

    /// @notice Distribute rewards
    function distributeRewards() onlyPlatformAdminOrProposer private {
        if(distributed == true) revert RewardsAlreadyDistributed();
        SubmissionAVLTree.SubmissionInfo[] memory allSubmissions = getAllSubmissions();
        uint256 usdcPlatformReward;
        uint256 usdcProposerReward;
        uint256 usdcBridgedPlatformReward;
        uint256 usdcBridgedProposerReward;

        if(allSubmissions.length > 0) {
            /// @notice  Count the number of funded submissions and add them to the fundedSubmissions array
            for (uint256 i = 0; i < allSubmissions.length;) {
                if(allSubmissions[i].funded && allSubmissions[i].usdcVotes > 0) {
                    uint256 reward = (allSubmissions[i].usdcVotes);
                    allSubmissions[i].usdcVotes = 0;
                    totalUsdcRewards.sub(reward);
                    _usdc.transfer(allSubmissions[i].contestant, reward);
                }
                if(allSubmissions[i].funded && allSubmissions[i].usdcBridgedVotes > 0) {
                    uint256 reward = (allSubmissions[i].usdcBridgedVotes);
                    allSubmissions[i].usdcBridgedVotes = 0;
                    totalBridgedUsdcRewards.sub(reward);
                    _usdcBridged.transfer(allSubmissions[i].contestant, reward);
                } 
                unchecked { ++i; }
            }
            totalRewards = 0;
            if(totalUsdcFunds > 0) {
                usdcPlatformReward = (totalUsdcFunds * platformFee) / 100;
                usdcProposerReward = (totalUsdcFunds * proposerFee) / 100;
                uint256 send_usdc_platform_reward = usdcPlatformReward;
                uint256 send_usdc_proposer_reward = usdcProposerReward;
                _usdc.transfer(platformAddress, send_usdc_platform_reward);
                _usdc.transfer(proposer, send_usdc_proposer_reward);
            }
            if(totalBridgedUsdcFunds > 0) {
                usdcBridgedPlatformReward = (totalUsdcFunds * platformFee) / 100;
                usdcBridgedProposerReward = (totalUsdcFunds * proposerFee) / 100;
                uint256 send_usdcBridged_platform_reward = usdcBridgedPlatformReward;
                uint256 send_usdcBridged_proposer_reward = usdcBridgedProposerReward;
                _usdcBridged.transfer(platformAddress, send_usdcBridged_platform_reward);
                _usdcBridged.transfer(proposer, send_usdcBridged_proposer_reward);
            }
            distributed = true;
        }

        if(allSubmissions.length == 0 || allFunders.length == 0 || totalVotes == 0) {
            for(uint256 i=0; i<allFunders.length; i++) {
                if(isUsdcContributor[allFunders[i]]) {
                    _usdc.transfer(allFunders[i], funderAmount[allFunders[i]]);
                    funderAmount[allFunders[i]] = 0;
                }
                if(!isUsdcContributor[allFunders[i]]) {
                    _usdcBridged.transfer(allFunders[i], funderAmount[allFunders[i]]);
                    funderAmount[allFunders[i]] = 0; 
                }
            }
            distributed = true;
        }
    }

    /// @notice addSubmission should return the submissionHash
    function addSubmission(address contestant, string memory submissionText) public onlyPlatformAdmin returns(bytes32) {
        if (block.timestamp > submissionTime) revert SubmissionPeriodNotActive();
        bytes32 submissionHash = keccak256(abi.encodePacked(contestant, submissionText));
        submissionTree.add_submission(contestant, submissionHash, submissionText);
        emit SubmissionCreated(contestant, submissionHash);
        return submissionHash;
    }

    function restartPrize(uint256 _submissionTime) public onlyPlatformAdminOrProposer {
        SubmissionAVLTree.SubmissionInfo[] memory allSubmissions = getAllSubmissions();
        if(block.timestamp > submissionTime && allSubmissions.length == 0) revert("STG0");
        submissionTime = block.timestamp + _submissionTime * 1 minutes;
        submissionPeriod = true;
    }

    function recoverSigner( bytes32 _ethSignedMessageHash, bytes memory _signature) public pure returns (address) {
        (bytes32 r, bytes32 s, uint8 v) = splitSignature(_signature);
        return ecrecover(_ethSignedMessageHash, v, r, s);
    }

    function splitSignature(bytes memory sig) public pure returns(bytes32 r, bytes32 s, uint8 v){
        require(sig.length == 65, "invalid signature length");

        assembly {
            r := mload(add(sig, 32))
            s := mload(add(sig, 64))
            v := byte(0, mload(add(sig, 96)))
        }
    }

    /// @notice create a function to allow funders to vote for a submission
    /// @notice  Update the vote function
    function vote(bytes32 _submissionHash, uint256 amount, bytes memory _signature, bytes32 _ethSignedMessageHash) public {
        if (block.timestamp > votingTime) revert VotingPeriodNotActive();
        address sender =  recoverSigner(_ethSignedMessageHash, _signature);
        if (amount > funderAmount[sender]) revert NotEnoughFunds();

        SubmissionAVLTree.SubmissionInfo memory submissionCheck = submissionTree.getSubmission(_submissionHash);
        /// @notice submission should return a struct with the submissionHash, the contestant, the submissionText, the threshhold, the votes, and the funded status 
        //  -- check if the submission hash is in the tree
        if (submissionCheck.submissionHash != _submissionHash) revert SubmissionDoesntExist();

        if(isUsdcContributor[sender]) {
            funderAmount[sender] -= amount;
            submissionTree.addUsdcVotes(_submissionHash, amount);
            funderVotes[sender][_submissionHash].add(amount);
            totalVotes.add(amount);
            submissionTree.updateFunderBalance(_submissionHash, sender, (funderVotes[sender][_submissionHash] * (100-platformFee))/100);
            SubmissionAVLTree.SubmissionInfo memory submission = submissionTree.getSubmission(_submissionHash);
            if (submission.usdcVotes > 0) {
                submissionTree.setFundedTrue(_submissionHash, true);
            }
        }
        if(!isUsdcContributor[sender]) {
            funderAmount[sender] -= amount;
            submissionTree.addUsdcBridgedVotes(_submissionHash, amount);
            funderVotes[sender][_submissionHash] += amount;
            totalVotes.add(amount);
            submissionTree.updateFunderBalance(_submissionHash, sender, (funderVotes[sender][_submissionHash] * (100-platformFee))/100);
            SubmissionAVLTree.SubmissionInfo memory submission = submissionTree.getSubmission(_submissionHash);
            if (submission.usdcBridgedVotes > 0) {
                submissionTree.setFundedTrue(_submissionHash, true);
            }
        }
        emit Voted(_submissionHash, sender, amount);
    }

    /// @notice Change_votes should now stop folks from being able to change someone elses vote
    function changeVote(bytes32 _previous_submissionHash, bytes32 _new_submissionHash, uint256 amount, bytes memory _signature, bytes32 _ethSignedMessageHash) public {
        if (block.timestamp > votingTime) revert VotingPeriodNotActive();
        address sender = recoverSigner(_ethSignedMessageHash, _signature);
        if (funderVotes[sender][_previous_submissionHash] < amount) revert NotYourVote();
        if(!isFunder[sender]) revert("you are not a funder");
        if(isUsdcContributor[sender]) {
            submissionTree.subUsdcVotes(_previous_submissionHash, amount);
            submissionTree.addUsdcVotes(_new_submissionHash, amount);
            submissionTree.updateFunderBalance(_previous_submissionHash, sender, (funderVotes[sender][_previous_submissionHash]*(100-platformFee))/100);
            submissionTree.updateFunderBalance(_new_submissionHash, sender, (funderVotes[sender][_new_submissionHash]*(100-platformFee))/100);
            funderVotes[sender][_previous_submissionHash] -= amount;
            funderVotes[sender][_new_submissionHash] += amount;

            SubmissionAVLTree.SubmissionInfo memory previousSubmission = submissionTree.getSubmission(_previous_submissionHash);

            if (previousSubmission.usdcVotes <= 0) {
                submissionTree.setFundedTrue(_previous_submissionHash, false);
            }

            SubmissionAVLTree.SubmissionInfo memory newSubmission = submissionTree.getSubmission(_new_submissionHash);

            if (newSubmission.usdcVotes > 0) {
                submissionTree.setFundedTrue(_new_submissionHash, true);
            }
        }
        if(!isUsdcContributor[sender]) {
            submissionTree.subBridgedUsdcVotes(_previous_submissionHash, amount);
            submissionTree.addUsdcBridgedVotes(_new_submissionHash, amount);
            submissionTree.updateFunderBalance(_previous_submissionHash, sender, (funderVotes[sender][_previous_submissionHash]*(100-platformFee))/100);
            submissionTree.updateFunderBalance(_new_submissionHash, sender, (funderVotes[sender][_new_submissionHash]*(100-platformFee))/100);
            funderVotes[sender][_previous_submissionHash] -= amount;
            funderVotes[sender][_new_submissionHash] += amount;

            SubmissionAVLTree.SubmissionInfo memory previousSubmission = submissionTree.getSubmission(_previous_submissionHash);

            if (previousSubmission.usdcBridgedVotes <= 0) {
                submissionTree.setFundedTrue(_previous_submissionHash, false);
            }

            SubmissionAVLTree.SubmissionInfo memory newSubmission = submissionTree.getSubmission(_new_submissionHash);

            if (newSubmission.usdcBridgedVotes > 0) {
                submissionTree.setFundedTrue(_new_submissionHash, true);
            }
        }
    }

    /// @notice uses functionality of the AVL tree to get all submissions
    function getAllSubmissions() public view returns (SubmissionAVLTree.SubmissionInfo[] memory) {
        return submissionTree.inOrderTraversal();
    }

    /// @notice get submission by submissionHash
    function getSubmissionByHash(bytes32 submissionHash) public view returns (SubmissionAVLTree.SubmissionInfo memory){
        SubmissionAVLTree.SubmissionInfo memory submission = submissionTree.getSubmission(submissionHash);
        return submission;
    }

    function addUsdcFunds(address spender, uint256 _amountUsdc, uint256 _deadline, bytes memory _signature, bytes32 _ethSignedMessageHash) public noReentrant payable {
        require(_amountUsdc > 0, "funds should be greater than 0");
        require(_amountUsdc > 0, "funds should be greater than 0");
        (bytes32 r, bytes32 s, uint8 v) = splitSignature(_signature);
        address sender = recoverSigner(_ethSignedMessageHash, _signature);
        _usdc.permit(sender, spender, _amountUsdc, _deadline, v, r, s);
        _usdc.transferFrom(msg.sender, address(this), _amountUsdc);
        if(!isActive) revert("Funding to contract ended");
        uint256 _donation = _amountUsdc;
        isFunder[sender] = true;
        isUsdcContributor[sender] = true;
        funderAmount[sender].add(_donation);
        totalUsdcRewards = totalUsdcRewards.add((_donation.mul(100 - (platformFee + proposerFee))).div(100));
        totalUsdcFunds = totalUsdcFunds.add(_donation);
        totalRewards = totalRewards.add((_donation.mul(100 - (platformFee + proposerFee))).div(100));
        totalFunds = totalFunds.add(_donation);
        allFunders.push(sender);
    }

    function addBridgedUsdcFunds(address spender, uint256 _amountUsdc, uint256 _deadline, bytes32 _ethSignedMessageHash, bytes memory _signature) public noReentrant payable {
        require(_amountUsdc > 0, "funds should be greater than 0");
        (bytes32 r, bytes32 s, uint8 v) = splitSignature(_signature);
        address sender = recoverSigner(_ethSignedMessageHash, _signature);
        _usdcBridged.permit(sender, spender, _amountUsdc, _deadline, v, r, s);
        _usdcBridged.transferFrom(sender, address(this), _amountUsdc);
        if(!isActive) revert("Funding to contract ended");
        uint256 _donation = _amountUsdc;
        isFunder[sender] = true;
        isUsdcContributor[sender] = false;
        funderAmount[sender] = funderAmount[sender].add(_donation);
        totalBridgedUsdcRewards = totalBridgedUsdcRewards.add((_donation.mul(100 - (platformFee + proposerFee))).div(100));
        totalUsdcFunds.add(_donation);
        totalRewards = totalRewards.add((_donation.mul(100 - (platformFee + proposerFee))).div(100));
        totalFunds = totalFunds.add(_donation);
        allFunders.push(sender);
    }

   /// @notice this fn sends the unused votes to the contestant based on their previous votes.
    function distributeUnusedVotes() onlyPlatformAdminOrProposer private returns(uint256, uint256, uint256, uint256)  {
       uint256 total_usdc_votes = 0;
       uint256 total_usdcBridged_votes = 0;

       SubmissionAVLTree.SubmissionInfo[] memory allSubmissions = getAllSubmissions();
       for(uint256 i=0; i<allSubmissions.length; i++) {
           total_usdc_votes += allSubmissions[i].usdcVotes;
           total_usdcBridged_votes += allSubmissions[i].usdcBridgedVotes;
       }
       uint256 total_unused_usdc_votes = totalUsdcRewards.sub(total_usdc_votes);
       uint256 total_unused_usdcBridged_votes = totalBridgedUsdcRewards.sub(total_usdcBridged_votes);

       for(uint256 i=0; i<allSubmissions.length; i++) {
            if(total_unused_usdc_votes > 0) {
                uint256 individual_usdc_percentage = (allSubmissions[i].usdcVotes.mul(100)).div(total_usdc_votes); 
                uint256 transferable_usdc_amount = (total_unused_usdc_votes.mul(individual_usdc_percentage)).div(100);
                _usdc.transfer(allSubmissions[i].contestant, transferable_usdc_amount);
            }
            if(total_unused_usdcBridged_votes > 0) {
                uint256 individual_usdcBridged_percentage = (allSubmissions[i].usdcBridgedVotes.mul(100)).div(total_usdcBridged_votes); 
                uint256 transferable_usdcBridged_amount = (total_unused_usdcBridged_votes.mul(individual_usdcBridged_percentage)).div(100);
                _usdcBridged.transfer(allSubmissions[i].contestant, transferable_usdcBridged_amount);
            }
       }
       return (total_usdc_votes, total_usdcBridged_votes, totalUsdcRewards, totalBridgedUsdcRewards);
   }
    function getAllFunders() public view returns(address[] memory) {
        return allFunders;
   }

   function getAllPlatformAdmins() public view returns(address[] memory) {
        return platformAdmins;
   }
}
