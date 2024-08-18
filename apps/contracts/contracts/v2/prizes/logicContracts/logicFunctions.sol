// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../../../helperContracts/owner.sol";
import "../../../helperContracts/safemath.sol";
import "../../../helperContracts/ierc20_permit.sol";
import "../helperLibraries/errorEventsLibrary.sol";

contract LogicContract is Ownable {

    uint8 public immutable proposerFee;
    uint8 public immutable platformFee;
    uint256 public totalFunds; 
    uint256 public totalRewards;

    address[] public cryptoFunders;
    address[] public fiatFunders;
    address[] public refundRequestedFunders;
    address public immutable platformAddress = 0x1f00DD750aD3A6463F174eD7d63ebE1a7a930d0c;

    mapping (address => uint256) public cryptoFunderAmount;
    mapping(address => uint256) public fiatFunderAmount;
    mapping(address => uint256) public individualFiatPercentage;
    mapping(address => uint256) public individualCryptoPercentage;
    mapping(address => uint256) public totalFunderAmount;
    mapping(address => bool) public isCryptoFunder;
    mapping(address => bool) public isFiatFunder;
    mapping(address => bool) public isRefundRequestedAddress;
    mapping(address => bool) public isContestant;
    mapping(address => mapping(bytes32 => uint256)) public funderVotes;

    IERC20Permit public immutable _usdc;

    using SafeMath for uint256;
    using ErrorAndEventsLibrary for *;

    constructor(address initialOwner, uint8 _proposerFee, uint8 _platformFee, address _usdcAddress) Ownable(initialOwner) {
        proposerFee = _proposerFee;
        platformFee = _platformFee;
        _usdc = IERC20Permit(_usdcAddress);
    }

    function getAllCryptoFunders() view external returns(address[] memory){
        return cryptoFunders;
    }

    function getAllFiatFunders() view external returns(address[] memory){
        return fiatFunders;
    }

    function updateTotalFunds(uint256 _totalFunds) external {
        totalFunds = _totalFunds;
    }

    function updateTotalRewards(uint256 _totalRewards) external {
        totalRewards = _totalRewards;
    }

    function retrieveFunderVotes(address _sender, bytes32 _submissionHash) view external returns(uint256) {
        return funderVotes[_sender][_submissionHash];
    } 

    function updateFunderVotes(address _sender, bytes32 _submissionHash, uint256 _amount) external {
        funderVotes[_sender][_submissionHash] = _amount;
    }

    function depositLogic(address sender, uint256 donation) external {
        if(!isCryptoFunder[sender]) {
            isCryptoFunder[sender] = true;
            cryptoFunders.push(sender);
        }
        cryptoFunderAmount[sender] = cryptoFunderAmount[sender].add(donation);
        totalFunderAmount[sender] = totalFunderAmount[sender].add(donation);
        individualCryptoPercentage[sender] = (cryptoFunderAmount[sender].mul(100)).div(totalFunderAmount[sender]);
        individualFiatPercentage[sender] = (fiatFunderAmount[sender].mul(100)).div(totalFunderAmount[sender]);
        totalFunds = totalFunds.add(donation);
        totalRewards = totalRewards.add((donation.mul(100 - (platformFee + proposerFee))).div(100));
    }

    function refundLogic() external {
        for(uint64 i=0; i<cryptoFunders.length; i++) {
            address funder = cryptoFunders[i];
            uint256 transferable_amount = cryptoFunderAmount[cryptoFunders[i]];
            cryptoFunderAmount[funder] = 0;
            _usdc.transfer(funder, transferable_amount);
            emit ErrorAndEventsLibrary.cryptoFunderRefunded(funder, transferable_amount, true);
        }
        for(uint64 i=0; i<fiatFunders.length; i++) {
            address funder = fiatFunders[i];
            uint256 transferable_amount = fiatFunderAmount[funder];
            fiatFunderAmount[funder] = 0;
            _usdc.transfer(platformAddress, transferable_amount);
            emit ErrorAndEventsLibrary.fiatFunderRefund(funder, transferable_amount, true);
        }
    }

    function tokenFundLogic(address sender, uint256 _amount) external {
        if(isFiatFunder[sender]) {
            fiatFunders.push(sender);
            isFiatFunder[sender] = true;
        }
        fiatFunderAmount[sender] = fiatFunderAmount[sender].add(_amount);
        totalFunderAmount[sender] = totalFunderAmount[sender].add(_amount);
        totalRewards = totalRewards.add((_amount.mul(100 - (platformFee + proposerFee))).div(100));
        individualFiatPercentage[sender] = (fiatFunderAmount[sender].mul(100)).div(totalFunderAmount[sender]);
        individualCryptoPercentage[sender] = (cryptoFunderAmount[sender].mul(100)).div(totalFunderAmount[sender]);
        totalFunds = totalFunds.add(_amount);
    }

    function voteLogic(uint256 _amount, bytes32 _submissionHash, address sender) external {
        if(cryptoFunderAmount[sender] > 0 && fiatFunderAmount[sender] > 0){
            uint256 cryptoAmountToVote = (_amount.mul(individualCryptoPercentage[sender])).div(100);
            uint256 fiatAmountToVote = (_amount.mul(individualFiatPercentage[sender])).div(100);
            if(!(_amount == cryptoAmountToVote + fiatAmountToVote)) revert("VMPPEIL"); // VM,PPEIL -> votes mismatch, probably precise error in logic
            cryptoFunderAmount[sender] = cryptoFunderAmount[sender].sub(cryptoAmountToVote);
            fiatFunderAmount[sender] = fiatFunderAmount[sender].sub(fiatAmountToVote);
            totalFunderAmount[sender] = totalFunderAmount[sender].sub(cryptoAmountToVote + fiatAmountToVote);
            funderVotes[sender][_submissionHash] = funderVotes[sender][_submissionHash].add(_amount);
            cryptoAmountToVote = 0;
            fiatAmountToVote = 0;
        } else if(cryptoFunderAmount[sender] > 0) {
            uint256 cryptoAmountToVote = (_amount.mul(individualCryptoPercentage[sender])).div(100);
            if(!(_amount == cryptoAmountToVote)) revert("VMPPEIL"); // VM,PPEIL -> votes mismatch, probably precise error in logic
            cryptoFunderAmount[sender] = cryptoFunderAmount[sender].sub(cryptoAmountToVote);
            totalFunderAmount[sender] = totalFunderAmount[sender].sub(cryptoAmountToVote);
            funderVotes[sender][_submissionHash] = funderVotes[sender][_submissionHash].add(_amount);
            cryptoAmountToVote = 0;
        } else if(fiatFunderAmount[sender] > 0) {
            uint256 fiatAmountToVote = (_amount.mul(individualFiatPercentage[sender])).div(100);
            if(!(_amount == fiatAmountToVote)) revert("VMPPEIL"); // VM,PPEIL -> votes mismatch, probably precise error in logic
            fiatFunderAmount[sender] = fiatFunderAmount[sender].sub(fiatAmountToVote);
            totalFunderAmount[sender] = totalFunderAmount[sender].sub(fiatAmountToVote);
            funderVotes[sender][_submissionHash] = funderVotes[sender][_submissionHash].add(_amount);
            fiatAmountToVote = 0;
        }
    }

    function unusedRefundSubmissionLogic(uint256 transferable_usdc_amount, uint256 total_unused_usdc_votes) external {
        if(transferable_usdc_amount > 0) {
            for(uint256 j=0; j<cryptoFunders.length; j++) {
                if(cryptoFunderAmount[cryptoFunders[j]] > 0){
                    uint256 individual_unused_votes = cryptoFunderAmount[cryptoFunders[j]].mul(100 - platformFee - proposerFee).div(100);
                    uint256 individual_refund_usdc_percentage =   (individual_unused_votes.mul(10000).div(total_unused_usdc_votes));
                    uint256 individual_transferable_usdc_amount = (transferable_usdc_amount.mul(individual_refund_usdc_percentage).div(10000));
                    if(individual_transferable_usdc_amount > 0) {_usdc.transfer(cryptoFunders[j], individual_transferable_usdc_amount);}
                }
            }
            for(uint256 j=0; j<fiatFunders.length; j++) {
                if(fiatFunderAmount[fiatFunders[j]] > 0) {
                    uint256 individual_unused_votes = fiatFunderAmount[fiatFunders[j]].mul(100 - platformFee - proposerFee).div(100);
                    uint256 individual_refund_usdc_percentage =   (individual_unused_votes.mul(10000).div(total_unused_usdc_votes));
                    uint256 individual_transferable_usdc_amount = (transferable_usdc_amount.mul(individual_refund_usdc_percentage).div(10000));
                    if(individual_transferable_usdc_amount > 0) {_usdc.transfer(platformAddress, individual_transferable_usdc_amount);}
                }
            }
        }
    }
}