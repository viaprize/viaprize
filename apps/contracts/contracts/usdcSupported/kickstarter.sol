//SPDX-License-Identifier:MIT

pragma solidity ^0.8.0;

// import "@openzeppelin/contracts/utils/math/SafeMath.sol";
// import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../helperContracts/safemath.sol";
import "../helperContracts/ierc20.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";


contract Kickstarter {

    address[] public proposers;
    mapping(address => bool) public isProposer;
    address[] public admins;
    mapping(address => bool) public isAdmin;
    address public receiverAddress;
    uint256 public goalAmount = 0;
    uint256 public deadline = 0;
    uint256 public platformFee;
    address public platformAddress;
    address[] public patrons; 
    mapping(address => bool) public isPatron;
    mapping(address => uint256) public patronAmount;
    mapping(address => uint256) public refundPatronsAmount;
    uint256 public totalEthFunds;
    uint256 public totalEthRewards;
    uint256 public totalUsdcFunds;
    uint256 public totalUsdcRewards;
    uint256 public totalRewards;
    uint256 totalFunds;
    bool public allowDonationAboveGoalAmount;
    bool public isActive;
    bool internal locked;
    IERC20 private _usdc;
    mapping(address => bool) public isEtherContributor;
    AggregatorV3Interface internal priceFeed;


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
        platformAddress = 0x1f00DD750aD3A6463F174eD7d63ebE1a7a930d0c;
        _usdc = IERC20(0xFd4fF6863A9069cFdc006524432ce661866C5D97);
        priceFeed = AggregatorV3Interface(0x9326BFA02ADD2366b30bacB125260Af641031331);
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

    // function getLatestPrice() public view returns (int) {
    //     (
    //         uint80 roundID, 
    //         int price,
    //         uint startedAt,
    //         uint timeStamp,
    //         uint80 answeredInRound
    //     ) = priceFeed.latestRoundData();
    //     return price;
    // }

    function addEthFunds() public noReentrant payable returns(uint256, uint256, uint256, bool, bool, bool) {
        if(msg.value == 0) revert NotEnoughFunds();
        if(!isActive) revert FundingToContractEnded();
        patrons.push(msg.sender);
        isPatron[msg.sender] = true;
        isEtherContributor[msg.sender] = true;
        patronAmount[msg.sender] = patronAmount[msg.sender].add(msg.value);
        totalEthRewards = (totalEthRewards.add((msg.value.mul(100 - platformFee)).div(100))).mul(uint256(2500));
        totalEthFunds = (totalEthFunds.add(msg.value)).mul(uint256(2500));
        totalRewards = (totalRewards.add((msg.value.mul(100 - platformFee)).div(100))).mul(uint256(2500));
        totalFunds = (totalFunds.add(msg.value)).mul(uint256(2500));


        bool goalAmountAvailable = goalAmount > 0;
        bool deadlineAvailable = deadline > 0;
        bool metDeadline = deadlineAvailable && deadline <= block.timestamp;
        bool metGoal = totalRewards >= goalAmount;

        if(allowDonationAboveGoalAmount) {
            if (metDeadline && metGoal) {
                uint256 totalethrewards = totalEthRewards;
                uint256 adminethrewards = totalEthFunds.sub(totalEthRewards);
                uint256 totalusdcrewards = totalUsdcRewards;
                uint256 adminusdcrewards = totalUsdcFunds.sub(totalUsdcRewards);
                totalEthRewards = 0;
                totalEthFunds = 0;
                totalUsdcRewards = 0;
                totalUsdcFunds = 0;
                payable(receiverAddress).transfer(totalethrewards);
                payable(platformAddress).transfer(adminethrewards);
                _usdc.transfer(receiverAddress, totalusdcrewards);
                _usdc.transfer(platformAddress, adminusdcrewards);
                isActive = false;
            }
            if(metDeadline && !metGoal) {
                for(uint i=0; i<patrons.length; i++) {
                    uint transferableAmount = patronAmount[patrons[i]];
                    patronAmount[patrons[i]] = 0;
                    if(isEtherContributor[patrons[i]]) {
                        payable(patrons[i]).transfer(transferableAmount);
                    } else {
                        _usdc.transfer(patrons[i], transferableAmount);
                    }
                }
                isActive = false;
            }
        }

        if(!allowDonationAboveGoalAmount) {
            if(metGoal) {
                // uint256 moneyToPlatform = (goalAmount.mul(platformFee)).div(uint256(100).sub(platformFee));
                // uint256 excessRewards = totalFunds.sub(goalAmount.add(moneyToPlatform));
                uint256 excessEthAmount;
                if(msg.value.add(totalEthRewards.add(totalUsdcRewards)) > goalAmount) {
                    excessEthAmount = goalAmount.sub(msg.value.add(totalEthRewards.add(totalUsdcRewards)));
                    totalEthRewards.sub(excessEthAmount);
                    uint256 ethMoneyToPlatform = (totalEthRewards.mul(platformFee)).div(uint256(100).sub(platformFee));
                    payable(platformAddress).transfer(ethMoneyToPlatform);
                    payable(receiverAddress).transfer(totalEthRewards);
                    totalEthRewards = 0;
                    ethMoneyToPlatform = 0;
                    uint256 usdcMoneyToPlatform = (totalUsdcRewards.mul(platformFee)).div(uint256(100).sub(platformFee));
                    _usdc.transfer(platformAddress, usdcMoneyToPlatform);
                    _usdc.transfer(receiverAddress, totalUsdcRewards);
                    totalUsdcRewards = 0;
                    usdcMoneyToPlatform = 0;
                }
                if(msg.value.add(totalEthRewards.add(totalUsdcRewards)) == goalAmount){
                    uint256 ethMoneyToPlatform = (totalEthRewards.mul(platformFee)).div(uint256(100).sub(platformFee));
                    payable(platformAddress).transfer(ethMoneyToPlatform);
                    payable(receiverAddress).transfer(totalEthRewards);
                    totalEthRewards = 0;
                    ethMoneyToPlatform = 0;
                    uint256 usdcMoneyToPlatform = (totalUsdcRewards.mul(platformFee)).div(uint256(100).sub(platformFee));
                    _usdc.transfer(platformAddress, usdcMoneyToPlatform);
                    _usdc.transfer(receiverAddress, totalUsdcRewards);
                    totalUsdcRewards = 0;
                    usdcMoneyToPlatform = 0;
                }
                // payable(receiverAddress).transfer(goalAmount);
                // payable(platformAddress).transfer(moneyToPlatform);
                // if(excessRewards > 0) {
                //     payable(msg.sender).transfer(excessRewards);
                // }
                isActive = false;
            }
            if(metDeadline && !metGoal) {
                for(uint i=0; i<patrons.length; i++) {
                    uint transferableAmount = patronAmount[patrons[i]];
                    patronAmount[patrons[i]] = 0;
                    if(isEtherContributor[patrons[i]]) {
                        payable(patrons[i]).transfer(transferableAmount);
                    } else {
                        _usdc.transfer(patrons[i], transferableAmount);
                    }
                }
                isActive = false;
            }
        }    
        emit Values(
            receiverAddress, 
            totalEthFunds, 
            totalEthRewards, 
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
            totalEthRewards,
            totalEthRewards >= goalAmount,
            deadlineAvailable,
            goalAmountAvailable
        );
    }

    function addUsdcFunds(uint256 _amountUsdc) public noReentrant payable returns(uint256, uint256, uint256, bool, bool, bool) {
        require(_amountUsdc > 0, "funds should be greater than 0");
        require(_usdc.allowance(msg.sender, address(this)) >= _amountUsdc, "Not enough USDC approved");
        _usdc.transferFrom(msg.sender, address(this), _amountUsdc);
        if(!isActive) revert FundingToContractEnded();
        uint256 _donation = _amountUsdc;
        patrons.push(msg.sender);
        isPatron[msg.sender] = true;
        isEtherContributor[msg.sender] = false;
        patronAmount[msg.sender] = patronAmount[msg.sender].add(_donation);
        totalUsdcRewards = totalUsdcRewards.add((_donation.mul(100 - platformFee)).div(100));
        totalUsdcFunds = totalUsdcFunds.add(_donation);

        bool goalAmountAvailable = goalAmount > 0;
        bool deadlineAvailable = deadline > 0;
        bool metDeadline = deadlineAvailable && deadline <= block.timestamp;
        bool metGoal = totalUsdcRewards >= goalAmount;

        if(allowDonationAboveGoalAmount) {
            if (metDeadline && metGoal) {
                uint256 totalethrewards = totalEthRewards;
                uint256 adminethrewards = totalEthFunds.sub(totalEthRewards);
                uint256 totalusdcrewards = totalUsdcRewards;
                uint256 adminusdcrewards = totalUsdcFunds.sub(totalUsdcRewards);
                totalEthRewards = 0;
                totalEthFunds = 0;
                totalUsdcRewards = 0;
                totalUsdcFunds = 0;
                payable(receiverAddress).transfer(totalethrewards);
                payable(platformAddress).transfer(adminethrewards);
                _usdc.transfer(receiverAddress, totalusdcrewards);
                _usdc.transfer(platformAddress, adminusdcrewards);
                isActive = false;
            }
            if(metDeadline && !metGoal) {
                for(uint i=0; i<patrons.length; i++) {
                    uint transferableAmount = patronAmount[patrons[i]];
                    patronAmount[patrons[i]] = 0;
                    if(isEtherContributor[patrons[i]]) {
                        payable(patrons[i]).transfer(transferableAmount);
                    } else {
                        _usdc.transfer(patrons[i], transferableAmount);
                    }
                }
                isActive = false;
            }
        }

        if(!allowDonationAboveGoalAmount) {
            if(metGoal) {
                // uint256 moneyToPlatform = (goalAmount.mul(platformFee)).div(uint256(100).sub(platformFee));
                // uint256 excessRewards = totalUsdcFunds.sub(goalAmount.add(moneyToPlatform));
                // payable(receiverAddress).transfer(goalAmount);
                // payable(platformAddress).transfer(moneyToPlatform);
                // if(excessRewards > 0) {
                //     _usdc.transfer(msg.sender, excessRewards);
                // }
                uint256 excessUsdcAmount;
                if(msg.value.add(totalEthRewards.add(totalUsdcRewards)) > goalAmount) {
                    excessUsdcAmount = goalAmount.sub(msg.value.add(totalEthRewards.add(totalUsdcRewards)));
                    totalUsdcRewards.sub(excessUsdcAmount);
                    uint256 ethMoneyToPlatform = (totalEthRewards.mul(platformFee)).div(uint256(100).sub(platformFee));
                    payable(platformAddress).transfer(ethMoneyToPlatform);
                    payable(receiverAddress).transfer(totalEthRewards);
                    totalEthRewards = 0;
                    ethMoneyToPlatform = 0;
                    uint256 usdcMoneyToPlatform = (totalUsdcRewards.mul(platformFee)).div(uint256(100).sub(platformFee));
                    _usdc.transfer(platformAddress, usdcMoneyToPlatform);
                    _usdc.transfer(receiverAddress, totalUsdcRewards);
                    totalUsdcRewards = 0;
                    usdcMoneyToPlatform = 0;
                }
                if(msg.value.add(totalEthRewards.add(totalUsdcRewards)) == goalAmount){
                    uint256 ethMoneyToPlatform = (totalEthRewards.mul(platformFee)).div(uint256(100).sub(platformFee));
                    payable(platformAddress).transfer(ethMoneyToPlatform);
                    payable(receiverAddress).transfer(totalEthRewards);
                    totalEthRewards = 0;
                    ethMoneyToPlatform = 0;
                    uint256 usdcMoneyToPlatform = (totalUsdcRewards.mul(platformFee)).div(uint256(100).sub(platformFee));
                    _usdc.transfer(platformAddress, usdcMoneyToPlatform);
                    _usdc.transfer(receiverAddress, totalUsdcRewards);
                    totalUsdcRewards = 0;
                    usdcMoneyToPlatform = 0;
                }
                isActive = false;
            }
            if(metDeadline && !metGoal) {
                for(uint i=0; i<patrons.length; i++) {
                    uint transferableAmount = patronAmount[patrons[i]];
                    patronAmount[patrons[i]] = 0;
                    if(isEtherContributor[patrons[i]]) {
                        payable(patrons[i]).transfer(transferableAmount);
                    } else {
                        _usdc.transfer(patrons[i], transferableAmount);
                    }
                }
                isActive = false;
            }
        }
        emit Values(
            receiverAddress, 
            totalUsdcFunds, 
            totalUsdcRewards, 
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
            totalUsdcRewards,
            totalUsdcRewards >= goalAmount,
            deadlineAvailable,
            goalAmountAvailable
        );
    }

    receive() external noReentrant payable {
        addEthFunds();
    }

    function endEarlyandRefund() public noReentrant onlyProposerOrAdmin {
        if(!isActive) revert("campaign is not active");
        if(patrons.length > 0) {
            for(uint256 i=0; i<patrons.length; i++) {
                uint256 transferableAmount = patronAmount[patrons[i]];
                patronAmount[patrons[i]] = 0;
                if(isEtherContributor[patrons[i]]) {
                    payable(patrons[i]).transfer(transferableAmount);
                } else {
                    _usdc.transfer(patrons[i], transferableAmount);
                }
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
                uint256 totalethrewards = totalEthRewards;
                uint256 adminethrewards = totalEthFunds.sub(totalEthRewards);
                uint256 totalusdcrewards = totalUsdcRewards;
                uint256 adminusdcrewards = totalUsdcFunds.sub(totalUsdcRewards);
                totalEthRewards = 0;
                totalEthFunds = 0;
                totalUsdcRewards = 0;
                totalUsdcFunds = 0;
                payable(receiverAddress).transfer(totalethrewards);
                payable(platformAddress).transfer(adminethrewards);
                _usdc.transfer(receiverAddress, totalusdcrewards);
                _usdc.transfer(platformAddress, adminusdcrewards);
                isActive = false;
            }
            if(metDeadline && !metGoal) {
                for(uint i=0; i<patrons.length; i++) {
                    uint transferableAmount = patronAmount[patrons[i]];
                    patronAmount[patrons[i]] = 0;
                    if(isEtherContributor[patrons[i]]) {
                        payable(patrons[i]).transfer(transferableAmount);
                    } else {
                        _usdc.transfer(patrons[i], transferableAmount);
                    }
                }
                isActive = false;
            }
        }
        if(!allowDonationAboveGoalAmount) {
            if(metGoal) {
                // uint256 totalrewards = totalRewards;
                // uint256 adminrewards = totalFunds.sub(totalRewards);
                // totalRewards = 0;
                // totalFunds = 0;
                // payable(receiverAddress).transfer(totalrewards);
                // payable(platformAddress).transfer(adminrewards);
                uint256 totalethrewards = totalEthRewards;
                uint256 adminethrewards = totalEthFunds.sub(totalEthRewards);
                uint256 totalusdcrewards = totalUsdcRewards;
                uint256 adminusdcrewards = totalUsdcFunds.sub(totalUsdcRewards);
                totalEthRewards = 0;
                totalEthFunds = 0;
                totalUsdcRewards = 0;
                totalUsdcFunds = 0;
                payable(receiverAddress).transfer(totalethrewards);
                payable(platformAddress).transfer(adminethrewards);
                _usdc.transfer(receiverAddress, totalusdcrewards);
                _usdc.transfer(platformAddress, adminusdcrewards);
                isActive = false;
            }
            if(metDeadline && !metGoal) {
                for(uint i=0; i<patrons.length; i++) {
                    uint transferableAmount = patronAmount[patrons[i]];
                    patronAmount[patrons[i]] = 0;
                    if(isEtherContributor[patrons[i]]) {
                        payable(patrons[i]).transfer(transferableAmount);
                    } else {
                        _usdc.transfer(patrons[i], transferableAmount);
                    }
                }
                isActive = false; 
            }
        }
    }
}