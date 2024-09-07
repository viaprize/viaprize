// SPDX-License-Identifier: MIT


pragma solidity ^0.8.0;

import "../helperContracts/ierc20_permit.sol"; 
interface Campaign {
    function addUsdcFunds(address spender, uint256 _amountUsdc, uint256 _deadline, uint8 v, bytes32 s, bytes32 r, bytes32 _ethSignedMessageHash) external;
}
contract ReserveFunds {
    IERC20Permit public immutable _usdc;
    IERC20Permit public immutable _usdcBridged;

    constructor(address _usdcAddress, address _usdcBridgedAddress){
        _usdc = IERC20Permit(_usdcAddress);
        _usdcBridged = IERC20Permit(_usdcBridgedAddress);
    }


    function fundUsingUsdc(
        address reserveAddress,
        address spender,
        uint256 _amount,
        uint256 _deadline,
        uint8 v,
        bytes32 r,
        bytes32 s,
        bytes32 _ethSignedMessageHash
    ) public {
        address user = ecrecover(_ethSignedMessageHash, v, r, s);
        _usdc.transferFrom(reserveAddress, user, _amount);
        Campaign campaign = Campaign(spender);
        campaign.addUsdcFunds(spender, _amount, _deadline, v, s, r, _ethSignedMessageHash);
    }
}