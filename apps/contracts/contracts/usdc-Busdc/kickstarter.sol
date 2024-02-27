//SPDX-License-Identifier:MIT

pragma solidity ^0.8.0;

import "../helperContracts/ierc20.sol";
import "../helperContracts/safemath.sol";
import "@opengsn/contracts/src/BaseRelayRecipient.sol";
interface IERC20Permit is IERC20 {
    function permit(address owner, address spender, uint256 value, uint256 deadline, uint8 v, bytes32 r, bytes32 s) external;
}
contract Kickstarter is BaseRelayRecipient {
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
    uint256 public totalUsdcFunds;
    uint256 public totalUsdcRewards;
    uint256 public totalBridgedUsdcFunds;
    uint256 public totalBridgedUsdcRewards;
    uint256 public totalRewards;
    uint256 public totalFunds;
    bool public allowDonationAboveGoalAmount;
    bool public isActive;
    bool internal locked;
    IERC20Permit private _usdc;
    IERC20Permit private _usdcBridged;
    mapping(address => bool) public isUsdcContributer;
    

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
        address _token,
        address _bridgedToken,
        uint256 _goal,
        uint256 _deadline,
        bool _allowDonationAboveGoalAmount,
        uint256 _platformFee,
        address _trustedForwarder
    ) {
        if(_goal == 0 || _deadline == 0) revert RequireGoalAndDeadline();

        for(uint256 i=0; i<_proposers.length; i++) {
            proposers.push(_proposers[i]);
            isProposer[_proposers[i]] = true;
        }
        proposers.push(_msgSender());

        for(uint256 i=0; i<_admins.length; i++) {
            admins.push(_admins[i]);
            isAdmin[_admins[i]] = true;
        }

        receiverAddress = proposers[0];
        platformAddress = 0x1f00DD750aD3A6463F174eD7d63ebE1a7a930d0c;
        _usdc = IERC20Permit(_token);
        _usdcBridged = IERC20Permit(_bridgedToken);
        platformFee = _platformFee;
        goalAmount = _goal;
        deadline = _deadline;
        allowDonationAboveGoalAmount = _allowDonationAboveGoalAmount;
        _setTrustedForwarder(_trustedForwarder);
        isActive = true;
    }

    modifier noReentrant() {
        require(!locked, "No re-rentrancy");
        locked = true;
        _;
        locked = false;
    }

    modifier onlyProposerOrAdmin {
        require(isProposer[_msgSender()] == true || isAdmin[_msgSender()] == true, "You are not a proposer or admin.");
        _;
    }

    function versionRecipient() external override pure returns (string memory) {
        return "1.0.0"; // Example version, adjust as needed
    }

    function _msgSender() internal override(BaseRelayRecipient) view returns (address) {
        return BaseRelayRecipient._msgSender();
    }

    function _msgData() internal override(BaseRelayRecipient) view returns (bytes calldata) {
        return BaseRelayRecipient._msgData();
    }

    function addUsdcFunds(address sender, address spender, uint256 _amountUsdc, uint256 _deadline, uint8 v, bytes32 r, bytes32 s) public noReentrant payable returns(uint256, uint256, uint256, bool, bool, bool) {
        require(_amountUsdc > 0, "funds should be greater than 0");
        _usdc.permit(sender, spender, _amountUsdc, _deadline, v, r, s);
        _usdc.transferFrom(sender, spender, _amountUsdc);
        if(!isActive) revert FundingToContractEnded();
        uint256 _donation = _amountUsdc;
        patrons.push(_msgSender());
        isPatron[_msgSender()] = true;
        isUsdcContributer[_msgSender()] = true;
        patronAmount[_msgSender()] = patronAmount[_msgSender()].add(_donation);
        totalUsdcRewards = totalUsdcRewards.add((_donation.mul(100 - platformFee)).div(100));
        totalUsdcFunds = totalUsdcFunds.add(_donation);
        totalRewards = totalRewards.add((_donation.mul(100 - platformFee)).div(100));
        totalFunds = totalFunds.add(_donation);

        bool goalAmountAvailable = goalAmount > 0;
        bool deadlineAvailable = deadline > 0;
        bool metDeadline = deadlineAvailable && deadline <= block.timestamp;
        bool metGoal = totalRewards >= goalAmount;

        if(allowDonationAboveGoalAmount) {
            if (metDeadline && metGoal) {
                uint256 totalusdcrewards = totalUsdcRewards;
                uint256 adminusdcrewards = totalUsdcFunds.sub(totalUsdcRewards);
                uint256 totalbridgedusdcrewards = totalBridgedUsdcRewards;
                uint256 adminbridgedusdcrewards = totalBridgedUsdcFunds.sub(totalBridgedUsdcRewards);
                totalUsdcRewards = 0;
                totalUsdcFunds = 0;
                totalBridgedUsdcRewards = 0;
                totalBridgedUsdcFunds = 0;
                _usdc.transfer(receiverAddress, totalusdcrewards);
                _usdc.transfer(platformAddress, adminusdcrewards);
                _usdcBridged.transfer(receiverAddress, totalbridgedusdcrewards);
                _usdcBridged.transfer(platformAddress, adminbridgedusdcrewards);
                isActive = false;
            }
            if(metDeadline && !metGoal) {
                for(uint i=0; i<patrons.length; i++) {
                    uint transferableAmount = patronAmount[patrons[i]];
                    patronAmount[patrons[i]] = 0;
                    if(isUsdcContributer[patrons[i]]){
                        _usdc.transfer(patrons[i], transferableAmount);
                    }
                    if(!isUsdcContributer[patrons[i]]) {
                        _usdcBridged.transfer(patrons[i], transferableAmount);
                    }
            }
                isActive = false;
            }
        }

        if(!allowDonationAboveGoalAmount) {
            if(metGoal) {
                uint256 excessUsdcAmount;
                if(msg.value.add((totalUsdcRewards)).add(totalBridgedUsdcRewards) > goalAmount) {
                    excessUsdcAmount = goalAmount.sub(msg.value.add(totalUsdcRewards)).add(totalBridgedUsdcRewards);
                    totalUsdcRewards.sub(excessUsdcAmount);
                    uint256 usdcMoneyToPlatform = (totalUsdcRewards.mul(platformFee)).div(uint256(100).sub(platformFee));
                    _usdc.transfer(platformAddress, usdcMoneyToPlatform);
                    _usdc.transfer(receiverAddress, totalUsdcRewards);
                    _usdc.transfer(_msgSender(), excessUsdcAmount);
                    totalUsdcRewards = 0;
                    usdcMoneyToPlatform = 0;
                    uint256 bridgedUsdcMoneyToPlatform = (totalBridgedUsdcRewards.mul(platformFee)).div(uint256(100).sub(platformFee));
                    _usdcBridged.transfer(platformAddress, bridgedUsdcMoneyToPlatform);
                    _usdcBridged.transfer(receiverAddress, totalBridgedUsdcRewards);
                    totalBridgedUsdcRewards = 0;
                    bridgedUsdcMoneyToPlatform = 0;
                }
                if(msg.value.add(totalUsdcRewards.add(totalBridgedUsdcRewards)) == goalAmount){
                    uint256 usdcMoneyToPlatform = (totalUsdcRewards.mul(platformFee)).div(uint256(100).sub(platformFee));
                    _usdc.transfer(platformAddress, usdcMoneyToPlatform);
                    _usdc.transfer(receiverAddress, totalUsdcRewards);
                    totalUsdcRewards = 0;
                    usdcMoneyToPlatform = 0;
                    uint256 bridgedUsdcMoneyToPlatform = (totalBridgedUsdcRewards.mul(platformFee)).div(uint256(100).sub(platformFee));
                    _usdcBridged.transfer(platformAddress, bridgedUsdcMoneyToPlatform);
                    _usdcBridged.transfer(receiverAddress, totalBridgedUsdcRewards);
                    totalBridgedUsdcRewards = 0;
                    bridgedUsdcMoneyToPlatform = 0;
                }
                isActive = false;
            }
            if(metDeadline && !metGoal) {
                for(uint i=0; i<patrons.length; i++) {
                    uint transferableAmount = patronAmount[patrons[i]];
                    patronAmount[patrons[i]] = 0;
                    if(isUsdcContributer[patrons[i]]){
                        _usdc.transfer(patrons[i], transferableAmount);
                    }
                    if(!isUsdcContributer[patrons[i]]) {
                        _usdcBridged.transfer(patrons[i], transferableAmount);
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

    function addBridgedUsdcFunds(address sender, address spender, uint256 _amountUsdc, uint256 _deadline, uint8 v, bytes32 r, bytes32 s) public noReentrant payable returns(uint256, uint256, uint256, bool, bool, bool) {
        require(_amountUsdc > 0, "funds should be greater than 0");
        _usdcBridged.permit(sender, spender, _amountUsdc, _deadline, v, r, s);
        _usdcBridged.transferFrom(_msgSender(), address(this), _amountUsdc);
        if(!isActive) revert FundingToContractEnded();
        uint256 _donation = _amountUsdc;
        patrons.push(_msgSender());
        isPatron[_msgSender()] = true;
        isUsdcContributer[_msgSender()] = false;
        patronAmount[_msgSender()] = patronAmount[_msgSender()].add(_donation);
        totalBridgedUsdcRewards = totalBridgedUsdcRewards.add((_donation.mul(100 - platformFee)).div(100));
        totalBridgedUsdcFunds = totalBridgedUsdcFunds.add(_donation);
        totalRewards = totalRewards.add((_donation.mul(100 - platformFee)).div(100));
        totalFunds = totalFunds.add(_donation);

        bool goalAmountAvailable = goalAmount > 0;
        bool deadlineAvailable = deadline > 0;
        bool metDeadline = deadlineAvailable && deadline <= block.timestamp;
        bool metGoal = totalRewards >= goalAmount;

        if(allowDonationAboveGoalAmount) {
            if (metDeadline && metGoal) {
                uint256 totalusdcrewards = totalUsdcRewards;
                uint256 adminusdcrewards = totalUsdcFunds.sub(totalUsdcRewards);
                uint256 totalbridgedusdcrewards = totalBridgedUsdcRewards;
                uint256 adminbridgedusdcrewards = totalBridgedUsdcFunds.sub(totalBridgedUsdcRewards);
                totalUsdcRewards = 0;
                totalUsdcFunds = 0;
                totalBridgedUsdcRewards = 0;
                totalBridgedUsdcFunds = 0;
                _usdc.transfer(receiverAddress, totalusdcrewards);
                _usdc.transfer(platformAddress, adminusdcrewards);
                _usdcBridged.transfer(receiverAddress, totalbridgedusdcrewards);
                _usdcBridged.transfer(platformAddress, adminbridgedusdcrewards);
                isActive = false;
            }
            if(metDeadline && !metGoal) {
                for(uint i=0; i<patrons.length; i++) {
                    uint transferableAmount = patronAmount[patrons[i]];
                    patronAmount[patrons[i]] = 0;
                    if(isUsdcContributer[patrons[i]]){
                        _usdc.transfer(patrons[i], transferableAmount);
                    }
                    if(!isUsdcContributer[patrons[i]]) {
                        _usdcBridged.transfer(patrons[i], transferableAmount);
                    }
            }
                isActive = false;
            }
        }

        if(!allowDonationAboveGoalAmount) {
            if(metGoal) {
                uint256 excessBridgedUsdcAmount;
                if(msg.value.add((totalUsdcRewards)).add(totalBridgedUsdcRewards) > goalAmount) {
                    excessBridgedUsdcAmount = goalAmount.sub(msg.value.add((totalUsdcRewards)).add(totalBridgedUsdcRewards));
                    totalBridgedUsdcRewards.sub(excessBridgedUsdcAmount);
                    uint256 usdcMoneyToPlatform = (totalUsdcRewards.mul(platformFee)).div(uint256(100).sub(platformFee));
                    _usdc.transfer(platformAddress, usdcMoneyToPlatform);
                    _usdc.transfer(receiverAddress, totalUsdcRewards);
                    totalUsdcRewards = 0;
                    usdcMoneyToPlatform = 0;
                    uint256 bridgedUsdcMoneyToPlatform = (totalBridgedUsdcRewards.mul(platformFee)).div(uint256(100).sub(platformFee));
                    _usdcBridged.transfer(platformAddress, bridgedUsdcMoneyToPlatform);
                    _usdcBridged.transfer(receiverAddress, totalBridgedUsdcRewards);
                    _usdcBridged.transfer(_msgSender(), excessBridgedUsdcAmount);
                    totalBridgedUsdcRewards = 0;
                    bridgedUsdcMoneyToPlatform = 0;
                }
                if(msg.value.add(totalUsdcRewards.add(totalBridgedUsdcRewards)) == goalAmount){
                    uint256 usdcMoneyToPlatform = (totalUsdcRewards.mul(platformFee)).div(uint256(100).sub(platformFee));
                    _usdc.transfer(platformAddress, usdcMoneyToPlatform);
                    _usdc.transfer(receiverAddress, totalUsdcRewards);
                    totalUsdcRewards = 0;
                    usdcMoneyToPlatform = 0;
                    uint256 bridgedUsdcMoneyToPlatform = (totalBridgedUsdcRewards.mul(platformFee)).div(uint256(100).sub(platformFee));
                    _usdcBridged.transfer(platformAddress, bridgedUsdcMoneyToPlatform);
                    _usdcBridged.transfer(receiverAddress, totalBridgedUsdcRewards);
                    totalBridgedUsdcRewards = 0;
                    bridgedUsdcMoneyToPlatform = 0;
                }
                isActive = false;
            }
            if(metDeadline && !metGoal) {
                for(uint i=0; i<patrons.length; i++) {
                    uint transferableAmount = patronAmount[patrons[i]];
                    patronAmount[patrons[i]] = 0;
                    if(isUsdcContributer[patrons[i]]){
                        _usdc.transfer(patrons[i], transferableAmount);
                    }
                    if(!isUsdcContributer[patrons[i]]) {
                        _usdcBridged.transfer(patrons[i], transferableAmount);
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

    function endEarlyandRefund() public noReentrant onlyProposerOrAdmin {
        if(!isActive) revert("campaign is not active");
        if(patrons.length > 0) {
            for(uint256 i=0; i<patrons.length; i++) {
                uint256 transferableAmount = patronAmount[patrons[i]];
                patronAmount[patrons[i]] = 0;
                if(isUsdcContributer[patrons[i]]){
                    _usdc.transfer(patrons[i], transferableAmount);
                }
                if(!isUsdcContributer[patrons[i]]) {
                    _usdcBridged.transfer(patrons[i], transferableAmount);
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
                uint256 totalusdcrewards = totalUsdcRewards;
                uint256 adminusdcrewards = totalUsdcFunds.sub(totalUsdcRewards);
                uint256 totalbridgedusdcrewards = totalBridgedUsdcRewards;
                uint256 adminbridgedusdcrewards = totalBridgedUsdcFunds.sub(totalBridgedUsdcRewards);
                totalUsdcRewards = 0;
                totalUsdcFunds = 0;
                totalBridgedUsdcRewards = 0;
                totalBridgedUsdcFunds = 0;
                _usdc.transfer(receiverAddress, totalusdcrewards);
                _usdc.transfer(platformAddress, adminusdcrewards);
                _usdcBridged.transfer(receiverAddress, totalbridgedusdcrewards);
                _usdcBridged.transfer(platformAddress, adminbridgedusdcrewards);
                isActive = false;
            }
            if(metDeadline && !metGoal) {
                for(uint i=0; i<patrons.length; i++) {
                    uint transferableAmount = patronAmount[patrons[i]];
                    patronAmount[patrons[i]] = 0;
                    if(isUsdcContributer[patrons[i]]){
                        _usdc.transfer(patrons[i], transferableAmount);
                    }
                    if(!isUsdcContributer[patrons[i]]) {
                        _usdcBridged.transfer(patrons[i], transferableAmount);
                    }
                }
                isActive = false;
            }
        }
        if(!allowDonationAboveGoalAmount) {
            if(metGoal) {
                uint256 totalusdcrewards = totalUsdcRewards;
                uint256 adminusdcrewards = totalUsdcFunds.sub(totalUsdcRewards);
                uint256 totalbridgedusdcrewards = totalBridgedUsdcRewards;
                uint256 adminbridgedusdcrewards = totalBridgedUsdcFunds.sub(totalBridgedUsdcRewards);
                totalUsdcRewards = 0;
                totalUsdcFunds = 0;
                totalBridgedUsdcRewards = 0;
                totalBridgedUsdcFunds = 0;
                _usdc.transfer(receiverAddress, totalusdcrewards);
                _usdc.transfer(platformAddress, adminusdcrewards);
                _usdcBridged.transfer(receiverAddress, totalbridgedusdcrewards);
                _usdcBridged.transfer(platformAddress, adminbridgedusdcrewards);
                isActive = false;
            }
            if(metDeadline && !metGoal) {
                for(uint i=0; i<patrons.length; i++) {
                    uint transferableAmount = patronAmount[patrons[i]];
                    patronAmount[patrons[i]] = 0;
                    if(isUsdcContributer[patrons[i]]){
                        _usdc.transfer(patrons[i], transferableAmount);
                    }
                    if(!isUsdcContributer[patrons[i]]) {
                        _usdcBridged.transfer(patrons[i], transferableAmount);
                    }
                }
                isActive = false; 
            }
        }
    }
}