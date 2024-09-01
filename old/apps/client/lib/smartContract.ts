import {
  PrepareWriteContractConfig,
  WriteContractArgs,
  WriteContractMode,
  WriteContractPreparedArgs,
  WriteContractUnpreparedArgs,
  prepareWriteContract,
  writeContract,
} from 'wagmi/actions';

import {
  Address,
  UseContractReadConfig,
  UseContractWriteConfig,
  UsePrepareContractWriteConfig,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
} from 'wagmi';
import { PrepareWriteContractResult, ReadContractResult } from 'wagmi/actions';

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// PassThroughV2Factory
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const passThroughV2FactoryABI = [
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: '_id', internalType: 'uint256', type: 'uint256', indexed: true },
      { name: 'portalAddress', internalType: 'address', type: 'address', indexed: true },
    ],
    name: 'NewPortalCreated',
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: '_id', internalType: 'uint256', type: 'uint256' },
      { name: '_owner', internalType: 'address', type: 'address' },
      { name: '_admins', internalType: 'address[]', type: 'address[]' },
      { name: '_platformFee', internalType: 'uint256', type: 'uint256' },
      { name: '_tokenUsdc', internalType: 'address', type: 'address' },
      { name: '_bridgedTokenUsdc', internalType: 'address', type: 'address' },
      { name: '_wethToken', internalType: 'address', type: 'address' },
      { name: '_swapRouter', internalType: 'address', type: 'address' },
      { name: '_usdcToUsdcePool', internalType: 'address', type: 'address' },
      { name: '_usdcToEthPool', internalType: 'address', type: 'address' },
      { name: '_ethPriceAggregator', internalType: 'address', type: 'address' },
    ],
    name: 'createPortal',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
  },
] as const;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Portal
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const portalABI = [
  {
    stateMutability: 'nonpayable',
    type: 'constructor',
    inputs: [
      { name: '_proposers', internalType: 'address[]', type: 'address[]' },
      { name: '_admins', internalType: 'address[]', type: 'address[]' },
      { name: '_goal', internalType: 'uint256', type: 'uint256' },
      { name: '_deadline', internalType: 'uint256', type: 'uint256' },
      { name: '_allowDonationAboveGoalAmount', internalType: 'bool', type: 'bool' },
      { name: '_platformFee', internalType: 'uint256', type: 'uint256' },
      { name: '_allowImmediately', internalType: 'bool', type: 'bool' },
    ],
  },
  { type: 'error', inputs: [], name: 'CantEndKickstarterTypeCampaign' },
  { type: 'error', inputs: [], name: 'CantGetRefundForGoFundMeTypeCampaign' },
  { type: 'error', inputs: [], name: 'DeadlineNotMet' },
  { type: 'error', inputs: [], name: 'FundingToContractEnded' },
  { type: 'error', inputs: [], name: 'GoalAndDeadlineAlreadyMet' },
  { type: 'error', inputs: [], name: 'GoalAndDeadlineNotRequired' },
  { type: 'error', inputs: [], name: 'NotEnoughFunds' },
  { type: 'error', inputs: [], name: 'RequireGoalAndDeadline' },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'receiverAddress',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      { name: 'totalFunds', internalType: 'uint256', type: 'uint256', indexed: false },
      { name: 'totalRewards', internalType: 'uint256', type: 'uint256', indexed: false },
      { name: 'goalMet', internalType: 'bool', type: 'bool', indexed: false },
      {
        name: 'allowDonationsAboveGoalAmount',
        internalType: 'bool',
        type: 'bool',
        indexed: false,
      },
      { name: 'deadline', internalType: 'uint256', type: 'uint256', indexed: false },
      { name: 'goalAmount', internalType: 'uint256', type: 'uint256', indexed: false },
      { name: 'deadlineAvailable', internalType: 'bool', type: 'bool', indexed: false },
      { name: 'goalAmountAvailable', internalType: 'bool', type: 'bool', indexed: false },
    ],
    name: 'Values',
  },
  {
    stateMutability: 'payable',
    type: 'function',
    inputs: [],
    name: 'addFunds',
    outputs: [
      { name: '', internalType: 'uint256', type: 'uint256' },
      { name: '', internalType: 'uint256', type: 'uint256' },
      { name: '', internalType: 'uint256', type: 'uint256' },
      { name: '', internalType: 'bool', type: 'bool' },
      { name: '', internalType: 'bool', type: 'bool' },
      { name: '', internalType: 'bool', type: 'bool' },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    name: 'admins',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'allowDonationAboveGoalAmount',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'allowImmediately',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'deadline',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [],
    name: 'endCampaign',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [],
    name: 'endEarlyandRefund',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [],
    name: 'endKickStarterCampaign',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'goalAmount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'isActive',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'isAdmin',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'isPatron',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'isProposer',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'patronAmount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    name: 'patrons',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'platformAddress',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'platformFee',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    name: 'proposers',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'receiverAddress',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'refundPatronsAmount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'totalFunds',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'totalRewards',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  { stateMutability: 'payable', type: 'receive' },
] as const;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// PrizeFactoryV2
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * [__View Contract on Base Basescan__](https://basescan.org/address/0x3248830b677B43D18E2907e9a8267D47e0C98856)
 */
export const prizeFactoryV2ABI = [
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'id', internalType: 'uint256', type: 'uint256', indexed: true },
      {
        name: 'viaPrizeAddress',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'NewViaPrizeCreated',
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: '_id', internalType: 'uint256', type: 'uint256' },
      { name: '_proposer', internalType: 'address', type: 'address' },
      { name: '_platformAdmins', internalType: 'address[]', type: 'address[]' },
      { name: '_platFormFee', internalType: 'uint256', type: 'uint256' },
      { name: '_proposerFee', internalType: 'uint256', type: 'uint256' },
      { name: '_usdcAddress', internalType: 'address', type: 'address' },
    ],
    name: 'createViaPrize',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
  },
] as const;

/**
 * [__View Contract on Base Basescan__](https://basescan.org/address/0x3248830b677B43D18E2907e9a8267D47e0C98856)
 */
export const prizeFactoryV2Address = {
  8453: '0x3248830b677B43D18E2907e9a8267D47e0C98856',
} as const;

/**
 * [__View Contract on Base Basescan__](https://basescan.org/address/0x3248830b677B43D18E2907e9a8267D47e0C98856)
 */
