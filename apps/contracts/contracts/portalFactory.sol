/// @notice  SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./portal.sol";
contract portalFactory {
    event NewPortalCreated(address indexed portalAddress);
    function createPortal(
        address[] memory _owners,
        address[] memory _admins,
        uint256 _goal,
        uint256 _deadline,
        bool _allowDonationAboveGoalAmount,
        uint256 _platformFee,
        bool _allowImmediately
    ) public returns (address) {
        Portal newPortal = new Portal(_owners, _admins ,_goal, _deadline, _allowDonationAboveGoalAmount, _platformFee,_allowImmediately);
        emit NewPortalCreated(address(newPortal));
        return address(newPortal);
    }
}
