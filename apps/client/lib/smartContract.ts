import {
  writeContract,
  WriteContractArgs,
  WriteContractPreparedArgs,
  WriteContractUnpreparedArgs,
  prepareWriteContract,
  PrepareWriteContractConfig,
  WriteContractMode,
} from 'wagmi/actions';

import {
  useContractRead,
  UseContractReadConfig,
  useContractWrite,
  UseContractWriteConfig,
  usePrepareContractWrite,
  UsePrepareContractWriteConfig,
  Address,
} from 'wagmi';
import {
  ReadContractResult,
  WriteContractMode,
  PrepareWriteContractResult,
} from 'wagmi/actions';

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
// Prize
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const prizeABI = [
  {
    stateMutability: 'nonpayable',
    type: 'constructor',
    inputs: [
      { name: '_proposers', internalType: 'address[]', type: 'address[]' },
      { name: '_platformAdmins', internalType: 'address[]', type: 'address[]' },
      { name: '_platFormFee', internalType: 'uint256', type: 'uint256' },
      { name: '_proposerFee', internalType: 'uint256', type: 'uint256' },
      { name: '_platformAddress', internalType: 'address', type: 'address' },
      { name: '_submission_time', internalType: 'uint256', type: 'uint256' },
    ],
  },
  { type: 'error', inputs: [], name: 'NotAdmin' },
  { type: 'error', inputs: [], name: 'NotEnoughFunds' },
  { type: 'error', inputs: [], name: 'NotYourVote' },
  { type: 'error', inputs: [], name: 'ReentrancyGuardReentrantCall' },
  { type: 'error', inputs: [], name: 'RefundAlreadyClaimed' },
  { type: 'error', inputs: [], name: 'RefundDoesntExist' },
  { type: 'error', inputs: [], name: 'RewardsAlreadyDistributed' },
  { type: 'error', inputs: [], name: 'RewardsNotDistributed' },
  { type: 'error', inputs: [], name: 'SubmissionAlreadyMade' },
  { type: 'error', inputs: [], name: 'SubmissionDoesntExist' },
  { type: 'error', inputs: [], name: 'SubmissionPeriodActive' },
  { type: 'error', inputs: [], name: 'SubmissionPeriodNotActive' },
  { type: 'error', inputs: [], name: 'VotingPeriodActive' },
  { type: 'error', inputs: [], name: 'VotingPeriodNotActive' },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'submitter', internalType: 'address', type: 'address', indexed: true },
      { name: 'submissionHash', internalType: 'bytes32', type: 'bytes32', indexed: true },
    ],
    name: 'SubmissionCreated',
  },
  {
    stateMutability: 'payable',
    type: 'function',
    inputs: [],
    name: 'addFunds',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'submitter', internalType: 'address', type: 'address' },
      { name: 'submissionText', internalType: 'string', type: 'string' },
    ],
    name: 'addSubmission',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    name: 'allPatrons',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: '_previous_submissionHash', internalType: 'bytes32', type: 'bytes32' },
      { name: '_new_submissionHash', internalType: 'bytes32', type: 'bytes32' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'change_vote',
    outputs: [],
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
    name: 'earlyRefund',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [],
    name: 'end_submission_period',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [],
    name: 'end_voting_period',
    outputs: [],
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
          { name: 'votes', internalType: 'uint256', type: 'uint256' },
          { name: 'submitter', internalType: 'address', type: 'address' },
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
    name: 'getPatrons',
    outputs: [{ name: '', internalType: 'address[]', type: 'address[]' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'submissionHash', internalType: 'bytes32', type: 'bytes32' }],
    name: 'get_submission_by_hash',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'get_submission_time',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'get_voting_time',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: '_submissionTime', internalType: 'uint256', type: 'uint256' }],
    name: 'increase_submission_period',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: '_votingTime', internalType: 'uint256', type: 'uint256' }],
    name: 'increase_voting_period',
    outputs: [],
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
    name: 'isPatron',
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
    name: 'patronAmount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'patronAmountForRefund',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'patronVotes',
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
    name: 'platform_reward',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'proposerAddress',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'proposer_reward',
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
    name: 'refunded',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: '_submission_time', internalType: 'uint256', type: 'uint256' }],
    name: 'start_submission_period',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: '_voting_time', internalType: 'uint256', type: 'uint256' }],
    name: 'start_voting_period',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'submission_time',
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
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'total_funds',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'total_rewards',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'track_submission_time',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: '_submissionHash', internalType: 'bytes32', type: 'bytes32' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'vote',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'voting_time',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  { stateMutability: 'payable', type: 'receive' },
] as const;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// PrizeFactory
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const prizeFactoryABI = [
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
      { name: '_admins', internalType: 'address[]', type: 'address[]' },
      { name: '_platformAdmins', internalType: 'address[]', type: 'address[]' },
      { name: '_platFormFee', internalType: 'uint256', type: 'uint256' },
      { name: '_proposerFee', internalType: 'uint256', type: 'uint256' },
      { name: '_platformAddress', internalType: 'address', type: 'address' },
      { name: '_submission_time', internalType: 'uint256', type: 'uint256' },
      { name: '_contractId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'createViaPrize',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
  },
] as const;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// PrizeFactoryV2
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x98B1e3ae7Ba79C88877a5dad4F867BEd8D2DaD45)
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
      { name: '_usdcBridgedAddress', internalType: 'address', type: 'address' },
      { name: '_swapRouter', internalType: 'address', type: 'address' },
      { name: '_usdcToUsdcePool', internalType: 'address', type: 'address' },
      { name: '_usdcToEthPool', internalType: 'address', type: 'address' },
      { name: '_ethPriceAggregator', internalType: 'address', type: 'address' },
      { name: '_wethToken', internalType: 'address', type: 'address' },
    ],
    name: 'createViaPrize',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
  },
] as const;

/**
 * [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x98B1e3ae7Ba79C88877a5dad4F867BEd8D2DaD45)
 */
export const prizeFactoryV2Address = {
  10: '0x98B1e3ae7Ba79C88877a5dad4F867BEd8D2DaD45',
} as const;

