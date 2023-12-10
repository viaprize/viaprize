// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

contract portal {
    address[] public treasurer;
    mapping(address => bool) public isTreasurer; 
    address public receiverAddress;
    uint256 public goalAmount = 0;
    uint256 public deadline = 0;
    uint256 public platformFee;
    address public platformAddress = 0xdD870fA1b7C4700F2BD7f44238821C26f7392148;
    address[] public patrons; 
    mapping(address => uint256) public patronAmount;
    uint256 public totalFunds;
    uint256 public totalRewards;
    bool allowDonationAboveGoalAmount;
    bool isActive;
    bool allowImmediately;

    uint256 deadline1;
    

    error NotEnoughFunds();
    error FundingToContractEnded();
    error oneError();
    error twoError();
    error threeError(); 
    error AllowImmediatelyCantBeTrue();

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
        address[] memory _treasurer,
        uint256 _goal,
        uint256 _deadline,
        bool _allowDonationAboveGoalAmount,
        uint256 _platformFee,
        bool _allowImmediately
    ) {
        for (uint256 i = 0; i < _treasurer.length; i++) {
            treasurer.push(_treasurer[i]);
            isTreasurer[_treasurer[i]] = true;
        }
        receiverAddress = treasurer[0];
        platformFee = _platformFee;
        allowImmediately = _allowImmediately;

        goalAmount = _goal;
        deadline = block.timestamp + _deadline * 86400;
        deadline1 = _deadline;
        allowDonationAboveGoalAmount = _allowDonationAboveGoalAmount;
        isActive = true;

        if((!allowImmediately) && goalAmount == 0 && deadline1 == 0 ) revert AllowImmediatelyCantBeTrue();
    }

    function addFunds() public payable returns (uint256, uint256, uint256, bool, bool, bool)
    {
        if (msg.value == 0) revert NotEnoughFunds();
        if (!isActive) revert FundingToContractEnded();

        patronAmount[msg.sender] += msg.value;
        totalFunds += msg.value;
        totalRewards += (msg.value * (100 - platformFee)) / 100;

        bool goalAmountAvailable = goalAmount > 0;
        bool deadlineAvailable = deadline1 > 0;
        bool metDeadline = deadlineAvailable && deadline <= block.timestamp;
        bool metGoal = totalRewards >= goalAmount;

        if (!goalAmountAvailable && !deadlineAvailable) {
            payable(receiverAddress).transfer(
            (msg.value * (100 - platformFee)) / 100
            );
            payable(platformAddress).transfer(
                (msg.value * (platformFee)) / 100
            );
        }

        if (goalAmountAvailable && deadlineAvailable) {
            if(allowImmediately) {
                payable(receiverAddress).transfer(
                (msg.value * (100 - platformFee)) / 100
                );
                payable(platformAddress).transfer(
                    (msg.value * (platformFee)) / 100
                );
            }
            if(!allowImmediately) {
                if (metDeadline ||(!allowDonationAboveGoalAmount && totalRewards >= goalAmount)) {
                    payable(receiverAddress).transfer(totalRewards);
                    payable(platformAddress).transfer(totalFunds - totalRewards);
                    isActive = false;
                }
            }
        }

        if (goalAmountAvailable && !deadlineAvailable) {
            if (allowImmediately && metGoal) {
                payable(receiverAddress).transfer(
                (msg.value * (100 - platformFee)) / 100
                );
                payable(platformAddress).transfer(
                    (msg.value * (platformFee)) / 100
                );
                isActive = false;
                allowImmediately = false;
            }
            if(allowImmediately) {
                payable(receiverAddress).transfer(
                (msg.value * (100 - platformFee)) / 100
                );
                payable(platformAddress).transfer(
                    (msg.value * (platformFee)) / 100
                );
            }
        }
        if (!goalAmountAvailable && deadlineAvailable) {
            if (allowImmediately && metDeadline) {
                payable(receiverAddress).transfer(
                (msg.value * (100 - platformFee)) / 100
                );
                payable(platformAddress).transfer(
                    (msg.value * (platformFee)) / 100
                );
                isActive = false;
                allowImmediately = false;
            }
            if(allowImmediately) {
                payable(receiverAddress).transfer(
                (msg.value * (100 - platformFee)) / 100
                );
                payable(platformAddress).transfer(
                    (msg.value * (platformFee)) / 100
                );
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

    receive() external payable {
        addFunds();
    }

    function closeCampaign() public {
        require(isTreasurer[msg.sender] == true, "you are not an owner to close the campaign");
        isActive = false;
    }

    // function withdrawAmount() public {
    //     require(isTreasurer[msg.sender] == true, "you are not an owner to close the campaign");
    //     payable(receiverAddress).transfer(totalRewards);
    //     payable(platformAddress).transfer(totalFunds - totalRewards);
    //     totalRewards = 0;
    //     totalFunds = 0;

    // }

    // // function refundAmount
}