export const prizeFactoryV2Config = {
  address: prizeFactoryV2Address,
  abi: prizeFactoryV2ABI,
} as const;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// PrizeV2
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const prizeV2ABI = [
  {
    stateMutability: 'nonpayable',
    type: 'constructor',
    inputs: [
      { name: '_proposer', internalType: 'address', type: 'address' },
      { name: '_platformAdmins', internalType: 'address[]', type: 'address[]' },
      { name: '_platFormFee', internalType: 'uint256', type: 'uint256' },
      { name: '_proposerFee', internalType: 'uint256', type: 'uint256' },
      { name: '_usdcAddress', internalType: 'address', type: 'address' },
    ],
  },
  { type: 'error', inputs: [], name: 'NotEnoughFunds' },
  { type: 'error', inputs: [], name: 'NotYourVote' },
  { type: 'error', inputs: [], name: 'RewardsAlreadyDistributed' },
  { type: 'error', inputs: [], name: 'SubmissionDoesntExist' },
  { type: 'error', inputs: [], name: 'SubmissionPeriodActive' },
  { type: 'error', inputs: [], name: 'SubmissionPeriodNotActive' },
  { type: 'error', inputs: [], name: 'VotingPeriodActive' },
  { type: 'error', inputs: [], name: 'VotingPeriodNotActive' },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'proposer', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'contractAddress',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'CampaignCreated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: '_submissionHash',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
      { name: '_contestant', internalType: 'address', type: 'address', indexed: true },
    ],
    name: 'DisputeRaised',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'donator', internalType: 'address', type: 'address', indexed: true },
      { name: 'token_or_nft', internalType: 'address', type: 'address', indexed: true },
      {
        name: '_donationType',
        internalType: 'enum PrizeV2.DonationType',
        type: 'uint8',
        indexed: true,
      },
      {
        name: '_tokenType',
        internalType: 'enum PrizeV2.TokenType',
        type: 'uint8',
        indexed: false,
      },
      { name: '_isFiat', internalType: 'bool', type: 'bool', indexed: false },
      { name: 'amount', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'Donation',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: '_address', internalType: 'address', type: 'address', indexed: true },
      { name: '_amount', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'FiatFunderRefund',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'contestant', internalType: 'address', type: 'address', indexed: true },
      { name: 'submissionHash', internalType: 'bytes32', type: 'bytes32', indexed: true },
    ],
    name: 'SubmissionCreated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'votedTo', internalType: 'bytes32', type: 'bytes32', indexed: true },
      { name: 'votedBy', internalType: 'address', type: 'address', indexed: true },
      { name: 'amountVoted', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'Voted',
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      { name: '_nonce', internalType: 'uint256', type: 'uint256' },
      { name: '_old_submission', internalType: 'bytes32', type: 'bytes32' },
      { name: '_amount', internalType: 'uint256', type: 'uint256' },
      { name: '_new_submission', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'CHANGE_VOTE_HASH',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      { name: '_nonce', internalType: 'uint256', type: 'uint256' },
      { name: '_submission', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'DISPUTE_HASH',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'PRECISION',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'REFUND_SUBMISSION_HASH',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'VERSION',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      { name: '_nonce', internalType: 'uint256', type: 'uint256' },
      { name: '_submission', internalType: 'bytes32', type: 'bytes32' },
      { name: '_amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'VOTE_HASH',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'contestant', internalType: 'address', type: 'address' },
      { name: 'submissionText', internalType: 'string', type: 'string' },
    ],
    name: 'addSubmission',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
  },
  {
    stateMutability: 'payable',
    type: 'function',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: '_amountUsdc', internalType: 'uint256', type: 'uint256' },
      { name: '_deadline', internalType: 'uint256', type: 'uint256' },
      { name: 'v', internalType: 'uint8', type: 'uint8' },
      { name: 's', internalType: 'bytes32', type: 'bytes32' },
      { name: 'r', internalType: 'bytes32', type: 'bytes32' },
      { name: '_ethSignedMessageHash', internalType: 'bytes32', type: 'bytes32' },
      { name: '_fiatPayment', internalType: 'bool', type: 'bool' },
    ],
    name: 'addUsdcFunds',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: '_submissionTime', internalType: 'uint256', type: 'uint256' }],
    name: 'changeSubmissionPeriod',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: '_previous_submissionHash', internalType: 'bytes32', type: 'bytes32' },
      { name: '_new_submissionHash', internalType: 'bytes32', type: 'bytes32' },
      { name: 'v', internalType: 'uint8', type: 'uint8' },
      { name: 's', internalType: 'bytes32', type: 'bytes32' },
      { name: 'r', internalType: 'bytes32', type: 'bytes32' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'changeVote',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: '_votingTime', internalType: 'uint256', type: 'uint256' }],
    name: 'changeVotingPeriod',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'cryptoFunderAmount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    name: 'cryptoFunders',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: '_previousSubmissionHash', internalType: 'bytes32', type: 'bytes32' },
      { name: '_newSubmissionHash', internalType: 'bytes32', type: 'bytes32' },
      { name: '_funders', internalType: 'address[]', type: 'address[]' },
      { name: '_amounts', internalType: 'uint256[]', type: 'uint256[]' },
    ],
    name: 'disputeChangeVote',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'disputePeriod',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'distributed',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [],
    name: 'endDispute',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [],
    name: 'endDisputePeriodEarly',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [],
    name: 'endSubmissionPeriod',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [],
    name: 'endVotingPeriod',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'fiatFunderAmount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    name: 'fiatFunders',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'funderVotes',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'getAllCryptoFunders',
    outputs: [{ name: '', internalType: 'address[]', type: 'address[]' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'getAllFiatFunders',
    outputs: [{ name: '', internalType: 'address[]', type: 'address[]' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'getAllPlatformAdmins',
    outputs: [{ name: '', internalType: 'address[]', type: 'address[]' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'getAllSubmissions',
    outputs: [
      {
        name: '',
        internalType: 'struct SubmissionAVLTree.SubmissionInfo[]',
        type: 'tuple[]',
        components: [
          { name: 'submissionHash', internalType: 'bytes32', type: 'bytes32' },
          { name: 'submissionText', internalType: 'string', type: 'string' },
          { name: 'usdcVotes', internalType: 'uint256', type: 'uint256' },
          { name: 'contestant', internalType: 'address', type: 'address' },
          { name: 'funded', internalType: 'bool', type: 'bool' },
          { name: 'height', internalType: 'int256', type: 'int256' },
          { name: 'left', internalType: 'uint256', type: 'uint256' },
          { name: 'right', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'submissionHash', internalType: 'bytes32', type: 'bytes32' }],
    name: 'getSubmissionByHash',
    outputs: [
      {
        name: '',
        internalType: 'struct SubmissionAVLTree.SubmissionInfo',
        type: 'tuple',
        components: [
          { name: 'submissionHash', internalType: 'bytes32', type: 'bytes32' },
          { name: 'submissionText', internalType: 'string', type: 'string' },
          { name: 'usdcVotes', internalType: 'uint256', type: 'uint256' },
          { name: 'contestant', internalType: 'address', type: 'address' },
          { name: 'funded', internalType: 'bool', type: 'bool' },
          { name: 'height', internalType: 'int256', type: 'int256' },
          { name: 'left', internalType: 'uint256', type: 'uint256' },
          { name: 'right', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'getSubmissionTime',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'getVotingTime',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'individualCryptoPercentage',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'individualFiatPercentage',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'isActive',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'isContestant',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'isCryptoFunder',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'isFiatFunder',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'isPlatformAdmin',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'isProposer',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'isRefundRequestedAddress',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'nonce',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'platformAddress',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    name: 'platformAdmins',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'platformFee',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'proposer',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'proposerFee',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: '_submissionHash', internalType: 'bytes32', type: 'bytes32' },
      { name: 'v', internalType: 'uint8', type: 'uint8' },
      { name: 's', internalType: 'bytes32', type: 'bytes32' },
      { name: 'r', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'raiseDispute',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'refundAddress',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    name: 'refundRequestedFunders',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'refunded',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: '_submissionTime', internalType: 'uint256', type: 'uint256' }],
    name: 'startSubmissionPeriod',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: '_votingTime', internalType: 'uint256', type: 'uint256' }],
    name: 'startVotingPeriod',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'submissionPeriod',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'totalFunderAmount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'totalFunds',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'totalRewards',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'totalVotes',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: '_submissionHash', internalType: 'bytes32', type: 'bytes32' },
      { name: '_amount', internalType: 'uint256', type: 'uint256' },
      { name: 'v', internalType: 'uint8', type: 'uint8' },
      { name: 's', internalType: 'bytes32', type: 'bytes32' },
      { name: 'r', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'vote',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'votingPeriod',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: '_tokenAddress', internalType: 'address', type: 'address' },
      { name: '_to', internalType: 'address', type: 'address' },
      { name: '_amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'withdrawTokens',
    outputs: [],
  },
] as const;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Core
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link passThroughV2FactoryABI}__.
 */
export function writePassThroughV2Factory<TFunctionName extends string>(
  config:
    | Omit<
        WriteContractPreparedArgs<typeof passThroughV2FactoryABI, TFunctionName>,
        'abi'
      >
    | Omit<
        WriteContractUnpreparedArgs<typeof passThroughV2FactoryABI, TFunctionName>,
        'abi'
      >,
) {
  return writeContract({
    abi: passThroughV2FactoryABI,
    ...config,
  } as unknown as WriteContractArgs<typeof passThroughV2FactoryABI, TFunctionName>);
}

/**
 * Wraps __{@link prepareWriteContract}__ with `abi` set to __{@link passThroughV2FactoryABI}__.
 */
export function prepareWritePassThroughV2Factory<
  TAbi extends readonly unknown[] = typeof passThroughV2FactoryABI,
  TFunctionName extends string = string,
>(config: Omit<PrepareWriteContractConfig<TAbi, TFunctionName>, 'abi'>) {
  return prepareWriteContract({
    abi: passThroughV2FactoryABI,
    ...config,
  } as unknown as PrepareWriteContractConfig<TAbi, TFunctionName>);
}

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link portalABI}__.
 */
export function writePortal<TFunctionName extends string>(
  config:
    | Omit<WriteContractPreparedArgs<typeof portalABI, TFunctionName>, 'abi'>
    | Omit<WriteContractUnpreparedArgs<typeof portalABI, TFunctionName>, 'abi'>,
) {
  return writeContract({ abi: portalABI, ...config } as unknown as WriteContractArgs<
    typeof portalABI,
    TFunctionName
  >);
}

/**
 * Wraps __{@link prepareWriteContract}__ with `abi` set to __{@link portalABI}__.
 */
export function prepareWritePortal<
  TAbi extends readonly unknown[] = typeof portalABI,
  TFunctionName extends string = string,
>(config: Omit<PrepareWriteContractConfig<TAbi, TFunctionName>, 'abi'>) {
  return prepareWriteContract({
    abi: portalABI,
    ...config,
  } as unknown as PrepareWriteContractConfig<TAbi, TFunctionName>);
}

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link prizeFactoryV2ABI}__.
 *
 * [__View Contract on Base Basescan__](https://basescan.org/address/0x3248830b677B43D18E2907e9a8267D47e0C98856)
 */
export function writePrizeFactoryV2<
  TFunctionName extends string,
  TMode extends WriteContractMode,
  TChainId extends number = keyof typeof prizeFactoryV2Address,
>(
  config:
    | (Omit<
        WriteContractPreparedArgs<typeof prizeFactoryV2ABI, TFunctionName>,
        'abi' | 'address'
      > & {
        mode: TMode;
        chainId?: TMode extends 'prepared'
          ? TChainId
          : keyof typeof prizeFactoryV2Address;
      })
    | (Omit<
        WriteContractUnpreparedArgs<typeof prizeFactoryV2ABI, TFunctionName>,
        'abi' | 'address'
      > & {
        mode: TMode;
        chainId?: TMode extends 'prepared'
          ? TChainId
          : keyof typeof prizeFactoryV2Address;
      }),
) {
  return writeContract({
    abi: prizeFactoryV2ABI,
    address: prizeFactoryV2Address[8453],
    ...config,
  } as unknown as WriteContractArgs<typeof prizeFactoryV2ABI, TFunctionName>);
}

/**
 * Wraps __{@link prepareWriteContract}__ with `abi` set to __{@link prizeFactoryV2ABI}__.
 *
 * [__View Contract on Base Basescan__](https://basescan.org/address/0x3248830b677B43D18E2907e9a8267D47e0C98856)
 */
export function prepareWritePrizeFactoryV2<
  TAbi extends readonly unknown[] = typeof prizeFactoryV2ABI,
  TFunctionName extends string = string,
>(
  config: Omit<PrepareWriteContractConfig<TAbi, TFunctionName>, 'abi' | 'address'> & {
    chainId?: keyof typeof prizeFactoryV2Address;
  },
) {
  return prepareWriteContract({
    abi: prizeFactoryV2ABI,
    address: prizeFactoryV2Address[8453],
    ...config,
  } as unknown as PrepareWriteContractConfig<TAbi, TFunctionName>);
}

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link prizeV2ABI}__.
 */
export function writePrizeV2<TFunctionName extends string>(
  config:
    | Omit<WriteContractPreparedArgs<typeof prizeV2ABI, TFunctionName>, 'abi'>
    | Omit<WriteContractUnpreparedArgs<typeof prizeV2ABI, TFunctionName>, 'abi'>,
) {
  return writeContract({ abi: prizeV2ABI, ...config } as unknown as WriteContractArgs<
    typeof prizeV2ABI,
    TFunctionName
  >);
}

/**
 * Wraps __{@link prepareWriteContract}__ with `abi` set to __{@link prizeV2ABI}__.
 */
export function prepareWritePrizeV2<
  TAbi extends readonly unknown[] = typeof prizeV2ABI,
  TFunctionName extends string = string,
>(config: Omit<PrepareWriteContractConfig<TAbi, TFunctionName>, 'abi'>) {
  return prepareWriteContract({
    abi: prizeV2ABI,
    ...config,
  } as unknown as PrepareWriteContractConfig<TAbi, TFunctionName>);
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// React
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link passThroughV2FactoryABI}__.
 */
export function usePassThroughV2FactoryWrite<
  TFunctionName extends string,
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof passThroughV2FactoryABI,
          string
        >['request']['abi'],
        TFunctionName,
        TMode
      >
    : UseContractWriteConfig<typeof passThroughV2FactoryABI, TFunctionName, TMode> & {
        abi?: never;
      } = {} as any,
) {
  return useContractWrite<typeof passThroughV2FactoryABI, TFunctionName, TMode>({
    abi: passThroughV2FactoryABI,
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link passThroughV2FactoryABI}__ and `functionName` set to `"createPortal"`.
 */
export function usePassThroughV2FactoryCreatePortal<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof passThroughV2FactoryABI,
          'createPortal'
        >['request']['abi'],
        'createPortal',
        TMode
      > & { functionName?: 'createPortal' }
    : UseContractWriteConfig<typeof passThroughV2FactoryABI, 'createPortal', TMode> & {
        abi?: never;
        functionName?: 'createPortal';
      } = {} as any,
) {
  return useContractWrite<typeof passThroughV2FactoryABI, 'createPortal', TMode>({
    abi: passThroughV2FactoryABI,
    functionName: 'createPortal',
    ...config,
  } as any);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link passThroughV2FactoryABI}__.
 */
export function usePreparePassThroughV2FactoryWrite<TFunctionName extends string>(
  config: Omit<
    UsePrepareContractWriteConfig<typeof passThroughV2FactoryABI, TFunctionName>,
    'abi'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: passThroughV2FactoryABI,
    ...config,
  } as UsePrepareContractWriteConfig<typeof passThroughV2FactoryABI, TFunctionName>);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link passThroughV2FactoryABI}__ and `functionName` set to `"createPortal"`.
 */
export function usePreparePassThroughV2FactoryCreatePortal(
  config: Omit<
    UsePrepareContractWriteConfig<typeof passThroughV2FactoryABI, 'createPortal'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: passThroughV2FactoryABI,
    functionName: 'createPortal',
    ...config,
  } as UsePrepareContractWriteConfig<typeof passThroughV2FactoryABI, 'createPortal'>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link portalABI}__.
 */
export function usePortalRead<
  TFunctionName extends string,
  TSelectData = ReadContractResult<typeof portalABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof portalABI, TFunctionName, TSelectData>,
    'abi'
  > = {} as any,
) {
  return useContractRead({ abi: portalABI, ...config } as UseContractReadConfig<
    typeof portalABI,
    TFunctionName,
    TSelectData
  >);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link portalABI}__ and `functionName` set to `"admins"`.
 */
