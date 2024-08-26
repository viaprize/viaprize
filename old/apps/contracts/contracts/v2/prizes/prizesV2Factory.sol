/// @notice  SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./prizes.sol";
contract PrizeFactoryV2 {
    // Event declaration
    event NewViaPrizeCreated(uint indexed id, address indexed viaPrizeAddress);
    function createViaPrize(
       uint _id , address _proposer, address[] memory _platformAdmins, uint _platFormFee, uint _proposerFee, address _usdcAddress
    ) public returns (address) {
        // Deploy a new ViaPrize contract and store its address
        PrizeV2 newViaPrize = new PrizeV2(_proposer, _platformAdmins, _platFormFee, _proposerFee, _usdcAddress);
        // Emit the event with the contractId and the address of the newly created contract
        emit NewViaPrizeCreated(_id, address(newViaPrize));

        // Return the address of the newly created contract
        return address(newViaPrize);
    }
}