/**
 * [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x98B1e3ae7Ba79C88877a5dad4F867BEd8D2DaD45)
 */
export const prizeFactoryV2Config = {
  address: prizeFactoryV2Address,
  abi: prizeFactoryV2ABI,
} as const;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// PrizeJudgesFactory
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x7f1aF102d6EBaa0F673C3C574c58EB052db93675)
 */
export const prizeJudgesFactoryABI = [
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
      { name: '_admins', internalType: 'address[]', type: 'address[]' },
      { name: '_platformAdmins', internalType: 'address[]', type: 'address[]' },
      { name: '_judges', internalType: 'address[]', type: 'address[]' },
      { name: '_platFormFee', internalType: 'uint256', type: 'uint256' },
      { name: '_proposerFee', internalType: 'uint256', type: 'uint256' },
      { name: '_platformAddress', internalType: 'address', type: 'address' },
      { name: '_submission_time', internalType: 'uint256', type: 'uint256' },
      { name: '_contractId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'createViaPrizeJudges',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
  },
] as const;

/**
 * [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x7f1aF102d6EBaa0F673C3C574c58EB052db93675)
 */
export const prizeJudgesFactoryAddress = {
  10: '0x7f1aF102d6EBaa0F673C3C574c58EB052db93675',
} as const;

/**
 * [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x7f1aF102d6EBaa0F673C3C574c58EB052db93675)
 */
export const prizeJudgesFactoryConfig = {
  address: prizeJudgesFactoryAddress,
  abi: prizeJudgesFactoryABI,
} as const;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// portalFactory
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0xA75b783F132Dea807e9197Ebd200c884Aa1D7fa0)
 */
export const portalFactoryABI = [
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'portalAddress', internalType: 'address', type: 'address', indexed: true },
    ],
    name: 'NewPortalCreated',
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: '_owners', internalType: 'address[]', type: 'address[]' },
      { name: '_admins', internalType: 'address[]', type: 'address[]' },
      { name: '_goal', internalType: 'uint256', type: 'uint256' },
      { name: '_deadline', internalType: 'uint256', type: 'uint256' },
      { name: '_allowDonationAboveGoalAmount', internalType: 'bool', type: 'bool' },
      { name: '_platformFee', internalType: 'uint256', type: 'uint256' },
      { name: '_allowImmediately', internalType: 'bool', type: 'bool' },
    ],
    name: 'createPortal',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
  },
] as const;

/**
 * [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0xA75b783F132Dea807e9197Ebd200c884Aa1D7fa0)
 */
export const portalFactoryAddress = {
  10: '0xA75b783F132Dea807e9197Ebd200c884Aa1D7fa0',
} as const;

/**
 * [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0xA75b783F132Dea807e9197Ebd200c884Aa1D7fa0)
 */
export const portalFactoryConfig = {
  address: portalFactoryAddress,
  abi: portalFactoryABI,
} as const;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Core
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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
 * Wraps __{@link writeContract}__ with `abi` set to __{@link prizeABI}__.
 */
export function writePrize<TFunctionName extends string>(
  config:
    | Omit<WriteContractPreparedArgs<typeof prizeABI, TFunctionName>, 'abi'>
    | Omit<WriteContractUnpreparedArgs<typeof prizeABI, TFunctionName>, 'abi'>,
) {
  return writeContract({ abi: prizeABI, ...config } as unknown as WriteContractArgs<
    typeof prizeABI,
    TFunctionName
  >);
}

/**
 * Wraps __{@link prepareWriteContract}__ with `abi` set to __{@link prizeABI}__.
 */
export function prepareWritePrize<
  TAbi extends readonly unknown[] = typeof prizeABI,
  TFunctionName extends string = string,
>(config: Omit<PrepareWriteContractConfig<TAbi, TFunctionName>, 'abi'>) {
  return prepareWriteContract({
    abi: prizeABI,
    ...config,
  } as unknown as PrepareWriteContractConfig<TAbi, TFunctionName>);
}

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link prizeFactoryABI}__.
 */
export function writePrizeFactory<TFunctionName extends string>(
  config:
    | Omit<WriteContractPreparedArgs<typeof prizeFactoryABI, TFunctionName>, 'abi'>
    | Omit<WriteContractUnpreparedArgs<typeof prizeFactoryABI, TFunctionName>, 'abi'>,
) {
  return writeContract({
    abi: prizeFactoryABI,
    ...config,
  } as unknown as WriteContractArgs<typeof prizeFactoryABI, TFunctionName>);
}

/**
 * Wraps __{@link prepareWriteContract}__ with `abi` set to __{@link prizeFactoryABI}__.
 */
export function prepareWritePrizeFactory<
  TAbi extends readonly unknown[] = typeof prizeFactoryABI,
  TFunctionName extends string = string,
>(config: Omit<PrepareWriteContractConfig<TAbi, TFunctionName>, 'abi'>) {
  return prepareWriteContract({
    abi: prizeFactoryABI,
    ...config,
  } as unknown as PrepareWriteContractConfig<TAbi, TFunctionName>);
}

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link prizeFactoryV2ABI}__.
 *
 * [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x98B1e3ae7Ba79C88877a5dad4F867BEd8D2DaD45)
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
    address: prizeFactoryV2Address[10],
    ...config,
  } as unknown as WriteContractArgs<typeof prizeFactoryV2ABI, TFunctionName>);
}

/**
 * Wraps __{@link prepareWriteContract}__ with `abi` set to __{@link prizeFactoryV2ABI}__.
 *
 * [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x98B1e3ae7Ba79C88877a5dad4F867BEd8D2DaD45)
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
    address: prizeFactoryV2Address[10],
    ...config,
  } as unknown as PrepareWriteContractConfig<TAbi, TFunctionName>);
}

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link prizeJudgesFactoryABI}__.
 *
 * [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x7f1aF102d6EBaa0F673C3C574c58EB052db93675)
 */
