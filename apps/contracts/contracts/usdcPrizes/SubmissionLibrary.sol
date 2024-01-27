/// @notice  SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./SubmissionAVLTree.sol";
library SubmissionLibrary {
    function deploySubmission() external returns(address) {
        SubmissionAVLTree new_SubmissionAVLTree = new SubmissionAVLTree();
        return address(new_SubmissionAVLTree);
    }
}