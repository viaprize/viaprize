// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

library ErrorAndEventsLibrary {

    /// @notice Error when trying to donate a zero amount.
    error NotEnoughFunds();
    
    /// @notice Error when trying to access any function after the campaign has ended.
    error NotActive();
    
    /// @notice Error indicating the caller is not a Platform Admin.
    error NP();
    
    /// @notice Error indicating the caller is neither a Platform Admin nor a Proposer.
    error NPP();
    
    /// @notice Error indicating that the dispute period is not active.
    error DPNA();
    
    /// @notice Error indicating that the caller is not a Contestant.
    error NAC();
    
    /// @notice Error indicating that the Contestant already exists, triggered when the same Contestant tries to submit again.
    error CAE();
    
    /// @notice Error due to a votes mismatch, likely caused by a logical error such as overflow or underflow.
    error VMPPEIL();
    
    /// @notice Error indicating the caller is not a Funder, triggered when someone other than a Funder tries to vote.
    error NAF();
    
    /// @notice Error indicating an attempt to change a vote to the same submission.
    error SS();
    
    /// @notice Error due to a length mismatch, triggered when the length of submissions and amounts do not match while calling the dispute change vote function.
    error LM();
    
    /// @notice Error indicating an attempt to change someone else's vote.
    error NotYourVote();

    /// @notice Error triggered when rewards have already been distributed.
    error RewardsAlreadyDistributed();

    /// @notice Error indicating an attempt to vote on a non-existent submission.
    error SubmissionDoesntExist();

    /// @notice Error triggered when the submission period is active.
    error SubmissionPeriodActive();

    /// @notice Error triggered when the submission period is not active.
    error SubmissionPeriodNotActive();

    /// @notice Error triggered when the voting period is not active.
    error VotingPeriodNotActive();

    /// @notice Error indicating an attempt to claim a refund while the voting period is still active.
    error VotingPeriodActive();

    /// @notice Specifies the type of the donation, either GIFT or PAYMENT.
    enum DonationType {
        GIFT,
        PAYMENT
    }

    /// @notice Specifies the type of token, either ERC20 or ERC721.
    enum TokenType {
        NFT,
        TOKEN
    }

    /// @notice Events are triggered when specific changes occur in the contracts.
    /// @notice The event names are self-explanatory.
    event CampaignCreated(address indexed proposer, address indexed contractAddress);
    event Donation(address indexed donator, address indexed token_or_nft, DonationType indexed _donationType, TokenType _tokenType, bool _isFiat, uint256 amount);
    event SubmissionStarted(uint256 indexed startedAt, uint256 indexed Deadline);
    event SubmissionCreated(address indexed contestant, bytes32 indexed submissionHash);
    event SubmissionPeriodChanged(uint256 indexed changedAt, uint256 increasedBy, uint256 indexed Deadline);
    event SubmissionEnded(uint256 indexed endedAt);
    event VotingStarted(uint256 indexed startedAt, uint256 indexed Deadline);
    event Voted(bytes32 indexed votedTo, address indexed votedBy, uint256 amountVoted);
    event VotingPeriodChanged(uint256 indexed changedAt, uint256 increasedBy, uint256 indexed Deadline);
    event VotingEnded(uint256 indexed endedAt);
    event FunderRefund(address indexed _address, uint256 _amount, bool isFiat);
    event DisputeRaised(bytes32 indexed _submissionHash, address indexed _contestant);
    event DisputeEnded(uint256 indexed endedAt);
}