export function writePrizeJudgesFactory<
  TFunctionName extends string,
  TMode extends WriteContractMode,
  TChainId extends number = keyof typeof prizeJudgesFactoryAddress,
>(
  config:
    | (Omit<
        WriteContractPreparedArgs<typeof prizeJudgesFactoryABI, TFunctionName>,
        'abi' | 'address'
      > & {
        mode: TMode;
        chainId?: TMode extends 'prepared'
          ? TChainId
          : keyof typeof prizeJudgesFactoryAddress;
      })
    | (Omit<
        WriteContractUnpreparedArgs<typeof prizeJudgesFactoryABI, TFunctionName>,
        'abi' | 'address'
      > & {
        mode: TMode;
        chainId?: TMode extends 'prepared'
          ? TChainId
          : keyof typeof prizeJudgesFactoryAddress;
      }),
) {
  return writeContract({
    abi: prizeJudgesFactoryABI,
    address: prizeJudgesFactoryAddress[10],
    ...config,
  } as unknown as WriteContractArgs<typeof prizeJudgesFactoryABI, TFunctionName>);
}

/**
 * Wraps __{@link prepareWriteContract}__ with `abi` set to __{@link prizeJudgesFactoryABI}__.
 *
 * [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x7f1aF102d6EBaa0F673C3C574c58EB052db93675)
 */
export function prepareWritePrizeJudgesFactory<
  TAbi extends readonly unknown[] = typeof prizeJudgesFactoryABI,
  TFunctionName extends string = string,
>(
  config: Omit<PrepareWriteContractConfig<TAbi, TFunctionName>, 'abi' | 'address'> & {
    chainId?: keyof typeof prizeJudgesFactoryAddress;
  },
) {
  return prepareWriteContract({
    abi: prizeJudgesFactoryABI,
    address: prizeJudgesFactoryAddress[10],
    ...config,
  } as unknown as PrepareWriteContractConfig<TAbi, TFunctionName>);
}

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link portalFactoryABI}__.
 *
 * [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0xA75b783F132Dea807e9197Ebd200c884Aa1D7fa0)
 */
export function writePortalFactory<
  TFunctionName extends string,
  TMode extends WriteContractMode,
  TChainId extends number = keyof typeof portalFactoryAddress,
>(
  config:
    | (Omit<
        WriteContractPreparedArgs<typeof portalFactoryABI, TFunctionName>,
        'abi' | 'address'
      > & {
        mode: TMode;
        chainId?: TMode extends 'prepared' ? TChainId : keyof typeof portalFactoryAddress;
      })
    | (Omit<
        WriteContractUnpreparedArgs<typeof portalFactoryABI, TFunctionName>,
        'abi' | 'address'
      > & {
        mode: TMode;
        chainId?: TMode extends 'prepared' ? TChainId : keyof typeof portalFactoryAddress;
      }),
) {
  return writeContract({
    abi: portalFactoryABI,
    address: portalFactoryAddress[10],
    ...config,
  } as unknown as WriteContractArgs<typeof portalFactoryABI, TFunctionName>);
}

/**
 * Wraps __{@link prepareWriteContract}__ with `abi` set to __{@link portalFactoryABI}__.
 *
 * [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0xA75b783F132Dea807e9197Ebd200c884Aa1D7fa0)
 */
export function prepareWritePortalFactory<
  TAbi extends readonly unknown[] = typeof portalFactoryABI,
  TFunctionName extends string = string,
>(
  config: Omit<PrepareWriteContractConfig<TAbi, TFunctionName>, 'abi' | 'address'> & {
    chainId?: keyof typeof portalFactoryAddress;
  },
) {
  return prepareWriteContract({
    abi: portalFactoryABI,
    address: portalFactoryAddress[10],
    ...config,
  } as unknown as PrepareWriteContractConfig<TAbi, TFunctionName>);
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// React
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link prizeABI}__.
 */
export function usePrizeRead<
  TFunctionName extends string,
  TSelectData = ReadContractResult<typeof prizeABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof prizeABI, TFunctionName, TSelectData>,
    'abi'
  > = {} as any,
) {
  return useContractRead({ abi: prizeABI, ...config } as UseContractReadConfig<
    typeof prizeABI,
    TFunctionName,
    TSelectData
  >);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link prizeABI}__ and `functionName` set to `"allPatrons"`.
 */
export function usePrizeAllPatrons<
  TFunctionName extends 'allPatrons',
  TSelectData = ReadContractResult<typeof prizeABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof prizeABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: prizeABI,
    functionName: 'allPatrons',
    ...config,
  } as UseContractReadConfig<typeof prizeABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link prizeABI}__ and `functionName` set to `"distributed"`.
 */
export function usePrizeDistributed<
  TFunctionName extends 'distributed',
  TSelectData = ReadContractResult<typeof prizeABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof prizeABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: prizeABI,
    functionName: 'distributed',
    ...config,
  } as UseContractReadConfig<typeof prizeABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link prizeABI}__ and `functionName` set to `"getAllSubmissions"`.
 */
export function usePrizeGetAllSubmissions<
  TFunctionName extends 'getAllSubmissions',
  TSelectData = ReadContractResult<typeof prizeABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof prizeABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: prizeABI,
    functionName: 'getAllSubmissions',
    ...config,
  } as UseContractReadConfig<typeof prizeABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link prizeABI}__ and `functionName` set to `"getPatrons"`.
 */
export function usePrizeGetPatrons<
  TFunctionName extends 'getPatrons',
  TSelectData = ReadContractResult<typeof prizeABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof prizeABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: prizeABI,
    functionName: 'getPatrons',
    ...config,
  } as UseContractReadConfig<typeof prizeABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link prizeABI}__ and `functionName` set to `"get_submission_by_hash"`.
 */
export function usePrizeGetSubmissionByHash<
  TFunctionName extends 'get_submission_by_hash',
  TSelectData = ReadContractResult<typeof prizeABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof prizeABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: prizeABI,
    functionName: 'get_submission_by_hash',
    ...config,
  } as UseContractReadConfig<typeof prizeABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link prizeABI}__ and `functionName` set to `"get_submission_time"`.
 */