export function usePortalAdmins<
  TFunctionName extends 'admins',
  TSelectData = ReadContractResult<typeof portalABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof portalABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: portalABI,
    functionName: 'admins',
    ...config,
  } as UseContractReadConfig<typeof portalABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link portalABI}__ and `functionName` set to `"allowDonationAboveGoalAmount"`.
 */
export function usePortalAllowDonationAboveGoalAmount<
  TFunctionName extends 'allowDonationAboveGoalAmount',
  TSelectData = ReadContractResult<typeof portalABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof portalABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: portalABI,
    functionName: 'allowDonationAboveGoalAmount',
    ...config,
  } as UseContractReadConfig<typeof portalABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link portalABI}__ and `functionName` set to `"allowImmediately"`.
 */
export function usePortalAllowImmediately<
  TFunctionName extends 'allowImmediately',
  TSelectData = ReadContractResult<typeof portalABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof portalABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: portalABI,
    functionName: 'allowImmediately',
    ...config,
  } as UseContractReadConfig<typeof portalABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link portalABI}__ and `functionName` set to `"deadline"`.
 */
export function usePortalDeadline<
  TFunctionName extends 'deadline',
  TSelectData = ReadContractResult<typeof portalABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof portalABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: portalABI,
    functionName: 'deadline',
    ...config,
  } as UseContractReadConfig<typeof portalABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link portalABI}__ and `functionName` set to `"goalAmount"`.
 */
export function usePortalGoalAmount<
  TFunctionName extends 'goalAmount',
  TSelectData = ReadContractResult<typeof portalABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof portalABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: portalABI,
    functionName: 'goalAmount',
    ...config,
  } as UseContractReadConfig<typeof portalABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link portalABI}__ and `functionName` set to `"isActive"`.
 */
export function usePortalIsActive<
  TFunctionName extends 'isActive',
  TSelectData = ReadContractResult<typeof portalABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof portalABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: portalABI,
    functionName: 'isActive',
    ...config,
  } as UseContractReadConfig<typeof portalABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link portalABI}__ and `functionName` set to `"isAdmin"`.
 */
export function usePortalIsAdmin<
  TFunctionName extends 'isAdmin',
  TSelectData = ReadContractResult<typeof portalABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof portalABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: portalABI,
    functionName: 'isAdmin',
    ...config,
  } as UseContractReadConfig<typeof portalABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link portalABI}__ and `functionName` set to `"isPatron"`.
 */
export function usePortalIsPatron<
  TFunctionName extends 'isPatron',
  TSelectData = ReadContractResult<typeof portalABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof portalABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: portalABI,
    functionName: 'isPatron',
    ...config,
  } as UseContractReadConfig<typeof portalABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link portalABI}__ and `functionName` set to `"isProposer"`.
 */
export function usePortalIsProposer<
  TFunctionName extends 'isProposer',
  TSelectData = ReadContractResult<typeof portalABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof portalABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: portalABI,
    functionName: 'isProposer',
    ...config,
  } as UseContractReadConfig<typeof portalABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link portalABI}__ and `functionName` set to `"patronAmount"`.
 */
export function usePortalPatronAmount<
  TFunctionName extends 'patronAmount',
  TSelectData = ReadContractResult<typeof portalABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof portalABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: portalABI,
    functionName: 'patronAmount',
    ...config,
  } as UseContractReadConfig<typeof portalABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link portalABI}__ and `functionName` set to `"patrons"`.
 */
export function usePortalPatrons<
  TFunctionName extends 'patrons',
  TSelectData = ReadContractResult<typeof portalABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof portalABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: portalABI,
    functionName: 'patrons',
    ...config,
  } as UseContractReadConfig<typeof portalABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link portalABI}__ and `functionName` set to `"platformAddress"`.
 */
export function usePortalPlatformAddress<
  TFunctionName extends 'platformAddress',
  TSelectData = ReadContractResult<typeof portalABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof portalABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: portalABI,
    functionName: 'platformAddress',
    ...config,
  } as UseContractReadConfig<typeof portalABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link portalABI}__ and `functionName` set to `"platformFee"`.
 */
export function usePortalPlatformFee<
  TFunctionName extends 'platformFee',
  TSelectData = ReadContractResult<typeof portalABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof portalABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: portalABI,
    functionName: 'platformFee',
    ...config,
  } as UseContractReadConfig<typeof portalABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link portalABI}__ and `functionName` set to `"proposers"`.
 */
