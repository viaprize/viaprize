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

    enum DonationType {
        GIFT,
        PAYMENT
    }
    enum TokenType {
        NFT,
        TOKEN
    }

    event SubmissionCreated(address indexed contestant, bytes32 indexed submissionHash);
    event CampaignCreated(address indexed proposer, address indexed contractAddress);
    event Voted(bytes32 indexed votedTo, address indexed votedBy, uint256 amountVoted);
    event Donation(address indexed donator ,address indexed token_or_nft, DonationType  indexed _donationType, TokenType _tokenType, bool _isFiat, uint256 amount);
    event DisputeRaised(bytes32 indexed _submissionHash, address indexed _contestant);
    event fiatFunderRefund(address indexed _address, uint256 _amount, bool refunded);
    event SubmissionStarted(uint256 indexed startedAt, uint256 indexed Deadline);
    event SubmissionEnded(uint256 indexed endedAt);
    event VotingStarted(uint256 indexed startedAt, uint256 indexed Deadline);
    event VotingEnded(uint256 indexed endedAt);
    event DisputeEnded(uint256 indexed endedAt);
}
