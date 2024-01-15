//SPDX-License-Identifier:MIT

pragma solidity ^0.8.0;

import "../helperContracts/ierc20.sol";
import "../helperContracts/safemath.sol";


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
    IERC20 private _usdc;
    IERC20 private _usdcBridged;

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
        _usdc = IERC20(0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85);
        _usdcBridged = IERC20(0x7F5c764cBc14f9669B88837ca1490cCa17c31607);
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

    function addETHFunds() public payable noReentrant {
        uint256 _donation = msg.value;
        require(_donation > 0, "donation can't be zero");
        
        patrons.push(msg.sender);
        isPatron[msg.sender] = true;
        totalFunds = totalFunds.add(_donation);
        totalRewards = totalRewards.add((_donation.mul(100 - platformFee)).div(100));
        payable(receiverAddress).transfer((_donation.mul(100 - platformFee)).div(100));
        payable(platformAddress).transfer((_donation.mul(platformFee)).div(100));

        emit Values(receiverAddress, totalFunds, totalRewards);
    }

    function addUSDCFunds(uint256 _amountUsdc) public noReentrant payable {
        require(_usdc.allowance(msg.sender, address(this)) >= _amountUsdc, "Not enough USDC approved");
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
    function addBridgedUSDCFunds(uint256 _amountUsdc) public noReentrant payable {
        require(_usdcBridged.allowance(msg.sender, address(this)) >= _amountUsdc, "Not enough USDC approved");
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


    receive() external payable {
        addETHFunds();
    }

    function endCampaign() public onlyProposerOrAdmin {
        if(!isActive) revert("campaign is not active");
        isActive = false;
    }

}
