// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

library VoteLibrary {
    function VOTE_HASH(address contractAddress, uint256 _nonce, bytes32 _submission, uint256 _amount) internal pure returns (bytes32) {
        bytes32 _messageHash = keccak256(
            abi.encodePacked("VOTE FOR ", _submission, " WITH AMOUNT ", _amount, " AND NONCE ", _nonce, " WITH PRIZE CONTRACT ", contractAddress)
        );
        return keccak256(
            abi.encodePacked("\x19Ethereum Signed Message:\n32", _messageHash)
        );
    }

    function CHANGE_VOTE_HASH(address contractAddress, uint256 _nonce, bytes32 _old_submission, uint256 _amount, bytes32 _new_submission) internal pure returns (bytes32) {
        bytes32 _messageHash = keccak256(
            abi.encodePacked("CHANGE VOTE FROM ", _old_submission, " TO ", _new_submission, " WITH AMOUNT ", _amount, " AND NONCE ", _nonce, " WITH PRIZE CONTRACT ", contractAddress)
        );
        return keccak256(
            abi.encodePacked("\x19Ethereum Signed Message:\n32", _messageHash)
        );
    }

    function DISPUTE_HASH(address contractAddress, uint256 _nonce, bytes32 _submission) internal pure returns (bytes32) {
        bytes32 _messageHash = keccak256(
            abi.encodePacked("DISPUTE FOR ", _submission, " AND NONCE ", _nonce, " WITH PRIZE CONTRACT ", contractAddress)
        );
        return keccak256(
            abi.encodePacked("\x19Ethereum Signed Message:\n32", _messageHash)
        );
    }
}
