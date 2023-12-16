// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

contract Portal {
    address[] public proposer;
    mapping(address => bool) public isProposers; 
    address public receiverAddress;
    uint256 public goalAmount = 0;
    uint256 public deadline = 0;
    uint256 public platformFee;
    address public platformAddress = 0x1f00DD750aD3A6463F174eD7d63ebE1a7a930d0c;
    address[] public patrons; 
    mapping(address => bool) public isPatron;
    mapping(address => uint256) public patronAmount;
    uint256 public totalFunds;
    uint256 public totalRewards;
    bool public allowDonationAboveGoalAmount;
    bool public isActive;
    bool public  allowImmediately;
    // uint256 deadline1 = 0;
    
    

    error NotEnoughFunds();
    error FundingToContractEnded();
    error RequireGoalAndDeadline();
    error CantEndKickstarterTypeCampaign();
    error GoalAndDeadlineAlreadyMet();
    error CantGetRefundForGoFundMeTypeCampaign();

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
        address[] memory _proposer,
        uint256 _goal,
        uint256 _deadline,
        bool _allowDonationAboveGoalAmount,
        uint256 _platformFee,
        bool _allowImmediately
    ) {

        if((!_allowImmediately) && (_goal == 0 && _deadline == 0)) revert RequireGoalAndDeadline();
        // require((_allowImmediately) && (_goal == 0 || _deadline == 0), "required goal and deadline");

        for (uint256 i = 0; i < _proposer.length; i++) {
            proposer.push(_proposer[i]);
            isProposers[_proposer[i]] = true;
        }
        receiverAddress = proposer[0];
        platformFee = _platformFee;
        allowImmediately = _allowImmediately;

        goalAmount = _goal;
        deadline = _deadline;
        // deadline1 = _deadline;
        allowDonationAboveGoalAmount = _allowDonationAboveGoalAmount;
        isActive = true;

    }

    function addFunds() public payable returns (uint256, uint256, uint256, bool, bool, bool)
    {
        if (msg.value == 0) revert NotEnoughFunds();
        if (!isActive) revert FundingToContractEnded();

        patronAmount[msg.sender] += msg.value;
        isPatron[msg.sender] = true;
        totalFunds += msg.value;
        totalRewards += (msg.value * (100 - platformFee)) / 100;

        bool goalAmountAvailable = goalAmount > 0;
        bool deadlineAvailable = deadline > 0;
        bool metDeadline = deadlineAvailable && deadline <= block.timestamp;
        bool metGoal = totalRewards >= goalAmount;

        if (allowImmediately) {
            payable(receiverAddress).transfer(
            (msg.value * (100 - platformFee)) / 100
            );
            payable(platformAddress).transfer(
                (msg.value * (platformFee)) / 100
            );

        }

        if (goalAmountAvailable && deadlineAvailable) {
            // if(allowImmediately) {
            //     payable(receiverAddress).transfer(
            //     (msg.value * (100 - platformFee)) / 100
            //     );
            //     payable(platformAddress).transfer(
            //         (msg.value * (platformFee)) / 100
            //     );
            // }
            if(!allowImmediately) {
                if (metDeadline ||(!allowDonationAboveGoalAmount && totalRewards >= goalAmount)) {
                    payable(receiverAddress).transfer(totalRewards);
                    payable(platformAddress).transfer(totalFunds - totalRewards);
                    isActive = false;
                }
            }
        }

        // if (goalAmountAvailable && !deadlineAvailable) {
        //     if (allowImmediately && metGoal) {
        //         payable(receiverAddress).transfer(
        //         (msg.value * (100 - platformFee)) / 100
        //         );
        //         payable(platformAddress).transfer(
        //             (msg.value * (platformFee)) / 100
        //         );
        //         isActive = false;
        //         allowImmediately = false;
        //     }
        //     if(allowImmediately) {
        //         payable(receiverAddress).transfer(
        //         (msg.value * (100 - platformFee)) / 100
        //         );
        //         payable(platformAddress).transfer(
        //             (msg.value * (platformFee)) / 100
        //         );
        //     }
        // }
        // if (!goalAmountAvailable && deadlineAvailable) {
        //     if (allowImmediately && metDeadline) {
        //         payable(receiverAddress).transfer(
        //         (msg.value * (100 - platformFee)) / 100
        //         );
        //         payable(platformAddress).transfer(
        //             (msg.value * (platformFee)) / 100
        //         );
        //         isActive = false;
        //         allowImmediately = false;
        //     }
        //     if(allowImmediately) {
        //         payable(receiverAddress).transfer(
        //         (msg.value * (100 - platformFee)) / 100
        //         );
        //         payable(platformAddress).transfer(
        //             (msg.value * (platformFee)) / 100
        //         );
        //     }
           
        // }

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

    receive() external payable {
        addFunds();
    }

    function endCampaign() public {
        require(isProposers[msg.sender] == true, "you are not an owner to close the campaign");
        if(!allowImmediately) revert CantEndKickstarterTypeCampaign();
        isActive = false;
    }

    function patronRefund() public {
        require(isPatron[msg.sender] == true, "only patrons can claim refund");
        if(allowImmediately) revert CantGetRefundForGoFundMeTypeCampaign();
        bool deadlineAvailable = deadline > 0;
        bool metDeadline = deadlineAvailable && deadline <= block.timestamp;
        bool metGoal = totalRewards >= goalAmount;
        if(metDeadline && metGoal) revert GoalAndDeadlineAlreadyMet();

        for(uint i=0; i<patrons.length; i++) {
            uint transferableAmount = patronAmount[patrons[i]];
            payable(patrons[i]).transfer(transferableAmount);
            patronAmount[patrons[i]] = 0;
        }
        isActive = false;
    }

}