export function usePortalProposers<
  TFunctionName extends 'proposers',
  TSelectData = ReadContractResult<typeof portalABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof portalABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: portalABI,
    functionName: 'proposers',
    ...config,
  } as UseContractReadConfig<typeof portalABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link portalABI}__ and `functionName` set to `"receiverAddress"`.
 */
export function usePortalReceiverAddress<
  TFunctionName extends 'receiverAddress',
  TSelectData = ReadContractResult<typeof portalABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof portalABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: portalABI,
    functionName: 'receiverAddress',
    ...config,
  } as UseContractReadConfig<typeof portalABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link portalABI}__ and `functionName` set to `"refundPatronsAmount"`.
 */
export function usePortalRefundPatronsAmount<
  TFunctionName extends 'refundPatronsAmount',
  TSelectData = ReadContractResult<typeof portalABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof portalABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: portalABI,
    functionName: 'refundPatronsAmount',
    ...config,
  } as UseContractReadConfig<typeof portalABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link portalABI}__ and `functionName` set to `"totalFunds"`.
 */
export function usePortalTotalFunds<
  TFunctionName extends 'totalFunds',
  TSelectData = ReadContractResult<typeof portalABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof portalABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: portalABI,
    functionName: 'totalFunds',
    ...config,
  } as UseContractReadConfig<typeof portalABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link portalABI}__ and `functionName` set to `"totalRewards"`.
 */
export function usePortalTotalRewards<
  TFunctionName extends 'totalRewards',
  TSelectData = ReadContractResult<typeof portalABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof portalABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: portalABI,
    functionName: 'totalRewards',
    ...config,
  } as UseContractReadConfig<typeof portalABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link portalABI}__.
 */
export function usePortalWrite<
  TFunctionName extends string,
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof portalABI, string>['request']['abi'],
        TFunctionName,
        TMode
      >
    : UseContractWriteConfig<typeof portalABI, TFunctionName, TMode> & {
        abi?: never;
      } = {} as any,
) {
  return useContractWrite<typeof portalABI, TFunctionName, TMode>({
    abi: portalABI,
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link portalABI}__ and `functionName` set to `"addFunds"`.
 */
export function usePortalAddFunds<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof portalABI, 'addFunds'>['request']['abi'],
        'addFunds',
        TMode
      > & { functionName?: 'addFunds' }
    : UseContractWriteConfig<typeof portalABI, 'addFunds', TMode> & {
        abi?: never;
        functionName?: 'addFunds';
      } = {} as any,
) {
  return useContractWrite<typeof portalABI, 'addFunds', TMode>({
    abi: portalABI,
    functionName: 'addFunds',
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link portalABI}__ and `functionName` set to `"endCampaign"`.
 */
export function usePortalEndCampaign<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof portalABI, 'endCampaign'>['request']['abi'],
        'endCampaign',
        TMode
      > & { functionName?: 'endCampaign' }
    : UseContractWriteConfig<typeof portalABI, 'endCampaign', TMode> & {
        abi?: never;
        functionName?: 'endCampaign';
      } = {} as any,
) {
  return useContractWrite<typeof portalABI, 'endCampaign', TMode>({
    abi: portalABI,
    functionName: 'endCampaign',
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link portalABI}__ and `functionName` set to `"endEarlyandRefund"`.
 */
export function usePortalEndEarlyandRefund<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof portalABI,
          'endEarlyandRefund'
        >['request']['abi'],
        'endEarlyandRefund',
        TMode
      > & { functionName?: 'endEarlyandRefund' }
    : UseContractWriteConfig<typeof portalABI, 'endEarlyandRefund', TMode> & {
        abi?: never;
        functionName?: 'endEarlyandRefund';
      } = {} as any,
) {
  return useContractWrite<typeof portalABI, 'endEarlyandRefund', TMode>({
    abi: portalABI,
    functionName: 'endEarlyandRefund',
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link portalABI}__ and `functionName` set to `"endKickStarterCampaign"`.
 */
export function usePortalEndKickStarterCampaign<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof portalABI,
          'endKickStarterCampaign'
        >['request']['abi'],
        'endKickStarterCampaign',
        TMode
      > & { functionName?: 'endKickStarterCampaign' }
    : UseContractWriteConfig<typeof portalABI, 'endKickStarterCampaign', TMode> & {
        abi?: never;
        functionName?: 'endKickStarterCampaign';
      } = {} as any,
) {
  return useContractWrite<typeof portalABI, 'endKickStarterCampaign', TMode>({
    abi: portalABI,
    functionName: 'endKickStarterCampaign',
    ...config,
  } as any);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link portalABI}__.
 */
export function usePreparePortalWrite<TFunctionName extends string>(
  config: Omit<
    UsePrepareContractWriteConfig<typeof portalABI, TFunctionName>,
    'abi'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: portalABI,
    ...config,
  } as UsePrepareContractWriteConfig<typeof portalABI, TFunctionName>);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link portalABI}__ and `functionName` set to `"addFunds"`.
 */
export function usePreparePortalAddFunds(
  config: Omit<
    UsePrepareContractWriteConfig<typeof portalABI, 'addFunds'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: portalABI,
    functionName: 'addFunds',
    ...config,
  } as UsePrepareContractWriteConfig<typeof portalABI, 'addFunds'>);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link portalABI}__ and `functionName` set to `"endCampaign"`.
 */
export function usePreparePortalEndCampaign(
  config: Omit<
    UsePrepareContractWriteConfig<typeof portalABI, 'endCampaign'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: portalABI,
    functionName: 'endCampaign',
    ...config,
  } as UsePrepareContractWriteConfig<typeof portalABI, 'endCampaign'>);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link portalABI}__ and `functionName` set to `"endEarlyandRefund"`.
 */
export function usePreparePortalEndEarlyandRefund(
  config: Omit<
    UsePrepareContractWriteConfig<typeof portalABI, 'endEarlyandRefund'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: portalABI,
    functionName: 'endEarlyandRefund',
    ...config,
  } as UsePrepareContractWriteConfig<typeof portalABI, 'endEarlyandRefund'>);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link portalABI}__ and `functionName` set to `"endKickStarterCampaign"`.
 */
export function usePreparePortalEndKickStarterCampaign(
  config: Omit<
    UsePrepareContractWriteConfig<typeof portalABI, 'endKickStarterCampaign'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: portalABI,
    functionName: 'endKickStarterCampaign',
    ...config,
  } as UsePrepareContractWriteConfig<typeof portalABI, 'endKickStarterCampaign'>);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link prizeFactoryV2ABI}__.
 *
 * [__View Contract on Base Basescan__](https://basescan.org/address/0x3248830b677B43D18E2907e9a8267D47e0C98856)
 */
export function usePrizeFactoryV2Write<
  TFunctionName extends string,
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof prizeFactoryV2Address,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof prizeFactoryV2ABI, string>['request']['abi'],
        TFunctionName,
        TMode
      > & { address?: Address; chainId?: TChainId }
    : UseContractWriteConfig<typeof prizeFactoryV2ABI, TFunctionName, TMode> & {
        abi?: never;
        address?: never;
        chainId?: TChainId;
      } = {} as any,
) {
  return useContractWrite<typeof prizeFactoryV2ABI, TFunctionName, TMode>({
    abi: prizeFactoryV2ABI,
    address: prizeFactoryV2Address[8453],
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link prizeFactoryV2ABI}__ and `functionName` set to `"createViaPrize"`.
 *
 * [__View Contract on Base Basescan__](https://basescan.org/address/0x3248830b677B43D18E2907e9a8267D47e0C98856)
 */
export function usePrizeFactoryV2CreateViaPrize<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof prizeFactoryV2Address,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof prizeFactoryV2ABI,
          'createViaPrize'
        >['request']['abi'],
        'createViaPrize',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'createViaPrize' }
    : UseContractWriteConfig<typeof prizeFactoryV2ABI, 'createViaPrize', TMode> & {
        abi?: never;
        address?: never;
        chainId?: TChainId;
        functionName?: 'createViaPrize';
      } = {} as any,
) {
  return useContractWrite<typeof prizeFactoryV2ABI, 'createViaPrize', TMode>({
    abi: prizeFactoryV2ABI,
    address: prizeFactoryV2Address[8453],
    functionName: 'createViaPrize',
    ...config,
  } as any);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link prizeFactoryV2ABI}__.
 *
 * [__View Contract on Base Basescan__](https://basescan.org/address/0x3248830b677B43D18E2907e9a8267D47e0C98856)
 */
export function usePreparePrizeFactoryV2Write<TFunctionName extends string>(
  config: Omit<
    UsePrepareContractWriteConfig<typeof prizeFactoryV2ABI, TFunctionName>,
    'abi' | 'address'
  > & { chainId?: keyof typeof prizeFactoryV2Address } = {} as any,
) {
  return usePrepareContractWrite({
    abi: prizeFactoryV2ABI,
    address: prizeFactoryV2Address[8453],
    ...config,
  } as UsePrepareContractWriteConfig<typeof prizeFactoryV2ABI, TFunctionName>);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link prizeFactoryV2ABI}__ and `functionName` set to `"createViaPrize"`.
 *
 * [__View Contract on Base Basescan__](https://basescan.org/address/0x3248830b677B43D18E2907e9a8267D47e0C98856)
 */
export function usePreparePrizeFactoryV2CreateViaPrize(
  config: Omit<
    UsePrepareContractWriteConfig<typeof prizeFactoryV2ABI, 'createViaPrize'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof prizeFactoryV2Address } = {} as any,
) {
  return usePrepareContractWrite({
    abi: prizeFactoryV2ABI,
    address: prizeFactoryV2Address[8453],
    functionName: 'createViaPrize',
    ...config,
  } as UsePrepareContractWriteConfig<typeof prizeFactoryV2ABI, 'createViaPrize'>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link prizeV2ABI}__.
 */
export function usePrizeV2Read<
  TFunctionName extends string,
  TSelectData = ReadContractResult<typeof prizeV2ABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof prizeV2ABI, TFunctionName, TSelectData>,
    'abi'
  > = {} as any,
) {
  return useContractRead({ abi: prizeV2ABI, ...config } as UseContractReadConfig<
    typeof prizeV2ABI,
    TFunctionName,
    TSelectData
  >);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link prizeV2ABI}__ and `functionName` set to `"CHANGE_VOTE_HASH"`.
 */
export function usePrizeV2ChangeVoteHash<
  TFunctionName extends 'CHANGE_VOTE_HASH',
  TSelectData = ReadContractResult<typeof prizeV2ABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof prizeV2ABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: prizeV2ABI,
    functionName: 'CHANGE_VOTE_HASH',
    ...config,
  } as UseContractReadConfig<typeof prizeV2ABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link prizeV2ABI}__ and `functionName` set to `"DISPUTE_HASH"`.
 */
