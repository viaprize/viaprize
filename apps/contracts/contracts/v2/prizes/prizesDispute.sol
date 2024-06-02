//SPDX-License-Identifier:MIT
pragma solidity ^0.8.1;

import "./SubmissionLibrary.sol";
import "./SubmissionAVLTree.sol";
import "../../helperContracts/safemath.sol";
import "../../helperContracts/ierc20_permit.sol";                                         
import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";
import "@uniswap/v3-core/contracts/interfaces/IUniswapV3Pool.sol";
import "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";
import "../../helperContracts/ierc20_weth.sol";

contract ViaPrize {
    /// @notice this will be the total amount of funds raised
    uint256 public totalFunds; 
    /// @notice this will be the total amount of rewards available
    uint256 public totalRewards; 
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
    /// @notice this will be a mapping of the addresses of the funders to the amount of usd they have contributed
    mapping (address => uint256) public funderAmount;
    /// @notice this will be a mapping of the addresses of the funders to the amount of usd they have contributed
    mapping (address => uint256) public totalFunderAmount;
    /// @notice array of funders
    address[] public allFunders;
    mapping(address => bool) public isFunder;
    /// @notice Add a new mapping to store each funder's votes on each submission
    mapping(address => mapping(bytes32 => uint256)) public funderVotes;
    /// @notice Add a new mapping to check if a funder has received their refunds
    mapping(address => bool) public receivedFunds;
    /// @notice add a new refund mapping for address to bool
    mapping(address => bool) public addressRefunded;
    /// @notice to keep track the campaign is Alive or not
    mapping(address => uint256) public refundRequested;
    address[] public refundRequestedFunders;
    bytes32 public refundSubmissionHash;
    mapping(address => bool) public isRefundRequestedAddress;

    bool public isActive = false;
    uint8 public constant  VERSION = 2;
    bool private _locked;

    using SafeMath for uint256;

    uint public proposerFee;
    uint public platformFee;

    bool public votingPeriod = false;
    bool public submissionPeriod = false;
        
    address[] public platformAdmins;
    mapping(address => bool) public isPlatformAdmin;

    IERC20Permit private immutable _usdc;
    IERC20Permit private immutable _usdcBridged;
    
    /// @notice minimum slippage fee percentage for minimum output in swap
    uint public minimumSlipageFeePercentage = 2; 

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
    address public immutable platformAddress = 0x1f00DD750aD3A6463F174eD7d63ebE1a7a930d0c;



    /// @notice / @notice _submissionTree contract
    SubmissionAVLTree private _submissionTree;

    uint256 public totalVotes;
    uint256 public disputePeriod;


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
    event Donation(address indexed donator ,address indexed token_or_nft, DonationType  indexed _donationType, TokenType _tokenType, uint256 amount);
    event DisputeRaised(bytes32 indexed _submissionHash, address indexed _contestant);

    constructor(address _proposer, address[] memory _platformAdmins, uint _platFormFee, uint _proposerFee, address _usdcAddress, address _usdcBridgedAddress , address _swapRouter ,address _usdcToUsdcePool,address _usdcToEthPool,address _ethPriceAggregator,address _wethToken) {
        /// @notice add as many proposer addresses as you need to -- replace msg.sender with the address of the proposer(s) for now this means the deployer will be the sole admin

        proposer = _proposer;
        isProposer[proposer] = true;
        for (uint i = 0; i < _platformAdmins.length; i++) {
            platformAdmins.push(_platformAdmins[i]);
            isPlatformAdmin[_platformAdmins[i]] = true;
        }
        /// @notice  Initialize the _submissionTree
        _submissionTree = SubmissionAVLTree(SubmissionLibrary.deploySubmission());
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
        refundSubmissionHash = keccak256(abi.encodePacked(platformAdmins[0], "This is a refund Submission"));
        _submissionTree.addSubmission(platformAdmins[0], refundSubmissionHash, "This is a refund Submission");
        
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
        votingPeriod = false;
        disputePeriod = block.timestamp + 2 days;
    }

    function raiseDispute(bytes32 _submissionHash, uint8 v, bytes32 s, bytes32 r, bytes32 _ethSignedMessageHash) public {
        require(disputePeriod > block.timestamp, "DPNA"); //DPNA - Dispute Period Not Active
        SubmissionAVLTree.SubmissionInfo memory submission = _submissionTree.getSubmission(_submissionHash);
        address sender =  ecrecover(_ethSignedMessageHash, v, r, s);
        require(sender == submission.contestant, "NAS"); //NAS - Not a Submitter
        emit DisputeRaised(_submissionHash, sender);
    }

    function endDispute() public onlyPlatformAdmin {
        require(disputePeriod < block.timestamp, "DPA"); // DPA -> Dispute Period is in Active
        _distributeUnusedVotes();
        _distributeRewards();
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
    function _distributeRewards() private {
        if(distributed == true) revert RewardsAlreadyDistributed();
        SubmissionAVLTree.SubmissionInfo[] memory allSubmissions = getAllSubmissions();
        uint256 usdcPlatformReward;
        uint256 usdcProposerReward;
        if(allSubmissions.length > 0) {
            /// @notice  Count the number of funded submissions and add them to the fundedSubmissions array
            for (uint256 i = 0; i < allSubmissions.length;) {
                if(allSubmissions[i].funded && allSubmissions[i].usdcVotes > 0) {
                    if(allSubmissions[i].submissionHash == refundSubmissionHash) {
                        uint256 reward = allSubmissions[i].usdcVotes;
                        if(reward > 0) {
                            for(uint256 j=0; j<refundRequestedFunders.length; j++) {
                                uint256 reward_amount = refundRequested[refundRequestedFunders[j]];
                                reward -= reward_amount;
                                if(reward_amount > 0) {
                                    _usdc.transfer(refundRequestedFunders[j], reward_amount);
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
                uint256 send_usdc_platform_reward = usdcPlatformReward;
                uint256 send_usdc_proposer_reward = usdcProposerReward;
                _usdc.transfer(platformAddress, send_usdc_platform_reward);
                _usdc.transfer(proposer, send_usdc_proposer_reward);
            }
            distributed = true;
        }
        // refund if no submissions 
        // dispute if no total votes
        if(allSubmissions.length == 0 || allFunders.length == 0 || totalVotes == 0) {
            for(uint256 i=0; i<allFunders.length; i++) {
                _usdc.transfer(allFunders[i], funderAmount[allFunders[i]]);
                funderAmount[allFunders[i]] = 0;
            }
            distributed = true;
        }
    }

    /// @notice addSubmission should return the submissionHash
    function addSubmission(address contestant, string memory submissionText) public onlyPlatformAdmin returns(bytes32) {
        if (block.timestamp > submissionTime) revert SubmissionPeriodNotActive();
        bytes32 submissionHash = keccak256(abi.encodePacked(contestant, submissionText));
        _submissionTree.addSubmission(contestant, submissionHash, submissionText);
        emit SubmissionCreated(contestant, submissionHash);
        return submissionHash;
    }

    

    /// @notice create a function to allow funders to vote for a submission
    /// @notice  Update the vote function
    function vote(bytes32 _submissionHash, uint256 amount, uint8 v, bytes32 s, bytes32 r, bytes32 _ethSignedMessageHash) onlyActive public {
        if (block.timestamp > votingTime) revert VotingPeriodNotActive();
        address sender =  ecrecover(_ethSignedMessageHash, v, r, s);
        if (amount > funderAmount[sender]) revert NotEnoughFunds();

        SubmissionAVLTree.SubmissionInfo memory submissionCheck = _submissionTree.getSubmission(_submissionHash);
        /// @notice submission should return a struct with the submissionHash, the contestant, the submissionText, the threshhold, the votes, and the funded status 
        //  -- check if the submission hash is in the tree
        if (submissionCheck.submissionHash != _submissionHash) revert SubmissionDoesntExist();

        if(_submissionHash == refundSubmissionHash) {
            if(!isRefundRequestedAddress[sender]) {
                refundRequestedFunders.push(sender);
                isRefundRequestedAddress[sender] = true;
            }
            refundRequested[sender] = refundRequested[sender].add((amount * (100 - platformFee - proposerFee)) / 100);
        }
        if(isFunder[sender]) {
            funderAmount[sender] -= amount;
            funderVotes[sender][_submissionHash] = funderVotes[sender][_submissionHash].add(amount);

            uint256 amountToSubmission = (amount * (100 - platformFee - proposerFee)) / 100;

            _submissionTree.addUsdcVotes(_submissionHash, amountToSubmission);
            
            totalVotes = totalVotes.add(amountToSubmission);
            // rename this to somehting not related to funder ( contestant balance)
            SubmissionAVLTree.SubmissionInfo memory submission = _submissionTree.getSubmission(_submissionHash);
            if (submission.usdcVotes > 0) {
                _submissionTree.setFundedTrue(_submissionHash, true);
            }
            emit Voted(_submissionHash, sender, amount);
        }
    }

    function _changeVoteLogic(bytes32 _previousSubmissionHash, bytes32 _newSubmissionHash) private {

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
    function changeVote(bytes32 _previous_submissionHash, bytes32 _new_submissionHash, uint8 v, bytes32 s, bytes32 r, uint256 amount, bytes32 _ethSignedMessageHash) onlyActive public {
        if (block.timestamp > votingTime) revert VotingPeriodNotActive();
        address sender = ecrecover(_ethSignedMessageHash, v, r, s);
        if (funderVotes[sender][_previous_submissionHash] < amount) revert NotYourVote();
        if(!isFunder[sender]) revert("NF");
        uint256 amountToSubmission = (amount * (100 - platformFee - proposerFee)) / 100;
        if(_submissionHash == refundSubmissionHash) {
            if(!isRefundRequestedAddress[sender]) {
                refundRequestedFunders.push(sender);
                isRefundRequestedAddress[sender] = true;
            }
            refundRequested[sender] = refundRequested[sender].add((amount * (100 - platformFee - proposerFee)) / 100);
        }
        _submissionTree.subUsdcVotes(_previous_submissionHash, amountToSubmission);
        _submissionTree.addUsdcVotes(_new_submissionHash, amountToSubmission);
        funderVotes[sender][_previous_submissionHash] -= amount;
        funderVotes[sender][_new_submissionHash] += amount;

        _changeVoteLogic(_previous_submissionHash, _new_submissionHash);

        emit Voted(_new_submissionHash, sender, amount);
        
    }
    function disputeChangeVote( bytes32  _previousSubmissionHash, bytes32 _newSubmissionHash, address[] calldata _funders, uint256[] calldata _amounts) onlyActive onlyPlatformAdmin public {
        require(_funders.length == _amounts.length, "LM"); //LM -> Length Mismatch
        require(disputePeriod > block.timestamp, "DPNA");  //DPNA -> Dispute Period Not Active

        for (uint256 i = 0; i < _funders.length; i++) {
            address funder = _funders[i];
            uint256 amount = _amounts[i];

            require(funderVotes[funder][_previousSubmissionHash] >= amount, "Insufficient votes from funder");
            uint256 amountToSubmission = (amount * (100 - platformFee - proposerFee)) / 100;

            // Deduct votes from the previous submission
            _submissionTree.subUsdcVotes(_previousSubmissionHash, amountToSubmission);
            funderVotes[funder][_previousSubmissionHash] -= amount;

            if(_submissionHash == refundSubmissionHash) {
                if(!isRefundRequestedAddress[sender]) {
                    refundRequestedFunders.push(sender);
                    isRefundRequestedAddress[sender] = true;
                }
                refundRequested[sender] = refundRequested[sender].add((amount * (100 - platformFee - proposerFee)) / 100);
            }

            // Add votes to the new submission
            _submissionTree.addUsdcVotes(_newSubmissionHash, amountToSubmission);
            funderVotes[funder][_newSubmissionHash] += amount;
        }

        _changeVoteLogic(_previousSubmissionHash, _newSubmissionHash);
    }

    /// @notice uses functionality of the AVL tree to get all submissions
    function getAllSubmissions() public view returns (SubmissionAVLTree.SubmissionInfo[] memory) {
        return _submissionTree.inOrderTraversal();
    }

    /// @notice get submission by submissionHash
    function getSubmissionByHash(bytes32 submissionHash) public view returns (SubmissionAVLTree.SubmissionInfo memory){
        SubmissionAVLTree.SubmissionInfo memory submission = _submissionTree.getSubmission(submissionHash);
        return submission;
    }


    function _depositLogic(address sender, uint256 donation) private {
        isFunder[sender] = true;
        funderAmount[sender] = funderAmount[sender].add(donation);
        totalFunderAmount[sender] = totalFunderAmount[sender].add(donation);
        totalRewards = totalRewards.add((donation.mul(100 - (platformFee + proposerFee))).div(100));
        totalFunds = totalFunds.add(donation);
        allFunders.push(sender);
    }

    // todod we dont need sender here

    function addUsdcFunds(address spender, uint256 _amountUsdc, uint256 _deadline, uint8 v, bytes32 s, bytes32 r, bytes32 _ethSignedMessageHash) public onlyActive
     noReentrant payable {
        require(_amountUsdc > 0, "F<0");
        // (uint8 v, bytes32 r, bytes32 s) = ECDSA.tryRecover(_ethSignedMessageHash, _signature);
        address sender = ecrecover(_ethSignedMessageHash, v, r, s);
        _usdc.permit(sender, spender, _amountUsdc, _deadline,v,r,s);
        _usdc.transferFrom(sender, address(this), _amountUsdc);
        _depositLogic(sender, _amountUsdc);
        emit Donation(sender, address(_usdc), DonationType.PAYMENT, TokenType.TOKEN, _amountUsdc);
    }

    function addBridgedUsdcFunds(uint256 _amountUsdc) public onlyActive noReentrant payable {
        require(_amountUsdc > 0, "F<0");
        address sender = msg.sender; 
        _usdcBridged.transferFrom(sender,address(this),_amountUsdc);
        _usdcBridged.approve(address(swapRouter), _amountUsdc);
        ISwapRouter.ExactInputParams memory params =
            ISwapRouter.ExactInputParams({
                path: abi.encodePacked(address(_usdcBridged), bridgedUsdcPool.fee(), address(_usdc)),
                recipient: address(this),
                deadline: block.timestamp,
                amountIn: _amountUsdc,
                amountOutMinimum: _amountUsdc.mul(100-minimumSlipageFeePercentage).div(100)
        });

        uint256 _donation  = swapRouter.exactInput(params);
        _depositLogic(sender, _donation);
        emit Donation(msg.sender, address(_usdcBridged), DonationType.PAYMENT, TokenType.TOKEN, _donation);
    }

    /// @notice function to donate eth into the campaign
    function addEthFunds(uint256 _amountOutMinimum) public onlyActive noReentrant payable  {
        if (msg.value == 0) revert NotEnoughFunds();
        uint256 eth_donation =  msg.value;
        address sender = msg.sender;
        _weth.deposit{value:msg.value}();
        _weth.approve(address(swapRouter), eth_donation);
        ISwapRouter.ExactInputParams memory params =
            ISwapRouter.ExactInputParams({
                path: abi.encodePacked(address(_weth), ethUsdcPool.fee(), address(_usdc)),
                recipient: address(this),
                deadline: block.timestamp,
                amountIn: eth_donation,
                amountOutMinimum: _amountOutMinimum
        });
        uint256 _donation = swapRouter.exactInput(params);
        _depositLogic(sender, _donation);
        emit Donation(msg.sender,address(_weth),DonationType.PAYMENT,TokenType.TOKEN, _donation);

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
    function _distributeUnusedVotes() private returns(uint256,uint256)  {
       uint256 total_usdc_votes = 0;

       SubmissionAVLTree.SubmissionInfo[] memory allSubmissions = getAllSubmissions();
       for(uint256 i=0; i<allSubmissions.length; i++) {
           total_usdc_votes += allSubmissions[i].usdcVotes;
       }
       uint256 total_unused_usdc_votes = totalRewards.sub(total_usdc_votes);
    

       for(uint256 i=0; i<allSubmissions.length; i++) {
            if(total_unused_usdc_votes > 0) {
                uint256 individual_usdc_percentage = (allSubmissions[i].usdcVotes.mul(100)).div(total_usdc_votes); 
                uint256 transferable_usdc_amount = (total_unused_usdc_votes.mul(individual_usdc_percentage)).div(100);
                if(allSubmissions[i].submissionHash == refundSubmissionHash) {
                    if(transferable_usdc_amount > 0) {
                        uint256 refundTotalVotes = allSubmissions[i].usdcVotes;
                        for(uint256 j=0; j<refundRequestedFunders.length; j++) {
                            uint256 individual_usdc_percentage = refundRequested[refundRequestedFunders[j]].mul(100).div(refundTotalVotes);
                            uint256 individual_transferable_usdc_amount = (transferable_usdc_amount.mul(individual_usdc_percentage).div(100));
                            _usdc.transfer(refundRequestedFunders[j], individual_transferable_usdc_amount);
                        }
                    }
                } else {
                    _usdc.transfer(allSubmissions[i].contestant, transferable_usdc_amount);
                }
            }
           
       }
       return (total_usdc_votes, totalRewards);
   }

   function getAllFunders() public view returns(address[] memory) {
        return allFunders;
   }

   function getAllPlatformAdmins() public view returns(address[] memory) {
        return platformAdmins;
   }

    /// @notice function to change slippage tolerance of other token donations
    /// @param _minimumSlipageFeePercentage of new minimumSlipageFeePercentage
    function changeMinimumSlipageFeePercentage(uint256 _minimumSlipageFeePercentage) public onlyPlatformAdmin {
        minimumSlipageFeePercentage  = _minimumSlipageFeePercentage;
    } 
}