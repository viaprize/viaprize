//SPDX-License-Identifier:MIT

pragma solidity 0.8.19;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract Kickstarter {

    address[] public proposers;
    mapping(address => bool) public isProposer;
    address[] public admins;
    mapping(address => bool) public isAdmin;
    address public receiverAddress;
    uint256 public goalAmount = 0;
    uint256 public deadline = 0;
    uint256 public platformFee;
    address public platformAddress = 0x1f00DD750aD3A6463F174eD7d63ebE1a7a930d0c;
    address[] public patrons; 
    mapping(address => bool) public isPatron;
    mapping(address => uint256) public patronAmount;
    mapping(address => uint256) public refundPatronsAmount;
    uint256 public totalFunds;
    uint256 public totalRewards;
    bool public allowDonationAboveGoalAmount;
    bool public isActive;
    bool internal locked;

    

    error NotEnoughFunds();
    error FundingToContractEnded();
    error RequireGoalAndDeadline();
    error GoalAndDeadlineNotRequired();
    error CantEndKickstarterTypeCampaign();
    error GoalAndDeadlineAlreadyMet();
    error CantGetRefundForGoFundMeTypeCampaign();
    error DeadlineNotMet();

    using SafeMath for uint256;

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

    constructor(
        address[] memory _proposers,
        address[] memory _admins,
        uint256 _goal,
        uint256 _deadline,
        bool _allowDonationAboveGoalAmount,
        uint256 _platformFee
    ) {
        if(_goal == 0 || _deadline == 0) revert RequireGoalAndDeadline();

        for(uint256 i=0; i<_proposers.length; i++) {
            proposers.push(_proposers[i]);
            isProposer[_proposers[i]] = true;
        }
        proposers.push(msg.sender);

        for(uint256 i=0; i<_admins.length; i++) {
            admins.push(_admins[i]);
            isAdmin[_admins[i]] = true;
        }

        receiverAddress = proposers[0];
        platformFee = _platformFee;
        goalAmount = _goal;
        deadline = _deadline;
        allowDonationAboveGoalAmount = _allowDonationAboveGoalAmount;
        isActive = true;
    }

    modifier noReentrant() {
        require(!locked, "No re-rentrancy");
        locked = true;
        _;
        locked = false;
    }

    modifier onlyProposerOrAdmin {
        require(isProposer[msg.sender] == true || isAdmin[msg.sender] == true, "You are not a proposer or admin.");
        _;
    }

    function addFunds() public noReentrant payable returns(uint256, uint256, uint256, bool, bool, bool) {
        if(msg.value == 0) revert NotEnoughFunds();
        if(!isActive) revert FundingToContractEnded();
        patrons.push(msg.sender);
        isPatron[msg.sender] = true;
        patronAmount[msg.sender] = patronAmount[msg.sender].add(msg.value);
       totalRewards = totalRewards.add((msg.value.mul(100 - platformFee)).div(100));
       totalFunds = totalFunds.add(msg.value);

        bool goalAmountAvailable = goalAmount > 0;
        bool deadlineAvailable = deadline > 0;
        bool metDeadline = deadlineAvailable && deadline <= block.timestamp;
        bool metGoal = totalRewards >= goalAmount;

        if(allowDonationAboveGoalAmount) {
            if (metDeadline && metGoal) {
                uint256 totalrewards = totalRewards;
                uint256 adminrewards = totalFunds.sub(totalRewards);
                totalRewards = 0;
                totalFunds = 0;
                payable(receiverAddress).transfer(totalrewards);
                payable(platformAddress).transfer(adminrewards);
                isActive = false;
            }
            if(metDeadline && !metGoal) {
                for(uint i=0; i<patrons.length; i++) {
                    uint transferableAmount = patronAmount[patrons[i]];
                    patronAmount[patrons[i]] = 0;
                    payable(patrons[i]).transfer(transferableAmount);
                }
                isActive = false;
            }
        }

        if(!allowDonationAboveGoalAmount) {
            if(metGoal) {
                uint256 moneyToPlatform = (goalAmount.mul(platformFee)).div(uint256(100).sub(platformFee));
                uint256 excessRewards = totalFunds.sub(goalAmount.add(moneyToPlatform));
                payable(receiverAddress).transfer(goalAmount);
                payable(platformAddress).transfer(moneyToPlatform);
                if(excessRewards > 0) {
                    payable(msg.sender).transfer(excessRewards);
                }
                isActive = false;
            }
            if(metDeadline && !metGoal) {
                for(uint i=0; i<patrons.length; i++) {
                    uint transferableAmount = patronAmount[patrons[i]];
                    patronAmount[patrons[i]] = 0;
                    payable(patrons[i]).transfer(transferableAmount);
                }
                isActive = false;
            }
        }    
        emit Values(
            receiverAddress, 
            totalFunds, 
            totalRewards, 
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
            totalRewards,
            totalRewards >= goalAmount,
            deadlineAvailable,
            goalAmountAvailable
        );
    }

    receive() external noReentrant payable {
        addFunds();
    }

    function endEarlyandRefund() public noReentrant onlyProposerOrAdmin {
        if(!isActive) revert("campaign is not active");
        if(patrons.length > 0) {
            for(uint256 i=0; i<patrons.length; i++) {
                uint256 transferableAmount = patronAmount[patrons[i]];
                patronAmount[patrons[i]] = 0;
                payable(patrons[i]).transfer(transferableAmount);
            }
            isActive = false;
        }
        isActive = false;
    }

    function endKickStarterCampaign() public noReentrant onlyProposerOrAdmin {
        if(!isActive) revert("campaign is not active");
        bool deadlineAvailable = deadline > 0;
        bool metDeadline = deadlineAvailable && deadline <= block.timestamp;
        bool metGoal = totalRewards >= goalAmount;

        if(allowDonationAboveGoalAmount) {
            if (metDeadline && metGoal) {
                uint256 totalrewards = totalRewards;
                uint256 adminrewards = totalFunds.sub(totalRewards);
                totalRewards = 0;
                totalFunds = 0;
                payable(receiverAddress).transfer(totalrewards);
                payable(platformAddress).transfer(adminrewards);
                isActive = false;
            }
            if(metDeadline && !metGoal) {
                for(uint i=0; i<patrons.length; i++) {
                    uint transferableAmount = patronAmount[patrons[i]];
                    patronAmount[patrons[i]] = 0;
                    payable(patrons[i]).transfer(transferableAmount);
                }
                isActive = false;
            }
        }
        if(!allowDonationAboveGoalAmount) {
            if(metGoal) {
                uint256 totalrewards = totalRewards;
                uint256 adminrewards = totalFunds.sub(totalRewards);
                totalRewards = 0;
                totalFunds = 0;
                payable(receiverAddress).transfer(totalrewards);
                payable(platformAddress).transfer(adminrewards);
                isActive = false;
            }
            if(metDeadline && !metGoal) {
                for(uint i=0; i<patrons.length; i++) {
                    uint transferableAmount = patronAmount[patrons[i]];
                    patronAmount[patrons[i]] = 0;
                    payable(patrons[i]).transfer(transferableAmount);
                }
                isActive = false;
            }
        }
    }
}