export function usePrizeV2DisputeHash<
  TFunctionName extends 'DISPUTE_HASH',
  TSelectData = ReadContractResult<typeof prizeV2ABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof prizeV2ABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: prizeV2ABI,
    functionName: 'DISPUTE_HASH',
    ...config,
  } as UseContractReadConfig<typeof prizeV2ABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link prizeV2ABI}__ and `functionName` set to `"PRECISION"`.
 */
export function usePrizeV2Precision<
  TFunctionName extends 'PRECISION',
  TSelectData = ReadContractResult<typeof prizeV2ABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof prizeV2ABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: prizeV2ABI,
    functionName: 'PRECISION',
    ...config,
  } as UseContractReadConfig<typeof prizeV2ABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link prizeV2ABI}__ and `functionName` set to `"REFUND_SUBMISSION_HASH"`.
 */
export function usePrizeV2RefundSubmissionHash<
  TFunctionName extends 'REFUND_SUBMISSION_HASH',
  TSelectData = ReadContractResult<typeof prizeV2ABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof prizeV2ABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: prizeV2ABI,
    functionName: 'REFUND_SUBMISSION_HASH',
    ...config,
  } as UseContractReadConfig<typeof prizeV2ABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link prizeV2ABI}__ and `functionName` set to `"VERSION"`.
 */
export function usePrizeV2Version<
  TFunctionName extends 'VERSION',
  TSelectData = ReadContractResult<typeof prizeV2ABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof prizeV2ABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: prizeV2ABI,
    functionName: 'VERSION',
    ...config,
  } as UseContractReadConfig<typeof prizeV2ABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link prizeV2ABI}__ and `functionName` set to `"VOTE_HASH"`.
 */
export function usePrizeV2VoteHash<
  TFunctionName extends 'VOTE_HASH',
  TSelectData = ReadContractResult<typeof prizeV2ABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof prizeV2ABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: prizeV2ABI,
    functionName: 'VOTE_HASH',
    ...config,
  } as UseContractReadConfig<typeof prizeV2ABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link prizeV2ABI}__ and `functionName` set to `"cryptoFunderAmount"`.
 */
export function usePrizeV2CryptoFunderAmount<
  TFunctionName extends 'cryptoFunderAmount',
  TSelectData = ReadContractResult<typeof prizeV2ABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof prizeV2ABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: prizeV2ABI,
    functionName: 'cryptoFunderAmount',
    ...config,
  } as UseContractReadConfig<typeof prizeV2ABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link prizeV2ABI}__ and `functionName` set to `"cryptoFunders"`.
 */
export function usePrizeV2CryptoFunders<
  TFunctionName extends 'cryptoFunders',
  TSelectData = ReadContractResult<typeof prizeV2ABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof prizeV2ABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: prizeV2ABI,
    functionName: 'cryptoFunders',
    ...config,
  } as UseContractReadConfig<typeof prizeV2ABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link prizeV2ABI}__ and `functionName` set to `"disputePeriod"`.
 */
export function usePrizeV2DisputePeriod<
  TFunctionName extends 'disputePeriod',
  TSelectData = ReadContractResult<typeof prizeV2ABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof prizeV2ABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: prizeV2ABI,
    functionName: 'disputePeriod',
    ...config,
  } as UseContractReadConfig<typeof prizeV2ABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link prizeV2ABI}__ and `functionName` set to `"distributed"`.
 */
export function usePrizeV2Distributed<
  TFunctionName extends 'distributed',
  TSelectData = ReadContractResult<typeof prizeV2ABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof prizeV2ABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: prizeV2ABI,
    functionName: 'distributed',
    ...config,
  } as UseContractReadConfig<typeof prizeV2ABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link prizeV2ABI}__ and `functionName` set to `"fiatFunderAmount"`.
 */
export function usePrizeV2FiatFunderAmount<
  TFunctionName extends 'fiatFunderAmount',
  TSelectData = ReadContractResult<typeof prizeV2ABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof prizeV2ABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: prizeV2ABI,
    functionName: 'fiatFunderAmount',
    ...config,
  } as UseContractReadConfig<typeof prizeV2ABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link prizeV2ABI}__ and `functionName` set to `"fiatFunders"`.
 */
export function usePrizeV2FiatFunders<
  TFunctionName extends 'fiatFunders',
  TSelectData = ReadContractResult<typeof prizeV2ABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof prizeV2ABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: prizeV2ABI,
    functionName: 'fiatFunders',
    ...config,
  } as UseContractReadConfig<typeof prizeV2ABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link prizeV2ABI}__ and `functionName` set to `"funderVotes"`.
 */
export function usePrizeV2FunderVotes<
  TFunctionName extends 'funderVotes',
  TSelectData = ReadContractResult<typeof prizeV2ABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof prizeV2ABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: prizeV2ABI,
    functionName: 'funderVotes',
    ...config,
  } as UseContractReadConfig<typeof prizeV2ABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link prizeV2ABI}__ and `functionName` set to `"getAllCryptoFunders"`.
 */
export function usePrizeV2GetAllCryptoFunders<
  TFunctionName extends 'getAllCryptoFunders',
  TSelectData = ReadContractResult<typeof prizeV2ABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof prizeV2ABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: prizeV2ABI,
    functionName: 'getAllCryptoFunders',
    ...config,
  } as UseContractReadConfig<typeof prizeV2ABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link prizeV2ABI}__ and `functionName` set to `"getAllFiatFunders"`.
 */
export function usePrizeV2GetAllFiatFunders<
  TFunctionName extends 'getAllFiatFunders',
  TSelectData = ReadContractResult<typeof prizeV2ABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof prizeV2ABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: prizeV2ABI,
    functionName: 'getAllFiatFunders',
    ...config,
  } as UseContractReadConfig<typeof prizeV2ABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link prizeV2ABI}__ and `functionName` set to `"getAllPlatformAdmins"`.
 */
export function usePrizeV2GetAllPlatformAdmins<
  TFunctionName extends 'getAllPlatformAdmins',
  TSelectData = ReadContractResult<typeof prizeV2ABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof prizeV2ABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: prizeV2ABI,
    functionName: 'getAllPlatformAdmins',
    ...config,
  } as UseContractReadConfig<typeof prizeV2ABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link prizeV2ABI}__ and `functionName` set to `"getAllSubmissions"`.
 */
export function usePrizeV2GetAllSubmissions<
  TFunctionName extends 'getAllSubmissions',
  TSelectData = ReadContractResult<typeof prizeV2ABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof prizeV2ABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: prizeV2ABI,
    functionName: 'getAllSubmissions',
    ...config,
  } as UseContractReadConfig<typeof prizeV2ABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link prizeV2ABI}__ and `functionName` set to `"getSubmissionByHash"`.
 */
export function usePrizeV2GetSubmissionByHash<
  TFunctionName extends 'getSubmissionByHash',
  TSelectData = ReadContractResult<typeof prizeV2ABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof prizeV2ABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: prizeV2ABI,
    functionName: 'getSubmissionByHash',
    ...config,
  } as UseContractReadConfig<typeof prizeV2ABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link prizeV2ABI}__ and `functionName` set to `"getSubmissionTime"`.
 */
export function usePrizeV2GetSubmissionTime<
  TFunctionName extends 'getSubmissionTime',
  TSelectData = ReadContractResult<typeof prizeV2ABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof prizeV2ABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: prizeV2ABI,
    functionName: 'getSubmissionTime',
    ...config,
  } as UseContractReadConfig<typeof prizeV2ABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link prizeV2ABI}__ and `functionName` set to `"getVotingTime"`.
 */
