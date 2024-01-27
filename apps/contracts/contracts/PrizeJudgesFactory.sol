/// @notice  SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;
import "./PrizeJudges.sol";
contract PrizeJudgesFactory {
    // Event declaration
    event NewViaPrizeCreated(uint indexed id, address indexed viaPrizeAddress);


    function createViaPrizeJudges(
        address[] memory _admins,
        address[] memory _platformAdmins,
        address[] memory _judges,
        uint _platFormFee,
        uint _proposerFee,
        address _platformAddress,
        uint _submission_time,
        uint _contractId
    ) public returns (address) {
        // Deploy a new ViaPrize contract and store its address
        PrizeJudges newViaPrize = new PrizeJudges(_admins, _platformAdmins, _judges, _platFormFee, _proposerFee, _platformAddress,_submission_time);
        // Emit the event with the contractId and the address of the newly created contract
        emit NewViaPrizeCreated(_contractId, address(newViaPrize));

        // Return the address of the newly created contract
        return address(newViaPrize);
    }

}
