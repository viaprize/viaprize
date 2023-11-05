/// @notice  SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Viaprize.sol";
contract ViaPrizeFactory {
    // Event declaration
    event NewViaPrizeCreated(uint indexed id, address indexed viaPrizeAddress);
    function createViaPrize(
        address[] memory _admins,
        address[] memory _platformAdmins,
        uint _platFormFee,
        uint _proposerFee,
        address _platformAddress,
        uint _contractId
    ) public returns (address) {
        // Deploy a new ViaPrize contract and store its address
        ViaPrize newViaPrize = new ViaPrize(_admins, _platformAdmins, _platFormFee, _proposerFee, _platformAddress);
        // Emit the event with the contractId and the address of the newly created contract
        emit NewViaPrizeCreated(_contractId, address(newViaPrize));

        // Return the address of the newly created contract
        return address(newViaPrize);
    }
}
