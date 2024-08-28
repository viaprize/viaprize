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
    
    /// @notice Error indicating the caller is not a Funder, triggered when someone other than a Funder tries to vote.
    error NAF();

    /// @notice Error indicating the funding to the contract has ended
    error FundingToContractEnded();

    /// @notice Error triggered when rewards have already been distributed.
    error RewardsAlreadyDistributed();

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
    event AmountTransferred(address indexed to, address indexed from, uint256 _amount);
    event FiatFunderRefund(address indexed _address, uint256 _amount, bool refunded);
    event CryptoFunderRefunded(address indexed _address, uint256 _amount, bool refunded);
}