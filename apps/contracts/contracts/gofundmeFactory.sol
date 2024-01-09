/// @notice  SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import './proxyportals/gofundme.sol';
contract gofundmeFactory {
    event NewPortalCreated(address indexed portalAddress);
    function createPortal() public returns (address) {
        Gofundme newPortal = new Gofundme();
        emit NewPortalCreated(address(newPortal));
        return address(newPortal);
    }
}
