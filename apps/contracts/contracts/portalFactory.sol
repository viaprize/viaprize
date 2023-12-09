/// @notice  SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./portal.sol";
contract portalFactory {
    event NewPortalCreated(uint indexed id, address indexed portalAddress);
    function createPortal(
        address[] memory _owners,
        uint256 _goal,
        uint256 _deadline,
        bool _allowDonationAboveGoalAmount,
        uint256 _platformFee
    ) public returns (address) {
        
        Portal newPortal = new ViaPrize(_owners, _goal, _deadline, _allowDonationsAboveGoalAmount, _platformFee);
        emit NewPortalCreated(_contractId, address(newPortal));
        return address(newPortal);
    }
}