export function usePrizeV2GetVotingTime<
  TFunctionName extends 'getVotingTime',
  TSelectData = ReadContractResult<typeof prizeV2ABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof prizeV2ABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: prizeV2ABI,
    functionName: 'getVotingTime',
    ...config,
  } as UseContractReadConfig<typeof prizeV2ABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link prizeV2ABI}__ and `functionName` set to `"individualCryptoPercentage"`.
 */
export function usePrizeV2IndividualCryptoPercentage<
  TFunctionName extends 'individualCryptoPercentage',
  TSelectData = ReadContractResult<typeof prizeV2ABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof prizeV2ABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: prizeV2ABI,
    functionName: 'individualCryptoPercentage',
    ...config,
  } as UseContractReadConfig<typeof prizeV2ABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link prizeV2ABI}__ and `functionName` set to `"individualFiatPercentage"`.
 */
export function usePrizeV2IndividualFiatPercentage<
  TFunctionName extends 'individualFiatPercentage',
  TSelectData = ReadContractResult<typeof prizeV2ABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof prizeV2ABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: prizeV2ABI,
    functionName: 'individualFiatPercentage',
    ...config,
  } as UseContractReadConfig<typeof prizeV2ABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link prizeV2ABI}__ and `functionName` set to `"isActive"`.
 */
export function usePrizeV2IsActive<
  TFunctionName extends 'isActive',
  TSelectData = ReadContractResult<typeof prizeV2ABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof prizeV2ABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: prizeV2ABI,
    functionName: 'isActive',
    ...config,
  } as UseContractReadConfig<typeof prizeV2ABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link prizeV2ABI}__ and `functionName` set to `"isContestant"`.
 */
export function usePrizeV2IsContestant<
  TFunctionName extends 'isContestant',
  TSelectData = ReadContractResult<typeof prizeV2ABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof prizeV2ABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: prizeV2ABI,
    functionName: 'isContestant',
    ...config,
  } as UseContractReadConfig<typeof prizeV2ABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link prizeV2ABI}__ and `functionName` set to `"isCryptoFunder"`.
 */
export function usePrizeV2IsCryptoFunder<
  TFunctionName extends 'isCryptoFunder',
  TSelectData = ReadContractResult<typeof prizeV2ABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof prizeV2ABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: prizeV2ABI,
    functionName: 'isCryptoFunder',
    ...config,
  } as UseContractReadConfig<typeof prizeV2ABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link prizeV2ABI}__ and `functionName` set to `"isFiatFunder"`.
 */
export function usePrizeV2IsFiatFunder<
  TFunctionName extends 'isFiatFunder',
  TSelectData = ReadContractResult<typeof prizeV2ABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof prizeV2ABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: prizeV2ABI,
    functionName: 'isFiatFunder',
    ...config,
  } as UseContractReadConfig<typeof prizeV2ABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link prizeV2ABI}__ and `functionName` set to `"isPlatformAdmin"`.
 */
export function usePrizeV2IsPlatformAdmin<
  TFunctionName extends 'isPlatformAdmin',
  TSelectData = ReadContractResult<typeof prizeV2ABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof prizeV2ABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: prizeV2ABI,
    functionName: 'isPlatformAdmin',
    ...config,
  } as UseContractReadConfig<typeof prizeV2ABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link prizeV2ABI}__ and `functionName` set to `"isProposer"`.
 */
export function usePrizeV2IsProposer<
  TFunctionName extends 'isProposer',
  TSelectData = ReadContractResult<typeof prizeV2ABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof prizeV2ABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: prizeV2ABI,
    functionName: 'isProposer',
    ...config,
  } as UseContractReadConfig<typeof prizeV2ABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link prizeV2ABI}__ and `functionName` set to `"isRefundRequestedAddress"`.
 */
export function usePrizeV2IsRefundRequestedAddress<
  TFunctionName extends 'isRefundRequestedAddress',
  TSelectData = ReadContractResult<typeof prizeV2ABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof prizeV2ABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: prizeV2ABI,
    functionName: 'isRefundRequestedAddress',
    ...config,
  } as UseContractReadConfig<typeof prizeV2ABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link prizeV2ABI}__ and `functionName` set to `"nonce"`.
 */
export function usePrizeV2Nonce<
  TFunctionName extends 'nonce',
  TSelectData = ReadContractResult<typeof prizeV2ABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof prizeV2ABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: prizeV2ABI,
    functionName: 'nonce',
    ...config,
  } as UseContractReadConfig<typeof prizeV2ABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link prizeV2ABI}__ and `functionName` set to `"platformAddress"`.
 */
export function usePrizeV2PlatformAddress<
  TFunctionName extends 'platformAddress',
  TSelectData = ReadContractResult<typeof prizeV2ABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof prizeV2ABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: prizeV2ABI,
    functionName: 'platformAddress',
    ...config,
  } as UseContractReadConfig<typeof prizeV2ABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link prizeV2ABI}__ and `functionName` set to `"platformAdmins"`.
 */
export function usePrizeV2PlatformAdmins<
  TFunctionName extends 'platformAdmins',
  TSelectData = ReadContractResult<typeof prizeV2ABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof prizeV2ABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: prizeV2ABI,
    functionName: 'platformAdmins',
    ...config,
  } as UseContractReadConfig<typeof prizeV2ABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link prizeV2ABI}__ and `functionName` set to `"platformFee"`.
 */
export function usePrizeV2PlatformFee<
  TFunctionName extends 'platformFee',
  TSelectData = ReadContractResult<typeof prizeV2ABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof prizeV2ABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: prizeV2ABI,
    functionName: 'platformFee',
    ...config,
  } as UseContractReadConfig<typeof prizeV2ABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link prizeV2ABI}__ and `functionName` set to `"proposer"`.
 */
export function usePrizeV2Proposer<
  TFunctionName extends 'proposer',
  TSelectData = ReadContractResult<typeof prizeV2ABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof prizeV2ABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: prizeV2ABI,
    functionName: 'proposer',
    ...config,
  } as UseContractReadConfig<typeof prizeV2ABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link prizeV2ABI}__ and `functionName` set to `"proposerFee"`.
 */
export function usePrizeV2ProposerFee<
  TFunctionName extends 'proposerFee',
  TSelectData = ReadContractResult<typeof prizeV2ABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof prizeV2ABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: prizeV2ABI,
    functionName: 'proposerFee',
    ...config,
  } as UseContractReadConfig<typeof prizeV2ABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link prizeV2ABI}__ and `functionName` set to `"refundAddress"`.
 */
export function usePrizeV2RefundAddress<
  TFunctionName extends 'refundAddress',
  TSelectData = ReadContractResult<typeof prizeV2ABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof prizeV2ABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: prizeV2ABI,
    functionName: 'refundAddress',
    ...config,
  } as UseContractReadConfig<typeof prizeV2ABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link prizeV2ABI}__ and `functionName` set to `"refundRequestedFunders"`.
 */
export function usePrizeV2RefundRequestedFunders<
  TFunctionName extends 'refundRequestedFunders',
  TSelectData = ReadContractResult<typeof prizeV2ABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof prizeV2ABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: prizeV2ABI,
    functionName: 'refundRequestedFunders',
    ...config,
  } as UseContractReadConfig<typeof prizeV2ABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link prizeV2ABI}__ and `functionName` set to `"refunded"`.
 */
export function usePrizeV2Refunded<
  TFunctionName extends 'refunded',
  TSelectData = ReadContractResult<typeof prizeV2ABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof prizeV2ABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: prizeV2ABI,
    functionName: 'refunded',
    ...config,
  } as UseContractReadConfig<typeof prizeV2ABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link prizeV2ABI}__ and `functionName` set to `"submissionPeriod"`.
 */
export function usePrizeV2SubmissionPeriod<
  TFunctionName extends 'submissionPeriod',
  TSelectData = ReadContractResult<typeof prizeV2ABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof prizeV2ABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: prizeV2ABI,
    functionName: 'submissionPeriod',
    ...config,
  } as UseContractReadConfig<typeof prizeV2ABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link prizeV2ABI}__ and `functionName` set to `"totalFunderAmount"`.
 */
export function usePrizeV2TotalFunderAmount<
  TFunctionName extends 'totalFunderAmount',
  TSelectData = ReadContractResult<typeof prizeV2ABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof prizeV2ABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: prizeV2ABI,
    functionName: 'totalFunderAmount',
    ...config,
  } as UseContractReadConfig<typeof prizeV2ABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link prizeV2ABI}__ and `functionName` set to `"totalFunds"`.
 */
export function usePrizeV2TotalFunds<
  TFunctionName extends 'totalFunds',
  TSelectData = ReadContractResult<typeof prizeV2ABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof prizeV2ABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: prizeV2ABI,
    functionName: 'totalFunds',
    ...config,
  } as UseContractReadConfig<typeof prizeV2ABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link prizeV2ABI}__ and `functionName` set to `"totalRewards"`.
 */
export function usePrizeV2TotalRewards<
  TFunctionName extends 'totalRewards',
  TSelectData = ReadContractResult<typeof prizeV2ABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof prizeV2ABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: prizeV2ABI,
    functionName: 'totalRewards',
    ...config,
  } as UseContractReadConfig<typeof prizeV2ABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link prizeV2ABI}__ and `functionName` set to `"totalVotes"`.
 */
