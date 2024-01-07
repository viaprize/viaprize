//SPDX-License-Identifier:MIT

pragma solidity 0.8.19;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract Gofundme {
    address[] public proposers;
    mapping(address => bool) public isProposer;
    address[] public admins;
    mapping(address => bool) public isAdmin;
    address public receiverAddress;
    uint256 public platformFee;
    address public platformAddress = 0x1f00DD750aD3A6463F174eD7d63ebE1a7a930d0c;
    address[] public patrons; 
    mapping(address => bool) public isPatron;
    mapping(address => uint256) public patronAmount;
    mapping(address => uint256) public refundPatronsAmount;
    uint256 public totalFunds;
    uint256 public totalRewards;
    bool public isActive;
    bool internal locked;


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
        platformFee = _platformFee;
        isActive = true;
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


    function addFunds() public noReentrant payable returns(uint256, uint256)
    {
        if(msg.value == 0) revert NotEnoughFunds();
        if(!isActive) revert FundingToContractEnded();
        patrons.push(msg.sender);
        isPatron[msg.sender] = true;
        patronAmount[msg.sender] = patronAmount[msg.sender].add(msg.value);
        totalRewards = totalRewards.add((msg.value.mul(100 - platformFee)).div(100));
        totalFunds = totalFunds.add(msg.value);

        payable(receiverAddress).transfer(
           (msg.value.mul(100 - platformFee)).div(100)
        );
        payable(platformAddress).transfer(
            (msg.value.mul(platformFee)).div(100)
        );

        emit Values(
            receiverAddress, 
            totalFunds, 
            totalRewards
        );
        return (
            address(this).balance,
            totalRewards
        );
    }

    receive() external payable {
        addFunds();
    }

    function endCampaign() public onlyProposerOrAdmin {
        if(!isActive) revert("campaign is not active");
        isActive = false;
    }

}