export function usePrizeGetSubmissionTime<
  TFunctionName extends 'get_submission_time',
  TSelectData = ReadContractResult<typeof prizeABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof prizeABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: prizeABI,
    functionName: 'get_submission_time',
    ...config,
  } as UseContractReadConfig<typeof prizeABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link prizeABI}__ and `functionName` set to `"get_voting_time"`.
 */
export function usePrizeGetVotingTime<
  TFunctionName extends 'get_voting_time',
  TSelectData = ReadContractResult<typeof prizeABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof prizeABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: prizeABI,
    functionName: 'get_voting_time',
    ...config,
  } as UseContractReadConfig<typeof prizeABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link prizeABI}__ and `functionName` set to `"isActive"`.
 */
export function usePrizeIsActive<
  TFunctionName extends 'isActive',
  TSelectData = ReadContractResult<typeof prizeABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof prizeABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: prizeABI,
    functionName: 'isActive',
    ...config,
  } as UseContractReadConfig<typeof prizeABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link prizeABI}__ and `functionName` set to `"isPatron"`.
 */
export function usePrizeIsPatron<
  TFunctionName extends 'isPatron',
  TSelectData = ReadContractResult<typeof prizeABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof prizeABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: prizeABI,
    functionName: 'isPatron',
    ...config,
  } as UseContractReadConfig<typeof prizeABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link prizeABI}__ and `functionName` set to `"isPlatformAdmin"`.
 */
export function usePrizeIsPlatformAdmin<
  TFunctionName extends 'isPlatformAdmin',
  TSelectData = ReadContractResult<typeof prizeABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof prizeABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: prizeABI,
    functionName: 'isPlatformAdmin',
    ...config,
  } as UseContractReadConfig<typeof prizeABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link prizeABI}__ and `functionName` set to `"isProposer"`.
 */
export function usePrizeIsProposer<
  TFunctionName extends 'isProposer',
  TSelectData = ReadContractResult<typeof prizeABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof prizeABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: prizeABI,
    functionName: 'isProposer',
    ...config,
  } as UseContractReadConfig<typeof prizeABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link prizeABI}__ and `functionName` set to `"patronAmount"`.
 */
export function usePrizePatronAmount<
  TFunctionName extends 'patronAmount',
  TSelectData = ReadContractResult<typeof prizeABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof prizeABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: prizeABI,
    functionName: 'patronAmount',
    ...config,
  } as UseContractReadConfig<typeof prizeABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link prizeABI}__ and `functionName` set to `"patronAmountForRefund"`.
 */
export function usePrizePatronAmountForRefund<
  TFunctionName extends 'patronAmountForRefund',
  TSelectData = ReadContractResult<typeof prizeABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof prizeABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: prizeABI,
    functionName: 'patronAmountForRefund',
    ...config,
  } as UseContractReadConfig<typeof prizeABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link prizeABI}__ and `functionName` set to `"patronVotes"`.
 */
export function usePrizePatronVotes<
  TFunctionName extends 'patronVotes',
  TSelectData = ReadContractResult<typeof prizeABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof prizeABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: prizeABI,
    functionName: 'patronVotes',
    ...config,
  } as UseContractReadConfig<typeof prizeABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link prizeABI}__ and `functionName` set to `"platformAddress"`.
 */
export function usePrizePlatformAddress<
  TFunctionName extends 'platformAddress',
  TSelectData = ReadContractResult<typeof prizeABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof prizeABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: prizeABI,
    functionName: 'platformAddress',
    ...config,
  } as UseContractReadConfig<typeof prizeABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link prizeABI}__ and `functionName` set to `"platformAdmins"`.
 */
export function usePrizePlatformAdmins<
  TFunctionName extends 'platformAdmins',
  TSelectData = ReadContractResult<typeof prizeABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof prizeABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: prizeABI,
    functionName: 'platformAdmins',
    ...config,
  } as UseContractReadConfig<typeof prizeABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link prizeABI}__ and `functionName` set to `"platform_reward"`.
 */
export function usePrizePlatformReward<
  TFunctionName extends 'platform_reward',
  TSelectData = ReadContractResult<typeof prizeABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof prizeABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: prizeABI,
    functionName: 'platform_reward',
    ...config,
  } as UseContractReadConfig<typeof prizeABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link prizeABI}__ and `functionName` set to `"proposerAddress"`.
 */
export function usePrizeProposerAddress<
  TFunctionName extends 'proposerAddress',
  TSelectData = ReadContractResult<typeof prizeABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof prizeABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: prizeABI,
    functionName: 'proposerAddress',
    ...config,
  } as UseContractReadConfig<typeof prizeABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link prizeABI}__ and `functionName` set to `"proposer_reward"`.
 */
export function usePrizeProposerReward<
  TFunctionName extends 'proposer_reward',
  TSelectData = ReadContractResult<typeof prizeABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof prizeABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: prizeABI,
    functionName: 'proposer_reward',
    ...config,
  } as UseContractReadConfig<typeof prizeABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link prizeABI}__ and `functionName` set to `"proposers"`.
 */
export function usePrizeProposers<
  TFunctionName extends 'proposers',
  TSelectData = ReadContractResult<typeof prizeABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof prizeABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: prizeABI,
    functionName: 'proposers',
    ...config,
  } as UseContractReadConfig<typeof prizeABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link prizeABI}__ and `functionName` set to `"refunded"`.
 */
export function usePrizeRefunded<
  TFunctionName extends 'refunded',
  TSelectData = ReadContractResult<typeof prizeABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof prizeABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: prizeABI,
    functionName: 'refunded',
    ...config,
  } as UseContractReadConfig<typeof prizeABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link prizeABI}__ and `functionName` set to `"submission_time"`.
 */
