//SPDX-License-Identifier:MIT

pragma solidity ^0.8.0;

import "../helperContracts/ierc20.sol";
import "../helperContracts/safemath.sol";

interface IERC20Permit is IERC20 {
    function permit(address owner, address spender, uint256 value, uint256 deadline, uint8 v, bytes32 r, bytes32 s) external;
}

contract Gofundme {
    address[] public proposers;
    mapping(address => bool) public isProposer;
    address[] public admins;
    mapping(address => bool) public isAdmin;
    address public receiverAddress;
    uint256 public platformFee;
    address public platformAddress;
    address[] public patrons; 
    mapping(address => bool) public isPatron;
    mapping(address => uint256) public patronAmount;
    mapping(address => uint256) public refundPatronsAmount;
    uint256 public totalFunds;
    uint256 public totalRewards;
    bool public isActive;
    bool internal locked;
    IERC20Permit private _usdc;
    IERC20Permit private _usdcBridged;

    error NotEnoughFunds();
    error FundingToContractEnded();

    using SafeMath for uint256;

    event Values(
        address receiverAddress,
        uint256 totalFunds,
        uint256 totalRewards
    );

    constructor(
        address[] memory _proposers,
        address[] memory _admins,
        address _token,
        address _bridgedToken,
        uint256 _platformFee
    ) {

        for (uint256 i = 0; i < _proposers.length; i++) {
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
        platformFee = _platformFee;
        isActive = true;
        _usdc = IERC20Permit(_token);
        _usdcBridged = IERC20Permit(_bridgedToken);
    }

    modifier noReentrant() {
        require(!locked, "No Re-entrancy");
        locked = true;
        _;
        locked = false;
    }

    modifier onlyProposerOrAdmin {
        require(isProposer[msg.sender] == true || isAdmin[msg.sender] == true, "You are not a proposer or admin.");
        _;
    }

    function addUSDCFunds(address sender, address spender, uint256 _amountUsdc, uint256 _deadline, uint8 v, bytes32 r, bytes32 s) public noReentrant payable {
        require(_amountUsdc > 0, "funds should be greater than 0");
        _usdc.permit(sender, spender, _amountUsdc, _deadline, v, r, s);
        _usdc.transferFrom(msg.sender, address(this), _amountUsdc);
        uint256 _donation = _amountUsdc;
        patrons.push(msg.sender);
        isPatron[msg.sender] = true;
        totalFunds = totalFunds.add(_donation);
        totalRewards = totalRewards.add((_donation.mul(100 - platformFee)).div(100));
        _usdc.transfer(receiverAddress, (_donation.mul(100 - platformFee)).div(100));
        _usdc.transfer(platformAddress, (_donation.mul(platformFee)).div(100));

        emit Values(receiverAddress, totalFunds, totalRewards);
    }
    
    function addBridgedUSDCFunds(address sender, address spender, uint256 _amountUsdc, uint256 _deadline, uint8 v, bytes32 r, bytes32 s) public noReentrant payable {
        require(_amountUsdc > 0, "funds should be greater than 0");
        _usdcBridged.permit(sender, spender, _amountUsdc, _deadline, v, r, s);
        _usdcBridged.transferFrom(msg.sender, address(this), _amountUsdc);
        uint256 _donation = _amountUsdc;
        patrons.push(msg.sender);
        isPatron[msg.sender] = true;
        totalFunds = totalFunds.add(_donation);
        totalRewards = totalRewards.add((_donation.mul(100 - platformFee)).div(100));
        _usdcBridged.transfer(receiverAddress, (_donation.mul(100 - platformFee)).div(100));
        _usdcBridged.transfer(platformAddress, (_donation.mul(platformFee)).div(100));

        emit Values(receiverAddress, totalFunds, totalRewards);
    }

    function endCampaign() public onlyProposerOrAdmin {
        if(!isActive) revert("campaign is not active");
        isActive = false;
    }
}
