/// @notice  SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../logicContracts/SubmissionAVLTree.sol";
library SubmissionLibrary {
    function deploySubmission(address _owner) external returns(address) {
        SubmissionAVLTree new_SubmissionAVLTree = new SubmissionAVLTree(_owner);
        return address(new_SubmissionAVLTree);
    }
}