/// @notice  SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import "./portal.sol";
contract portalFactory {
    event NewPortalCreated(address indexed portalAddress);
    function createPortal(
        address[] memory _owners,
        uint256 _goal,
        uint256 _deadline,
        bool _allowDonationAboveGoalAmount,
        uint256 _platformFee
    ) public returns (address) {
        
        Portal newPortal = new Portal(_owners, _goal, _deadline, _allowDonationAboveGoalAmount, _platformFee);
        emit NewPortalCreated(address(newPortal));
        return address(newPortal);
    }
}