export function usePrizeV2TotalVotes<
  TFunctionName extends 'totalVotes',
  TSelectData = ReadContractResult<typeof prizeV2ABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof prizeV2ABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: prizeV2ABI,
    functionName: 'totalVotes',
    ...config,
  } as UseContractReadConfig<typeof prizeV2ABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link prizeV2ABI}__ and `functionName` set to `"votingPeriod"`.
 */
export function usePrizeV2VotingPeriod<
  TFunctionName extends 'votingPeriod',
  TSelectData = ReadContractResult<typeof prizeV2ABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof prizeV2ABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: prizeV2ABI,
    functionName: 'votingPeriod',
    ...config,
  } as UseContractReadConfig<typeof prizeV2ABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link prizeV2ABI}__.
 */
export function usePrizeV2Write<
  TFunctionName extends string,
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof prizeV2ABI, string>['request']['abi'],
        TFunctionName,
        TMode
      >
    : UseContractWriteConfig<typeof prizeV2ABI, TFunctionName, TMode> & {
        abi?: never;
      } = {} as any,
) {
  return useContractWrite<typeof prizeV2ABI, TFunctionName, TMode>({
    abi: prizeV2ABI,
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link prizeV2ABI}__ and `functionName` set to `"addSubmission"`.
 */
export function usePrizeV2AddSubmission<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof prizeV2ABI, 'addSubmission'>['request']['abi'],
        'addSubmission',
        TMode
      > & { functionName?: 'addSubmission' }
    : UseContractWriteConfig<typeof prizeV2ABI, 'addSubmission', TMode> & {
        abi?: never;
        functionName?: 'addSubmission';
      } = {} as any,
) {
  return useContractWrite<typeof prizeV2ABI, 'addSubmission', TMode>({
    abi: prizeV2ABI,
    functionName: 'addSubmission',
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link prizeV2ABI}__ and `functionName` set to `"addUsdcFunds"`.
 */
export function usePrizeV2AddUsdcFunds<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof prizeV2ABI, 'addUsdcFunds'>['request']['abi'],
        'addUsdcFunds',
        TMode
      > & { functionName?: 'addUsdcFunds' }
    : UseContractWriteConfig<typeof prizeV2ABI, 'addUsdcFunds', TMode> & {
        abi?: never;
        functionName?: 'addUsdcFunds';
      } = {} as any,
) {
  return useContractWrite<typeof prizeV2ABI, 'addUsdcFunds', TMode>({
    abi: prizeV2ABI,
    functionName: 'addUsdcFunds',
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link prizeV2ABI}__ and `functionName` set to `"changeSubmissionPeriod"`.
 */
export function usePrizeV2ChangeSubmissionPeriod<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof prizeV2ABI,
          'changeSubmissionPeriod'
        >['request']['abi'],
        'changeSubmissionPeriod',
        TMode
      > & { functionName?: 'changeSubmissionPeriod' }
    : UseContractWriteConfig<typeof prizeV2ABI, 'changeSubmissionPeriod', TMode> & {
        abi?: never;
        functionName?: 'changeSubmissionPeriod';
      } = {} as any,
) {
  return useContractWrite<typeof prizeV2ABI, 'changeSubmissionPeriod', TMode>({
    abi: prizeV2ABI,
    functionName: 'changeSubmissionPeriod',
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link prizeV2ABI}__ and `functionName` set to `"changeVote"`.
 */
export function usePrizeV2ChangeVote<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof prizeV2ABI, 'changeVote'>['request']['abi'],
        'changeVote',
        TMode
      > & { functionName?: 'changeVote' }
    : UseContractWriteConfig<typeof prizeV2ABI, 'changeVote', TMode> & {
        abi?: never;
        functionName?: 'changeVote';
      } = {} as any,
) {
  return useContractWrite<typeof prizeV2ABI, 'changeVote', TMode>({
    abi: prizeV2ABI,
    functionName: 'changeVote',
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link prizeV2ABI}__ and `functionName` set to `"changeVotingPeriod"`.
 */
export function usePrizeV2ChangeVotingPeriod<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof prizeV2ABI,
          'changeVotingPeriod'
        >['request']['abi'],
        'changeVotingPeriod',
        TMode
      > & { functionName?: 'changeVotingPeriod' }
    : UseContractWriteConfig<typeof prizeV2ABI, 'changeVotingPeriod', TMode> & {
        abi?: never;
        functionName?: 'changeVotingPeriod';
      } = {} as any,
) {
  return useContractWrite<typeof prizeV2ABI, 'changeVotingPeriod', TMode>({
    abi: prizeV2ABI,
    functionName: 'changeVotingPeriod',
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link prizeV2ABI}__ and `functionName` set to `"disputeChangeVote"`.
 */
export function usePrizeV2DisputeChangeVote<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof prizeV2ABI,
          'disputeChangeVote'
        >['request']['abi'],
        'disputeChangeVote',
        TMode
      > & { functionName?: 'disputeChangeVote' }
    : UseContractWriteConfig<typeof prizeV2ABI, 'disputeChangeVote', TMode> & {
        abi?: never;
        functionName?: 'disputeChangeVote';
      } = {} as any,
) {
  return useContractWrite<typeof prizeV2ABI, 'disputeChangeVote', TMode>({
    abi: prizeV2ABI,
    functionName: 'disputeChangeVote',
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link prizeV2ABI}__ and `functionName` set to `"endDispute"`.
 */
export function usePrizeV2EndDispute<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof prizeV2ABI, 'endDispute'>['request']['abi'],
        'endDispute',
        TMode
      > & { functionName?: 'endDispute' }
    : UseContractWriteConfig<typeof prizeV2ABI, 'endDispute', TMode> & {
        abi?: never;
        functionName?: 'endDispute';
      } = {} as any,
) {
  return useContractWrite<typeof prizeV2ABI, 'endDispute', TMode>({
    abi: prizeV2ABI,
    functionName: 'endDispute',
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link prizeV2ABI}__ and `functionName` set to `"endDisputePeriodEarly"`.
 */
export function usePrizeV2EndDisputePeriodEarly<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof prizeV2ABI,
          'endDisputePeriodEarly'
        >['request']['abi'],
        'endDisputePeriodEarly',
        TMode
      > & { functionName?: 'endDisputePeriodEarly' }
    : UseContractWriteConfig<typeof prizeV2ABI, 'endDisputePeriodEarly', TMode> & {
        abi?: never;
        functionName?: 'endDisputePeriodEarly';
      } = {} as any,
) {
  return useContractWrite<typeof prizeV2ABI, 'endDisputePeriodEarly', TMode>({
    abi: prizeV2ABI,
    functionName: 'endDisputePeriodEarly',
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link prizeV2ABI}__ and `functionName` set to `"endSubmissionPeriod"`.
 */
export function usePrizeV2EndSubmissionPeriod<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof prizeV2ABI,
          'endSubmissionPeriod'
        >['request']['abi'],
        'endSubmissionPeriod',
        TMode
      > & { functionName?: 'endSubmissionPeriod' }
    : UseContractWriteConfig<typeof prizeV2ABI, 'endSubmissionPeriod', TMode> & {
        abi?: never;
        functionName?: 'endSubmissionPeriod';
      } = {} as any,
) {
  return useContractWrite<typeof prizeV2ABI, 'endSubmissionPeriod', TMode>({
    abi: prizeV2ABI,
    functionName: 'endSubmissionPeriod',
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link prizeV2ABI}__ and `functionName` set to `"endVotingPeriod"`.
 */
export function usePrizeV2EndVotingPeriod<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof prizeV2ABI,
          'endVotingPeriod'
        >['request']['abi'],
        'endVotingPeriod',
        TMode
      > & { functionName?: 'endVotingPeriod' }
    : UseContractWriteConfig<typeof prizeV2ABI, 'endVotingPeriod', TMode> & {
        abi?: never;
        functionName?: 'endVotingPeriod';
      } = {} as any,
) {
  return useContractWrite<typeof prizeV2ABI, 'endVotingPeriod', TMode>({
    abi: prizeV2ABI,
    functionName: 'endVotingPeriod',
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link prizeV2ABI}__ and `functionName` set to `"raiseDispute"`.
 */
export function usePrizeV2RaiseDispute<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof prizeV2ABI, 'raiseDispute'>['request']['abi'],
        'raiseDispute',
        TMode
      > & { functionName?: 'raiseDispute' }
    : UseContractWriteConfig<typeof prizeV2ABI, 'raiseDispute', TMode> & {
        abi?: never;
        functionName?: 'raiseDispute';
      } = {} as any,
) {
  return useContractWrite<typeof prizeV2ABI, 'raiseDispute', TMode>({
    abi: prizeV2ABI,
    functionName: 'raiseDispute',
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link prizeV2ABI}__ and `functionName` set to `"startSubmissionPeriod"`.
 */
export function usePrizeV2StartSubmissionPeriod<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof prizeV2ABI,
          'startSubmissionPeriod'
        >['request']['abi'],
        'startSubmissionPeriod',
        TMode
      > & { functionName?: 'startSubmissionPeriod' }
    : UseContractWriteConfig<typeof prizeV2ABI, 'startSubmissionPeriod', TMode> & {
        abi?: never;
        functionName?: 'startSubmissionPeriod';
      } = {} as any,
) {
  return useContractWrite<typeof prizeV2ABI, 'startSubmissionPeriod', TMode>({
    abi: prizeV2ABI,
    functionName: 'startSubmissionPeriod',
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link prizeV2ABI}__ and `functionName` set to `"startVotingPeriod"`.
 */
export function usePrizeV2StartVotingPeriod<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof prizeV2ABI,
          'startVotingPeriod'
        >['request']['abi'],
        'startVotingPeriod',
        TMode
      > & { functionName?: 'startVotingPeriod' }
    : UseContractWriteConfig<typeof prizeV2ABI, 'startVotingPeriod', TMode> & {
        abi?: never;
        functionName?: 'startVotingPeriod';
      } = {} as any,
) {
  return useContractWrite<typeof prizeV2ABI, 'startVotingPeriod', TMode>({
    abi: prizeV2ABI,
    functionName: 'startVotingPeriod',
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link prizeV2ABI}__ and `functionName` set to `"vote"`.
 */
export function usePrizeV2Vote<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof prizeV2ABI, 'vote'>['request']['abi'],
        'vote',
        TMode
      > & { functionName?: 'vote' }
    : UseContractWriteConfig<typeof prizeV2ABI, 'vote', TMode> & {
        abi?: never;
        functionName?: 'vote';
      } = {} as any,
) {
  return useContractWrite<typeof prizeV2ABI, 'vote', TMode>({
    abi: prizeV2ABI,
    functionName: 'vote',
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link prizeV2ABI}__ and `functionName` set to `"withdrawTokens"`.
 */
export function usePrizeV2WithdrawTokens<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof prizeV2ABI, 'withdrawTokens'>['request']['abi'],
        'withdrawTokens',
        TMode
      > & { functionName?: 'withdrawTokens' }
    : UseContractWriteConfig<typeof prizeV2ABI, 'withdrawTokens', TMode> & {
        abi?: never;
        functionName?: 'withdrawTokens';
      } = {} as any,
) {
  return useContractWrite<typeof prizeV2ABI, 'withdrawTokens', TMode>({
    abi: prizeV2ABI,
    functionName: 'withdrawTokens',
    ...config,
  } as any);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link prizeV2ABI}__.
 */
export function usePreparePrizeV2Write<TFunctionName extends string>(
  config: Omit<
    UsePrepareContractWriteConfig<typeof prizeV2ABI, TFunctionName>,
    'abi'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: prizeV2ABI,
    ...config,
  } as UsePrepareContractWriteConfig<typeof prizeV2ABI, TFunctionName>);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link prizeV2ABI}__ and `functionName` set to `"addSubmission"`.
 */
export function usePreparePrizeV2AddSubmission(
  config: Omit<
    UsePrepareContractWriteConfig<typeof prizeV2ABI, 'addSubmission'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: prizeV2ABI,
    functionName: 'addSubmission',
    ...config,
  } as UsePrepareContractWriteConfig<typeof prizeV2ABI, 'addSubmission'>);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link prizeV2ABI}__ and `functionName` set to `"addUsdcFunds"`.
 */
export function usePreparePrizeV2AddUsdcFunds(
  config: Omit<
    UsePrepareContractWriteConfig<typeof prizeV2ABI, 'addUsdcFunds'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: prizeV2ABI,
    functionName: 'addUsdcFunds',
    ...config,
  } as UsePrepareContractWriteConfig<typeof prizeV2ABI, 'addUsdcFunds'>);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link prizeV2ABI}__ and `functionName` set to `"changeSubmissionPeriod"`.
 */
export function usePreparePrizeV2ChangeSubmissionPeriod(
  config: Omit<
    UsePrepareContractWriteConfig<typeof prizeV2ABI, 'changeSubmissionPeriod'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: prizeV2ABI,
    functionName: 'changeSubmissionPeriod',
    ...config,
  } as UsePrepareContractWriteConfig<typeof prizeV2ABI, 'changeSubmissionPeriod'>);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link prizeV2ABI}__ and `functionName` set to `"changeVote"`.
 */
export function usePreparePrizeV2ChangeVote(
  config: Omit<
    UsePrepareContractWriteConfig<typeof prizeV2ABI, 'changeVote'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: prizeV2ABI,
    functionName: 'changeVote',
    ...config,
  } as UsePrepareContractWriteConfig<typeof prizeV2ABI, 'changeVote'>);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link prizeV2ABI}__ and `functionName` set to `"changeVotingPeriod"`.
 */
export function usePreparePrizeV2ChangeVotingPeriod(
  config: Omit<
    UsePrepareContractWriteConfig<typeof prizeV2ABI, 'changeVotingPeriod'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: prizeV2ABI,
    functionName: 'changeVotingPeriod',
    ...config,
  } as UsePrepareContractWriteConfig<typeof prizeV2ABI, 'changeVotingPeriod'>);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link prizeV2ABI}__ and `functionName` set to `"disputeChangeVote"`.
 */
export function usePreparePrizeV2DisputeChangeVote(
  config: Omit<
    UsePrepareContractWriteConfig<typeof prizeV2ABI, 'disputeChangeVote'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: prizeV2ABI,
    functionName: 'disputeChangeVote',
    ...config,
  } as UsePrepareContractWriteConfig<typeof prizeV2ABI, 'disputeChangeVote'>);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link prizeV2ABI}__ and `functionName` set to `"endDispute"`.
 */
export function usePreparePrizeV2EndDispute(
  config: Omit<
    UsePrepareContractWriteConfig<typeof prizeV2ABI, 'endDispute'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: prizeV2ABI,
    functionName: 'endDispute',
    ...config,
  } as UsePrepareContractWriteConfig<typeof prizeV2ABI, 'endDispute'>);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link prizeV2ABI}__ and `functionName` set to `"endDisputePeriodEarly"`.
 */
