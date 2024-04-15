//SPDX-License-Identifier:MIT

pragma solidity ^0.8.0;

import "../../helperContracts/ierc20_permit.sol";
import "../../helperContracts/safemath.sol";
// interface IERC20Permit is IERC20 {
//     function permit(address owner, address spender, uint256 value, uint256 deadline, uint8 v, bytes32 r, bytes32 s) external;
// }
contract AllOrNothing {
    /// @notice this is the address of proposer who deploys a contract
    address public proposer;
    /// @notice this will be a mapping of the address of a proposer to a boolean value of true or false
    mapping(address => bool) public isProposer;
    ///@notice array of platformAdmins address, there can be multiple platform admins
    address[] public platformAdmins;
    /// @notice this will be a mapping of the addresses of a platformAdmins to a boolean value of true or false
    mapping(address => bool) public isPlatformAdmin;
    /// @notice this will be the address to receive campaign funds, it can be similar to proposer address
    address public receiverAddress;
    /// @notice keeping track of goalAmount and set to 0 initially
    uint256 public goalAmount = 0;
    /// @notice keeping track of deadline and set to 0 initially
    uint256 public deadline = 0;
    /// @notice this will be the address to receive platform Fee
    address public platformAddress;
    /// @notice this will the percentage from totalFunds which goes to the platform address as Fee
    uint256 public platformFee;
    /// @notice this will be an array of address who funding to this campaign
    address[] public funders; 
    /// @notice this will be a mapping of the addresses of a funder to a boolean value of true or false
    mapping(address => bool) public isFunder;
    /// @notice this will be a mapping of the addresses of the funders to the amount they have contributed
    mapping(address => uint256) public funderAmount;
    /// @notice this will be the total usdcFunds donated to the campaign
    uint256 public totalUsdcFunds;
    /// @notice this will be the total usdcRewards which goes to the recipient after deduction the platform fee from total usdc Funds.
    uint256 public totalUsdcRewards;
    /// @notice this will be the total bridged usdcFunds donated to the campaign
    uint256 public totalBridgedUsdcFunds;
    /// @notice this will be the total bridged usdcRewards which goes to the recipient after deducting the platform fee from total bridged usdcFunds
    uint256 public totalBridgedUsdcRewards;
    /// @notice this will be totalRewards(usdc + usdcBrdiged)
    uint256 public totalRewards;
    /// @notice this will be totalFunds(usdc + usdcBrdiged)
    uint256 public totalFunds;
    /// @notice bool to check does proposer need to allow donations above the goalAmount or not
    bool public allowDonationAboveGoalAmount;
    /// @notice this mapping will be to track of revokeVotes for all the platformAdmins
    mapping(address => uint) public revokeVotes;
    /// @notice to keep track of total platformAdmins
    uint256 public totalPlatformAdmins;
    /// @notice bool to check status of campaign
    bool public isActive;
    /// @notice To-Do
    bool internal locked;
    /// @notice initializing the erc20 interface for usdc token
    IERC20Permit private _usdc;
    /// @notice initializing the erc20 interface for usdc bridged usdc token
    IERC20Permit private _usdcBridged;
    /// @notice mapping to verify the funder donated usdc or usdc.e 
    mapping(address => bool) public isUsdcContributer;

    /// @notice error indicating the funding to the contract has ended
    error FundingToContractEnded();
    /// @notice error indicating the need of goal and deadline while deploying the contract
    error RequireGoalAndDeadline();
    /// @notice initializing the use of safemath
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

    /// @notice constructor where we pass all the required parameters before deploying the contract
    /// @param _proposer who creates this campaign
    /// @param _platformAdmins array of address of platform admins
    /// @param _token contract address of usdc token
    /// @param _bridgedToken contract address of usdc.e token
    /// @param _goal is used to set the goalAmount for the campaign
    /// @param _deadline, deadline of the campaign
    /// @param _allowDonationAboveGoalAmount bool to decide to allow donations above the goalAmount
    /// @param _platformFee percentage of amount that goes to the platformAddess 
    constructor(
        address _proposer,
        address[] memory _platformAdmins,
        address _token,
        address _bridgedToken,
        uint256 _goal,
        uint256 _deadline,
        bool _allowDonationAboveGoalAmount,
        uint256 _platformFee
    ) {
        if(_goal == 0 || _deadline == 0) revert RequireGoalAndDeadline();

        proposer = _proposer;
        isProposer[_proposer] = true;
        totalPlatformAdmins = _platformAdmins.length;
        for(uint256 i=0; i<totalPlatformAdmins; i++) {
            platformAdmins.push(_platformAdmins[i]);
            isPlatformAdmin[_platformAdmins[i]] = true;
        }

        receiverAddress = _proposer;
        platformAddress = 0x1f00DD750aD3A6463F174eD7d63ebE1a7a930d0c;
        _usdc = IERC20Permit(_token);
        _usdcBridged = IERC20Permit(_bridgedToken);
        platformFee = _platformFee;
        goalAmount = _goal;
        deadline = _deadline;
        allowDonationAboveGoalAmount = _allowDonationAboveGoalAmount;
        isActive = true;
    }

    /// @notice re-entrancy modifier
    modifier noReentrant() {
        require(!locked, "No re-rentrancy");
        locked = true;
        _;
        locked = false;
    }

    /// @notice modifer where only proposer or platformAdmin can call the functions.
    modifier onlyProposerOrAdmin {
        require(isProposer[msg.sender] == true || isPlatformAdmin[msg.sender] == true, "You are not a proposer or admin.");
        _;
    }

    /// @notice function to donate the usdc tokens into the campaign
    function addUsdcFunds(address sender, address spender, uint256 _amountUsdc, uint256 _deadline, uint8 v, bytes32 r, bytes32 s) public noReentrant payable returns(uint256, uint256, uint256, bool, bool, bool) {
        require(_amountUsdc > 0, "funds should be greater than 0");
        _usdc.permit(sender, spender, _amountUsdc, _deadline, v, r, s);
        _usdc.transferFrom(sender, spender, _amountUsdc);
        if(!isActive) revert FundingToContractEnded();
        uint256 _donation = _amountUsdc;
        funders.push(msg.sender);
        isFunder[msg.sender] = true;
        isUsdcContributer[msg.sender] = true;
        funderAmount[msg.sender] = funderAmount[msg.sender].add(_donation);
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
                for(uint i=0; i<funders.length; i++) {
                    uint transferableAmount = funderAmount[funders[i]];
                    funderAmount[funders[i]] = 0;
                    if(isUsdcContributer[funders[i]]){
                        _usdc.transfer(funders[i], transferableAmount);
                    }
                    if(!isUsdcContributer[funders[i]]) {
                        _usdcBridged.transfer(funders[i], transferableAmount);
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
                    _usdc.transfer(msg.sender, excessUsdcAmount);
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
                for(uint i=0; i<funders.length; i++) {
                    uint transferableAmount = funderAmount[funders[i]];
                    funderAmount[funders[i]] = 0;
                    if(isUsdcContributer[funders[i]]){
                        _usdc.transfer(funders[i], transferableAmount);
                    }
                    if(!isUsdcContributer[funders[i]]) {
                        _usdcBridged.transfer(funders[i], transferableAmount);
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

    /// function to donate bridged tokens into campaign and swap to the usdc then sends to the campaign
    function addBridgedUsdcFunds(address sender, address spender, uint256 _amountUsdc, uint256 _deadline, uint8 v, bytes32 r, bytes32 s) public noReentrant payable returns(uint256, uint256, uint256, bool, bool, bool) {
        require(_amountUsdc > 0, "funds should be greater than 0");
        _usdcBridged.permit(sender, spender, _amountUsdc, _deadline, v, r, s);
        _usdcBridged.transferFrom(msg.sender, address(this), _amountUsdc);
        if(!isActive) revert FundingToContractEnded();
        uint256 _donation = _amountUsdc;
        funders.push(msg.sender);
        isFunder[msg.sender] = true;
        isUsdcContributer[msg.sender] = false;
        funderAmount[msg.sender] = funderAmount[msg.sender].add(_donation);
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
                for(uint i=0; i<funders.length; i++) {
                    uint transferableAmount = funderAmount[funders[i]];
                    funderAmount[funders[i]] = 0;
                    if(isUsdcContributer[funders[i]]){
                        _usdc.transfer(funders[i], transferableAmount);
                    }
                    if(!isUsdcContributer[funders[i]]) {
                        _usdcBridged.transfer(funders[i], transferableAmount);
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
                    _usdcBridged.transfer(msg.sender, excessBridgedUsdcAmount);
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
                for(uint i=0; i<funders.length; i++) {
                    uint transferableAmount = funderAmount[funders[i]];
                    funderAmount[funders[i]] = 0;
                    if(isUsdcContributer[funders[i]]){
                        _usdc.transfer(funders[i], transferableAmount);
                    }
                    if(!isUsdcContributer[funders[i]]) {
                        _usdcBridged.transfer(funders[i], transferableAmount);
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

    /// @notice function to end campaign early and refund to funders and can be called by only proposer or admin
    function endEarlyandRefund() public noReentrant onlyProposerOrAdmin {
        if(!isActive) revert("campaign is not active");
        if(funders.length > 0) {
            for(uint256 i=0; i<funders.length; i++) {
                uint256 transferableAmount = funderAmount[funders[i]];
                funderAmount[funders[i]] = 0;
                if(isUsdcContributer[funders[i]]){
                    _usdc.transfer(funders[i], transferableAmount);
                }
                if(!isUsdcContributer[funders[i]]) {
                    _usdcBridged.transfer(funders[i], transferableAmount);
                }
            }
            isActive = false;
        }
        isActive = false;
    }

    /// @notice function to end the campaign early
    // unlike endEarlyandRedund, this function checks the conditions and according to conditions met it executes
    function endKickStarterCampaign() public noReentrant onlyProposerOrAdmin {
        if(!isActive) revert("campaign is not active");
        bool deadlineAvailable = deadline > 0;
        bool metDeadline = deadlineAvailable && deadline <= block.timestamp;
        bool metGoal = totalRewards >= goalAmount;

        if(allowDonationAboveGoalAmount) {
            if ((metDeadline && metGoal) || (!metDeadline && metGoal)) {
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
                for(uint i=0; i<funders.length; i++) {
                    uint transferableAmount = funderAmount[funders[i]];
                    funderAmount[funders[i]] = 0;
                    if(isUsdcContributer[funders[i]]){
                        _usdc.transfer(funders[i], transferableAmount);
                    }
                    if(!isUsdcContributer[funders[i]]) {
                        _usdcBridged.transfer(funders[i], transferableAmount);
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
                for(uint i=0; i<funders.length; i++) {
                    uint transferableAmount = funderAmount[funders[i]];
                    funderAmount[funders[i]] = 0;
                    if(isUsdcContributer[funders[i]]){
                        _usdc.transfer(funders[i], transferableAmount);
                    }
                    if(!isUsdcContributer[funders[i]]) {
                        _usdcBridged.transfer(funders[i], transferableAmount);
                    }
                }
                isActive = false; 
            }
        }
    }

    /// @notice function to vote to revoke as a platformAdmin
    /// @param _admin address of platformAdmin to vote for revoke
    function voteToRevokePlatformAdmin(address _admin) public {
        require(isPlatformAdmin[msg.sender], "you are not an platform admin to vote for revoke");
        revokeVotes[_admin] +=1;
        if(revokeVotes[_admin] >= (2 * totalPlatformAdmins) / 3) {
            finalRevoke(_admin);
        }
    }
    /// @notice function to revoke access for platform admin, it will be called in voteToRevokePlatformAdmin
    /// @param _admin address of platformAdmin to vote for revoke
    function finalRevoke(address _admin) private {
        isPlatformAdmin[_admin] = false;
    }
}