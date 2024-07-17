// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

library ErrorLibrary {
        /// @notice error for not enough funds to vote
    error NotEnoughFunds();

    error NotActive();
    error NR();
    error NP();
    error NPP();
    error DPNA();
    error NAS();
    error CAE();
    error VMPPEIL();
    error NAF();
    error SS();
    error LM();

    /// @notice error for trying to change someone elses vote
    error NotYourVote();

    /// @notice if distribution has already happened
    error RewardsAlreadyDistributed();

    /// @notice error for trying to vote on a submission that has not been made
    error SubmissionDoesntExist();

    /// @notice error for when the submission period is not active
    error SubmissionPeriodActive();

    /// @notice error for when the submission period is not active
    error SubmissionPeriodNotActive();

    /// @notice error for when the voting period is not active
    error VotingPeriodNotActive();

    /// @notice error for trying to claim a refund when the voting period is still active
    error VotingPeriodActive();
}