export function usePreparePrizeV2EndDisputePeriodEarly(
  config: Omit<
    UsePrepareContractWriteConfig<typeof prizeV2ABI, 'endDisputePeriodEarly'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: prizeV2ABI,
    functionName: 'endDisputePeriodEarly',
    ...config,
  } as UsePrepareContractWriteConfig<typeof prizeV2ABI, 'endDisputePeriodEarly'>);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link prizeV2ABI}__ and `functionName` set to `"endSubmissionPeriod"`.
 */
export function usePreparePrizeV2EndSubmissionPeriod(
  config: Omit<
    UsePrepareContractWriteConfig<typeof prizeV2ABI, 'endSubmissionPeriod'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: prizeV2ABI,
    functionName: 'endSubmissionPeriod',
    ...config,
  } as UsePrepareContractWriteConfig<typeof prizeV2ABI, 'endSubmissionPeriod'>);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link prizeV2ABI}__ and `functionName` set to `"endVotingPeriod"`.
 */
export function usePreparePrizeV2EndVotingPeriod(
  config: Omit<
    UsePrepareContractWriteConfig<typeof prizeV2ABI, 'endVotingPeriod'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: prizeV2ABI,
    functionName: 'endVotingPeriod',
    ...config,
  } as UsePrepareContractWriteConfig<typeof prizeV2ABI, 'endVotingPeriod'>);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link prizeV2ABI}__ and `functionName` set to `"raiseDispute"`.
 */
export function usePreparePrizeV2RaiseDispute(
  config: Omit<
    UsePrepareContractWriteConfig<typeof prizeV2ABI, 'raiseDispute'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: prizeV2ABI,
    functionName: 'raiseDispute',
    ...config,
  } as UsePrepareContractWriteConfig<typeof prizeV2ABI, 'raiseDispute'>);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link prizeV2ABI}__ and `functionName` set to `"startSubmissionPeriod"`.
 */
export function usePreparePrizeV2StartSubmissionPeriod(
  config: Omit<
    UsePrepareContractWriteConfig<typeof prizeV2ABI, 'startSubmissionPeriod'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: prizeV2ABI,
    functionName: 'startSubmissionPeriod',
    ...config,
  } as UsePrepareContractWriteConfig<typeof prizeV2ABI, 'startSubmissionPeriod'>);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link prizeV2ABI}__ and `functionName` set to `"startVotingPeriod"`.
 */
export function usePreparePrizeV2StartVotingPeriod(
  config: Omit<
    UsePrepareContractWriteConfig<typeof prizeV2ABI, 'startVotingPeriod'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: prizeV2ABI,
    functionName: 'startVotingPeriod',
    ...config,
  } as UsePrepareContractWriteConfig<typeof prizeV2ABI, 'startVotingPeriod'>);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link prizeV2ABI}__ and `functionName` set to `"vote"`.
 */
export function usePreparePrizeV2Vote(
  config: Omit<
    UsePrepareContractWriteConfig<typeof prizeV2ABI, 'vote'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: prizeV2ABI,
    functionName: 'vote',
    ...config,
  } as UsePrepareContractWriteConfig<typeof prizeV2ABI, 'vote'>);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link prizeV2ABI}__ and `functionName` set to `"withdrawTokens"`.
 */
export function usePreparePrizeV2WithdrawTokens(
  config: Omit<
    UsePrepareContractWriteConfig<typeof prizeV2ABI, 'withdrawTokens'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: prizeV2ABI,
    functionName: 'withdrawTokens',
    ...config,
  } as UsePrepareContractWriteConfig<typeof prizeV2ABI, 'withdrawTokens'>);
}