export function usePrizeSubmissionTime<
  TFunctionName extends 'submission_time',
  TSelectData = ReadContractResult<typeof prizeABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof prizeABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: prizeABI,
    functionName: 'submission_time',
    ...config,
  } as UseContractReadConfig<typeof prizeABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link prizeABI}__ and `functionName` set to `"totalVotes"`.
 */
export function usePrizeTotalVotes<
  TFunctionName extends 'totalVotes',
  TSelectData = ReadContractResult<typeof prizeABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof prizeABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: prizeABI,
    functionName: 'totalVotes',
    ...config,
  } as UseContractReadConfig<typeof prizeABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link prizeABI}__ and `functionName` set to `"total_funds"`.
 */
export function usePrizeTotalFunds<
  TFunctionName extends 'total_funds',
  TSelectData = ReadContractResult<typeof prizeABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof prizeABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: prizeABI,
    functionName: 'total_funds',
    ...config,
  } as UseContractReadConfig<typeof prizeABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link prizeABI}__ and `functionName` set to `"total_rewards"`.
 */
export function usePrizeTotalRewards<
  TFunctionName extends 'total_rewards',
  TSelectData = ReadContractResult<typeof prizeABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof prizeABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: prizeABI,
    functionName: 'total_rewards',
    ...config,
  } as UseContractReadConfig<typeof prizeABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link prizeABI}__ and `functionName` set to `"track_submission_time"`.
 */
export function usePrizeTrackSubmissionTime<
  TFunctionName extends 'track_submission_time',
  TSelectData = ReadContractResult<typeof prizeABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof prizeABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: prizeABI,
    functionName: 'track_submission_time',
    ...config,
  } as UseContractReadConfig<typeof prizeABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link prizeABI}__ and `functionName` set to `"voting_time"`.
 */
export function usePrizeVotingTime<
  TFunctionName extends 'voting_time',
  TSelectData = ReadContractResult<typeof prizeABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof prizeABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: prizeABI,
    functionName: 'voting_time',
    ...config,
  } as UseContractReadConfig<typeof prizeABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link prizeABI}__.
 */
export function usePrizeWrite<
  TFunctionName extends string,
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof prizeABI, string>['request']['abi'],
        TFunctionName,
        TMode
      >
    : UseContractWriteConfig<typeof prizeABI, TFunctionName, TMode> & {
        abi?: never;
      } = {} as any,
) {
  return useContractWrite<typeof prizeABI, TFunctionName, TMode>({
    abi: prizeABI,
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link prizeABI}__ and `functionName` set to `"addFunds"`.
 */
export function usePrizeAddFunds<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof prizeABI, 'addFunds'>['request']['abi'],
        'addFunds',
        TMode
      > & { functionName?: 'addFunds' }
    : UseContractWriteConfig<typeof prizeABI, 'addFunds', TMode> & {
        abi?: never;
        functionName?: 'addFunds';
      } = {} as any,
) {
  return useContractWrite<typeof prizeABI, 'addFunds', TMode>({
    abi: prizeABI,
    functionName: 'addFunds',
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link prizeABI}__ and `functionName` set to `"addSubmission"`.
 */
export function usePrizeAddSubmission<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof prizeABI, 'addSubmission'>['request']['abi'],
        'addSubmission',
        TMode
      > & { functionName?: 'addSubmission' }
    : UseContractWriteConfig<typeof prizeABI, 'addSubmission', TMode> & {
        abi?: never;
        functionName?: 'addSubmission';
      } = {} as any,
) {
  return useContractWrite<typeof prizeABI, 'addSubmission', TMode>({
    abi: prizeABI,
    functionName: 'addSubmission',
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link prizeABI}__ and `functionName` set to `"change_vote"`.
 */
export function usePrizeChangeVote<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof prizeABI, 'change_vote'>['request']['abi'],
        'change_vote',
        TMode
      > & { functionName?: 'change_vote' }
    : UseContractWriteConfig<typeof prizeABI, 'change_vote', TMode> & {
        abi?: never;
        functionName?: 'change_vote';
      } = {} as any,
) {
  return useContractWrite<typeof prizeABI, 'change_vote', TMode>({
    abi: prizeABI,
    functionName: 'change_vote',
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link prizeABI}__ and `functionName` set to `"earlyRefund"`.
 */
export function usePrizeEarlyRefund<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof prizeABI, 'earlyRefund'>['request']['abi'],
        'earlyRefund',
        TMode
      > & { functionName?: 'earlyRefund' }
    : UseContractWriteConfig<typeof prizeABI, 'earlyRefund', TMode> & {
        abi?: never;
        functionName?: 'earlyRefund';
      } = {} as any,
) {
  return useContractWrite<typeof prizeABI, 'earlyRefund', TMode>({
    abi: prizeABI,
    functionName: 'earlyRefund',
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link prizeABI}__ and `functionName` set to `"end_submission_period"`.
 */
export function usePrizeEndSubmissionPeriod<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof prizeABI,
          'end_submission_period'
        >['request']['abi'],
        'end_submission_period',
        TMode
      > & { functionName?: 'end_submission_period' }
    : UseContractWriteConfig<typeof prizeABI, 'end_submission_period', TMode> & {
        abi?: never;
        functionName?: 'end_submission_period';
      } = {} as any,
) {
  return useContractWrite<typeof prizeABI, 'end_submission_period', TMode>({
    abi: prizeABI,
    functionName: 'end_submission_period',
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link prizeABI}__ and `functionName` set to `"end_voting_period"`.
 */
export function usePrizeEndVotingPeriod<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof prizeABI,
          'end_voting_period'
        >['request']['abi'],
        'end_voting_period',
        TMode
      > & { functionName?: 'end_voting_period' }
    : UseContractWriteConfig<typeof prizeABI, 'end_voting_period', TMode> & {
        abi?: never;
        functionName?: 'end_voting_period';
      } = {} as any,
) {
  return useContractWrite<typeof prizeABI, 'end_voting_period', TMode>({
    abi: prizeABI,
    functionName: 'end_voting_period',
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link prizeABI}__ and `functionName` set to `"increase_submission_period"`.
 */
export function usePrizeIncreaseSubmissionPeriod<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof prizeABI,
          'increase_submission_period'
        >['request']['abi'],
        'increase_submission_period',
        TMode
      > & { functionName?: 'increase_submission_period' }
    : UseContractWriteConfig<typeof prizeABI, 'increase_submission_period', TMode> & {
        abi?: never;
        functionName?: 'increase_submission_period';
      } = {} as any,
) {
  return useContractWrite<typeof prizeABI, 'increase_submission_period', TMode>({
    abi: prizeABI,
    functionName: 'increase_submission_period',
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link prizeABI}__ and `functionName` set to `"increase_voting_period"`.
 */
export function usePrizeIncreaseVotingPeriod<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof prizeABI,
          'increase_voting_period'
        >['request']['abi'],
        'increase_voting_period',
        TMode
      > & { functionName?: 'increase_voting_period' }
    : UseContractWriteConfig<typeof prizeABI, 'increase_voting_period', TMode> & {
        abi?: never;
        functionName?: 'increase_voting_period';
      } = {} as any,
) {
  return useContractWrite<typeof prizeABI, 'increase_voting_period', TMode>({
    abi: prizeABI,
    functionName: 'increase_voting_period',
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link prizeABI}__ and `functionName` set to `"start_submission_period"`.
 */
export function usePrizeStartSubmissionPeriod<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof prizeABI,
          'start_submission_period'
        >['request']['abi'],
        'start_submission_period',
        TMode
      > & { functionName?: 'start_submission_period' }
    : UseContractWriteConfig<typeof prizeABI, 'start_submission_period', TMode> & {
        abi?: never;
        functionName?: 'start_submission_period';
      } = {} as any,
) {
  return useContractWrite<typeof prizeABI, 'start_submission_period', TMode>({
    abi: prizeABI,
    functionName: 'start_submission_period',
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link prizeABI}__ and `functionName` set to `"start_voting_period"`.
 */
export function usePrizeStartVotingPeriod<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof prizeABI,
          'start_voting_period'
        >['request']['abi'],
        'start_voting_period',
        TMode
      > & { functionName?: 'start_voting_period' }
    : UseContractWriteConfig<typeof prizeABI, 'start_voting_period', TMode> & {
        abi?: never;
        functionName?: 'start_voting_period';
      } = {} as any,
) {
  return useContractWrite<typeof prizeABI, 'start_voting_period', TMode>({
    abi: prizeABI,
    functionName: 'start_voting_period',
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link prizeABI}__ and `functionName` set to `"vote"`.
 */
export function usePrizeVote<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof prizeABI, 'vote'>['request']['abi'],
        'vote',
        TMode
      > & { functionName?: 'vote' }
    : UseContractWriteConfig<typeof prizeABI, 'vote', TMode> & {
        abi?: never;
        functionName?: 'vote';
      } = {} as any,
) {
  return useContractWrite<typeof prizeABI, 'vote', TMode>({
    abi: prizeABI,
    functionName: 'vote',
    ...config,
  } as any);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link prizeABI}__.
 */
export function usePreparePrizeWrite<TFunctionName extends string>(
  config: Omit<
    UsePrepareContractWriteConfig<typeof prizeABI, TFunctionName>,
    'abi'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: prizeABI,
    ...config,
  } as UsePrepareContractWriteConfig<typeof prizeABI, TFunctionName>);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link prizeABI}__ and `functionName` set to `"addFunds"`.
 */
export function usePreparePrizeAddFunds(
  config: Omit<
    UsePrepareContractWriteConfig<typeof prizeABI, 'addFunds'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: prizeABI,
    functionName: 'addFunds',
    ...config,
  } as UsePrepareContractWriteConfig<typeof prizeABI, 'addFunds'>);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link prizeABI}__ and `functionName` set to `"addSubmission"`.
 */
export function usePreparePrizeAddSubmission(
  config: Omit<
    UsePrepareContractWriteConfig<typeof prizeABI, 'addSubmission'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: prizeABI,
    functionName: 'addSubmission',
    ...config,
  } as UsePrepareContractWriteConfig<typeof prizeABI, 'addSubmission'>);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link prizeABI}__ and `functionName` set to `"change_vote"`.
 */
export function usePreparePrizeChangeVote(
  config: Omit<
    UsePrepareContractWriteConfig<typeof prizeABI, 'change_vote'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: prizeABI,
    functionName: 'change_vote',
    ...config,
  } as UsePrepareContractWriteConfig<typeof prizeABI, 'change_vote'>);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link prizeABI}__ and `functionName` set to `"earlyRefund"`.
 */
export function usePreparePrizeEarlyRefund(
  config: Omit<
    UsePrepareContractWriteConfig<typeof prizeABI, 'earlyRefund'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: prizeABI,
    functionName: 'earlyRefund',
    ...config,
  } as UsePrepareContractWriteConfig<typeof prizeABI, 'earlyRefund'>);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link prizeABI}__ and `functionName` set to `"end_submission_period"`.
 */
export function usePreparePrizeEndSubmissionPeriod(
  config: Omit<
    UsePrepareContractWriteConfig<typeof prizeABI, 'end_submission_period'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: prizeABI,
    functionName: 'end_submission_period',
    ...config,
  } as UsePrepareContractWriteConfig<typeof prizeABI, 'end_submission_period'>);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link prizeABI}__ and `functionName` set to `"end_voting_period"`.
 */
export function usePreparePrizeEndVotingPeriod(
  config: Omit<
    UsePrepareContractWriteConfig<typeof prizeABI, 'end_voting_period'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: prizeABI,
    functionName: 'end_voting_period',
    ...config,
  } as UsePrepareContractWriteConfig<typeof prizeABI, 'end_voting_period'>);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link prizeABI}__ and `functionName` set to `"increase_submission_period"`.
 */
export function usePreparePrizeIncreaseSubmissionPeriod(
  config: Omit<
    UsePrepareContractWriteConfig<typeof prizeABI, 'increase_submission_period'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: prizeABI,
    functionName: 'increase_submission_period',
    ...config,
  } as UsePrepareContractWriteConfig<typeof prizeABI, 'increase_submission_period'>);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link prizeABI}__ and `functionName` set to `"increase_voting_period"`.
 */
export function usePreparePrizeIncreaseVotingPeriod(
  config: Omit<
    UsePrepareContractWriteConfig<typeof prizeABI, 'increase_voting_period'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: prizeABI,
    functionName: 'increase_voting_period',
    ...config,
  } as UsePrepareContractWriteConfig<typeof prizeABI, 'increase_voting_period'>);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link prizeABI}__ and `functionName` set to `"start_submission_period"`.
 */
export function usePreparePrizeStartSubmissionPeriod(
  config: Omit<
    UsePrepareContractWriteConfig<typeof prizeABI, 'start_submission_period'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: prizeABI,
    functionName: 'start_submission_period',
    ...config,
  } as UsePrepareContractWriteConfig<typeof prizeABI, 'start_submission_period'>);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link prizeABI}__ and `functionName` set to `"start_voting_period"`.
 */
export function usePreparePrizeStartVotingPeriod(
  config: Omit<
    UsePrepareContractWriteConfig<typeof prizeABI, 'start_voting_period'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: prizeABI,
    functionName: 'start_voting_period',
    ...config,
  } as UsePrepareContractWriteConfig<typeof prizeABI, 'start_voting_period'>);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link prizeABI}__ and `functionName` set to `"vote"`.
 */
export function usePreparePrizeVote(
  config: Omit<
    UsePrepareContractWriteConfig<typeof prizeABI, 'vote'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: prizeABI,
    functionName: 'vote',
    ...config,
  } as UsePrepareContractWriteConfig<typeof prizeABI, 'vote'>);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link prizeFactoryABI}__.
 */
export function usePrizeFactoryWrite<
  TFunctionName extends string,
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof prizeFactoryABI, string>['request']['abi'],
        TFunctionName,
        TMode
      >
    : UseContractWriteConfig<typeof prizeFactoryABI, TFunctionName, TMode> & {
        abi?: never;
      } = {} as any,
) {
  return useContractWrite<typeof prizeFactoryABI, TFunctionName, TMode>({
    abi: prizeFactoryABI,
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link prizeFactoryABI}__ and `functionName` set to `"createViaPrize"`.
 */
export function usePrizeFactoryCreateViaPrize<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof prizeFactoryABI,
          'createViaPrize'
        >['request']['abi'],
        'createViaPrize',
        TMode
      > & { functionName?: 'createViaPrize' }
    : UseContractWriteConfig<typeof prizeFactoryABI, 'createViaPrize', TMode> & {
        abi?: never;
        functionName?: 'createViaPrize';
      } = {} as any,
) {
  return useContractWrite<typeof prizeFactoryABI, 'createViaPrize', TMode>({
    abi: prizeFactoryABI,
    functionName: 'createViaPrize',
    ...config,
  } as any);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link prizeFactoryABI}__.
 */
export function usePreparePrizeFactoryWrite<TFunctionName extends string>(
  config: Omit<
    UsePrepareContractWriteConfig<typeof prizeFactoryABI, TFunctionName>,
    'abi'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: prizeFactoryABI,
    ...config,
  } as UsePrepareContractWriteConfig<typeof prizeFactoryABI, TFunctionName>);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link prizeFactoryABI}__ and `functionName` set to `"createViaPrize"`.
 */
export function usePreparePrizeFactoryCreateViaPrize(
  config: Omit<
    UsePrepareContractWriteConfig<typeof prizeFactoryABI, 'createViaPrize'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: prizeFactoryABI,
    functionName: 'createViaPrize',
    ...config,
  } as UsePrepareContractWriteConfig<typeof prizeFactoryABI, 'createViaPrize'>);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link prizeFactoryV2ABI}__.
 *
 * [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x98B1e3ae7Ba79C88877a5dad4F867BEd8D2DaD45)
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
    address: prizeFactoryV2Address[10],
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link prizeFactoryV2ABI}__ and `functionName` set to `"createViaPrize"`.
 *
 * [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x98B1e3ae7Ba79C88877a5dad4F867BEd8D2DaD45)
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
    address: prizeFactoryV2Address[10],
    functionName: 'createViaPrize',
    ...config,
  } as any);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link prizeFactoryV2ABI}__.
 *
 * [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x98B1e3ae7Ba79C88877a5dad4F867BEd8D2DaD45)
 */
export function usePreparePrizeFactoryV2Write<TFunctionName extends string>(
  config: Omit<
    UsePrepareContractWriteConfig<typeof prizeFactoryV2ABI, TFunctionName>,
    'abi' | 'address'
  > & { chainId?: keyof typeof prizeFactoryV2Address } = {} as any,
) {
  return usePrepareContractWrite({
    abi: prizeFactoryV2ABI,
    address: prizeFactoryV2Address[10],
    ...config,
  } as UsePrepareContractWriteConfig<typeof prizeFactoryV2ABI, TFunctionName>);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link prizeFactoryV2ABI}__ and `functionName` set to `"createViaPrize"`.
 *
 * [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x98B1e3ae7Ba79C88877a5dad4F867BEd8D2DaD45)
 */
export function usePreparePrizeFactoryV2CreateViaPrize(
  config: Omit<
    UsePrepareContractWriteConfig<typeof prizeFactoryV2ABI, 'createViaPrize'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof prizeFactoryV2Address } = {} as any,
) {
  return usePrepareContractWrite({
    abi: prizeFactoryV2ABI,
    address: prizeFactoryV2Address[10],
    functionName: 'createViaPrize',
    ...config,
  } as UsePrepareContractWriteConfig<typeof prizeFactoryV2ABI, 'createViaPrize'>);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link prizeJudgesFactoryABI}__.
 *
 * [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x7f1aF102d6EBaa0F673C3C574c58EB052db93675)
 */
export function usePrizeJudgesFactoryWrite<
  TFunctionName extends string,
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof prizeJudgesFactoryAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof prizeJudgesFactoryABI,
          string
        >['request']['abi'],
        TFunctionName,
        TMode
      > & { address?: Address; chainId?: TChainId }
    : UseContractWriteConfig<typeof prizeJudgesFactoryABI, TFunctionName, TMode> & {
        abi?: never;
        address?: never;
        chainId?: TChainId;
      } = {} as any,
) {
  return useContractWrite<typeof prizeJudgesFactoryABI, TFunctionName, TMode>({
    abi: prizeJudgesFactoryABI,
    address: prizeJudgesFactoryAddress[10],
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link prizeJudgesFactoryABI}__ and `functionName` set to `"createViaPrizeJudges"`.
 *
 * [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x7f1aF102d6EBaa0F673C3C574c58EB052db93675)
 */
export function usePrizeJudgesFactoryCreateViaPrizeJudges<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof prizeJudgesFactoryAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof prizeJudgesFactoryABI,
          'createViaPrizeJudges'
        >['request']['abi'],
        'createViaPrizeJudges',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'createViaPrizeJudges' }
    : UseContractWriteConfig<
        typeof prizeJudgesFactoryABI,
        'createViaPrizeJudges',
        TMode
      > & {
        abi?: never;
        address?: never;
        chainId?: TChainId;
        functionName?: 'createViaPrizeJudges';
      } = {} as any,
) {
  return useContractWrite<typeof prizeJudgesFactoryABI, 'createViaPrizeJudges', TMode>({
    abi: prizeJudgesFactoryABI,
    address: prizeJudgesFactoryAddress[10],
    functionName: 'createViaPrizeJudges',
    ...config,
  } as any);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link prizeJudgesFactoryABI}__.
 *
 * [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x7f1aF102d6EBaa0F673C3C574c58EB052db93675)
 */
export function usePreparePrizeJudgesFactoryWrite<TFunctionName extends string>(
  config: Omit<
    UsePrepareContractWriteConfig<typeof prizeJudgesFactoryABI, TFunctionName>,
    'abi' | 'address'
  > & { chainId?: keyof typeof prizeJudgesFactoryAddress } = {} as any,
) {
  return usePrepareContractWrite({
    abi: prizeJudgesFactoryABI,
    address: prizeJudgesFactoryAddress[10],
    ...config,
  } as UsePrepareContractWriteConfig<typeof prizeJudgesFactoryABI, TFunctionName>);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link prizeJudgesFactoryABI}__ and `functionName` set to `"createViaPrizeJudges"`.
 *
 * [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x7f1aF102d6EBaa0F673C3C574c58EB052db93675)
 */
export function usePreparePrizeJudgesFactoryCreateViaPrizeJudges(
  config: Omit<
    UsePrepareContractWriteConfig<typeof prizeJudgesFactoryABI, 'createViaPrizeJudges'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof prizeJudgesFactoryAddress } = {} as any,
) {
  return usePrepareContractWrite({
    abi: prizeJudgesFactoryABI,
    address: prizeJudgesFactoryAddress[10],
    functionName: 'createViaPrizeJudges',
    ...config,
  } as UsePrepareContractWriteConfig<
    typeof prizeJudgesFactoryABI,
    'createViaPrizeJudges'
  >);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link portalFactoryABI}__.
 *
 * [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0xA75b783F132Dea807e9197Ebd200c884Aa1D7fa0)
 */
export function usePortalFactoryWrite<
  TFunctionName extends string,
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof portalFactoryAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof portalFactoryABI, string>['request']['abi'],
        TFunctionName,
        TMode
      > & { address?: Address; chainId?: TChainId }
    : UseContractWriteConfig<typeof portalFactoryABI, TFunctionName, TMode> & {
        abi?: never;
        address?: never;
        chainId?: TChainId;
      } = {} as any,
) {
  return useContractWrite<typeof portalFactoryABI, TFunctionName, TMode>({
    abi: portalFactoryABI,
    address: portalFactoryAddress[10],
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link portalFactoryABI}__ and `functionName` set to `"createPortal"`.
 *
 * [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0xA75b783F132Dea807e9197Ebd200c884Aa1D7fa0)
 */
export function usePortalFactoryCreatePortal<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof portalFactoryAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof portalFactoryABI,
          'createPortal'
        >['request']['abi'],
        'createPortal',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'createPortal' }
    : UseContractWriteConfig<typeof portalFactoryABI, 'createPortal', TMode> & {
        abi?: never;
        address?: never;
        chainId?: TChainId;
        functionName?: 'createPortal';
      } = {} as any,
) {
  return useContractWrite<typeof portalFactoryABI, 'createPortal', TMode>({
    abi: portalFactoryABI,
    address: portalFactoryAddress[10],
    functionName: 'createPortal',
    ...config,
  } as any);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link portalFactoryABI}__.
 *
 * [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0xA75b783F132Dea807e9197Ebd200c884Aa1D7fa0)
 */
export function usePreparePortalFactoryWrite<TFunctionName extends string>(
  config: Omit<
    UsePrepareContractWriteConfig<typeof portalFactoryABI, TFunctionName>,
    'abi' | 'address'
  > & { chainId?: keyof typeof portalFactoryAddress } = {} as any,
) {
  return usePrepareContractWrite({
    abi: portalFactoryABI,
    address: portalFactoryAddress[10],
    ...config,
  } as UsePrepareContractWriteConfig<typeof portalFactoryABI, TFunctionName>);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link portalFactoryABI}__ and `functionName` set to `"createPortal"`.
 *
 * [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0xA75b783F132Dea807e9197Ebd200c884Aa1D7fa0)
 */
export function usePreparePortalFactoryCreatePortal(
  config: Omit<
    UsePrepareContractWriteConfig<typeof portalFactoryABI, 'createPortal'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof portalFactoryAddress } = {} as any,
) {
  return usePrepareContractWrite({
    abi: portalFactoryABI,
    address: portalFactoryAddress[10],
    functionName: 'createPortal',
    ...config,
  } as UsePrepareContractWriteConfig<typeof portalFactoryABI, 'createPortal'>);
}
