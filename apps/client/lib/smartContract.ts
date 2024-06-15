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
 * [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x804dbe3582df3ba70e4f8f59156ecEa38B7A7BF4)
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
 * [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x804dbe3582df3ba70e4f8f59156ecEa38B7A7BF4)
 */
export const prizeFactoryV2Address = {
  10: '0x93c6c16e409ea8b84Ae5292d055bcE2A793D6C41',
} as const;

/**
 * [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x804dbe3582df3ba70e4f8f59156ecEa38B7A7BF4)
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
      { name: '_usdcBridgedAddress', internalType: 'address', type: 'address' },
      { name: '_swapRouter', internalType: 'address', type: 'address' },
      { name: '_usdcToUsdcePool', internalType: 'address', type: 'address' },
      { name: '_usdcToEthPool', internalType: 'address', type: 'address' },
      { name: '_ethPriceAggregator', internalType: 'address', type: 'address' },
      { name: '_wethToken', internalType: 'address', type: 'address' },
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
      { name: 'amount', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'Donation',
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
    stateMutability: 'payable',
    type: 'function',
    inputs: [{ name: '_amountUsdc', internalType: 'uint256', type: 'uint256' }],
    name: 'addBridgedUsdcFunds',
    outputs: [],
  },
  {
    stateMutability: 'payable',
    type: 'function',
    inputs: [{ name: '_amountOutMinimum', internalType: 'uint256', type: 'uint256' }],
    name: 'addEthFunds',
    outputs: [],
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
    ],
    name: 'addUsdcFunds',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    name: 'allFunders',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'bridgedUsdcPool',
    outputs: [{ name: '', internalType: 'contract IUniswapV3Pool', type: 'address' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: '_minimumSlipageFeePercentage', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'changeMinimumSlipageFeePercentage',
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
    inputs: [],
    name: 'ethPriceAggregator',
    outputs: [
      { name: '', internalType: 'contract AggregatorV3Interface', type: 'address' },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'ethUsdcPool',
    outputs: [{ name: '', internalType: 'contract IUniswapV3Pool', type: 'address' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'funderAmount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
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
    name: 'getAllFunders',
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
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: '_submissionTime', internalType: 'uint256', type: 'uint256' }],
    name: 'increaseSubmissionPeriod',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: '_votingTime', internalType: 'uint256', type: 'uint256' }],
    name: 'increaseVotingPeriod',
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
    name: 'isContestant',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'isFunder',
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
    name: 'minimumSlipageFeePercentage',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
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
    inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    name: 'refundRequestedFunders',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
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
    inputs: [],
    name: 'swapRouter',
    outputs: [{ name: '', internalType: 'contract ISwapRouter', type: 'address' }],
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
  { stateMutability: 'payable', type: 'receive' },
] as const;

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
 * Wraps __{@link writeContract}__ with `abi` set to __{@link prizeFactoryV2ABI}__.
 *
 * [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x804dbe3582df3ba70e4f8f59156ecEa38B7A7BF4)
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
 * [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x804dbe3582df3ba70e4f8f59156ecEa38B7A7BF4)
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
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link prizeFactoryV2ABI}__.
 *
 * [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x804dbe3582df3ba70e4f8f59156ecEa38B7A7BF4)
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
 * [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x804dbe3582df3ba70e4f8f59156ecEa38B7A7BF4)
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
 * [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x804dbe3582df3ba70e4f8f59156ecEa38B7A7BF4)
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
 * [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x804dbe3582df3ba70e4f8f59156ecEa38B7A7BF4)
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
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link prizeV2ABI}__ and `functionName` set to `"allFunders"`.
 */
export function usePrizeV2AllFunders<
  TFunctionName extends 'allFunders',
  TSelectData = ReadContractResult<typeof prizeV2ABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof prizeV2ABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: prizeV2ABI,
    functionName: 'allFunders',
    ...config,
  } as UseContractReadConfig<typeof prizeV2ABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link prizeV2ABI}__ and `functionName` set to `"bridgedUsdcPool"`.
 */
export function usePrizeV2BridgedUsdcPool<
  TFunctionName extends 'bridgedUsdcPool',
  TSelectData = ReadContractResult<typeof prizeV2ABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof prizeV2ABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: prizeV2ABI,
    functionName: 'bridgedUsdcPool',
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
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link prizeV2ABI}__ and `functionName` set to `"ethPriceAggregator"`.
 */
export function usePrizeV2EthPriceAggregator<
  TFunctionName extends 'ethPriceAggregator',
  TSelectData = ReadContractResult<typeof prizeV2ABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof prizeV2ABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: prizeV2ABI,
    functionName: 'ethPriceAggregator',
    ...config,
  } as UseContractReadConfig<typeof prizeV2ABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link prizeV2ABI}__ and `functionName` set to `"ethUsdcPool"`.
 */
export function usePrizeV2EthUsdcPool<
  TFunctionName extends 'ethUsdcPool',
  TSelectData = ReadContractResult<typeof prizeV2ABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof prizeV2ABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: prizeV2ABI,
    functionName: 'ethUsdcPool',
    ...config,
  } as UseContractReadConfig<typeof prizeV2ABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link prizeV2ABI}__ and `functionName` set to `"funderAmount"`.
 */
export function usePrizeV2FunderAmount<
  TFunctionName extends 'funderAmount',
  TSelectData = ReadContractResult<typeof prizeV2ABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof prizeV2ABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: prizeV2ABI,
    functionName: 'funderAmount',
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
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link prizeV2ABI}__ and `functionName` set to `"getAllFunders"`.
 */
export function usePrizeV2GetAllFunders<
  TFunctionName extends 'getAllFunders',
  TSelectData = ReadContractResult<typeof prizeV2ABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof prizeV2ABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: prizeV2ABI,
    functionName: 'getAllFunders',
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
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link prizeV2ABI}__ and `functionName` set to `"isFunder"`.
 */
export function usePrizeV2IsFunder<
  TFunctionName extends 'isFunder',
  TSelectData = ReadContractResult<typeof prizeV2ABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof prizeV2ABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: prizeV2ABI,
    functionName: 'isFunder',
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
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link prizeV2ABI}__ and `functionName` set to `"minimumSlipageFeePercentage"`.
 */
export function usePrizeV2MinimumSlipageFeePercentage<
  TFunctionName extends 'minimumSlipageFeePercentage',
  TSelectData = ReadContractResult<typeof prizeV2ABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof prizeV2ABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: prizeV2ABI,
    functionName: 'minimumSlipageFeePercentage',
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
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link prizeV2ABI}__ and `functionName` set to `"swapRouter"`.
 */
export function usePrizeV2SwapRouter<
  TFunctionName extends 'swapRouter',
  TSelectData = ReadContractResult<typeof prizeV2ABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof prizeV2ABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: prizeV2ABI,
    functionName: 'swapRouter',
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
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link prizeV2ABI}__ and `functionName` set to `"addBridgedUsdcFunds"`.
 */
export function usePrizeV2AddBridgedUsdcFunds<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof prizeV2ABI,
          'addBridgedUsdcFunds'
        >['request']['abi'],
        'addBridgedUsdcFunds',
        TMode
      > & { functionName?: 'addBridgedUsdcFunds' }
    : UseContractWriteConfig<typeof prizeV2ABI, 'addBridgedUsdcFunds', TMode> & {
        abi?: never;
        functionName?: 'addBridgedUsdcFunds';
      } = {} as any,
) {
  return useContractWrite<typeof prizeV2ABI, 'addBridgedUsdcFunds', TMode>({
    abi: prizeV2ABI,
    functionName: 'addBridgedUsdcFunds',
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link prizeV2ABI}__ and `functionName` set to `"addEthFunds"`.
 */
export function usePrizeV2AddEthFunds<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof prizeV2ABI, 'addEthFunds'>['request']['abi'],
        'addEthFunds',
        TMode
      > & { functionName?: 'addEthFunds' }
    : UseContractWriteConfig<typeof prizeV2ABI, 'addEthFunds', TMode> & {
        abi?: never;
        functionName?: 'addEthFunds';
      } = {} as any,
) {
  return useContractWrite<typeof prizeV2ABI, 'addEthFunds', TMode>({
    abi: prizeV2ABI,
    functionName: 'addEthFunds',
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
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link prizeV2ABI}__ and `functionName` set to `"changeMinimumSlipageFeePercentage"`.
 */
export function usePrizeV2ChangeMinimumSlipageFeePercentage<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof prizeV2ABI,
          'changeMinimumSlipageFeePercentage'
        >['request']['abi'],
        'changeMinimumSlipageFeePercentage',
        TMode
      > & { functionName?: 'changeMinimumSlipageFeePercentage' }
    : UseContractWriteConfig<
        typeof prizeV2ABI,
        'changeMinimumSlipageFeePercentage',
        TMode
      > & {
        abi?: never;
        functionName?: 'changeMinimumSlipageFeePercentage';
      } = {} as any,
) {
  return useContractWrite<typeof prizeV2ABI, 'changeMinimumSlipageFeePercentage', TMode>({
    abi: prizeV2ABI,
    functionName: 'changeMinimumSlipageFeePercentage',
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
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link prizeV2ABI}__ and `functionName` set to `"increaseSubmissionPeriod"`.
 */
export function usePrizeV2IncreaseSubmissionPeriod<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof prizeV2ABI,
          'increaseSubmissionPeriod'
        >['request']['abi'],
        'increaseSubmissionPeriod',
        TMode
      > & { functionName?: 'increaseSubmissionPeriod' }
    : UseContractWriteConfig<typeof prizeV2ABI, 'increaseSubmissionPeriod', TMode> & {
        abi?: never;
        functionName?: 'increaseSubmissionPeriod';
      } = {} as any,
) {
  return useContractWrite<typeof prizeV2ABI, 'increaseSubmissionPeriod', TMode>({
    abi: prizeV2ABI,
    functionName: 'increaseSubmissionPeriod',
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link prizeV2ABI}__ and `functionName` set to `"increaseVotingPeriod"`.
 */
export function usePrizeV2IncreaseVotingPeriod<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof prizeV2ABI,
          'increaseVotingPeriod'
        >['request']['abi'],
        'increaseVotingPeriod',
        TMode
      > & { functionName?: 'increaseVotingPeriod' }
    : UseContractWriteConfig<typeof prizeV2ABI, 'increaseVotingPeriod', TMode> & {
        abi?: never;
        functionName?: 'increaseVotingPeriod';
      } = {} as any,
) {
  return useContractWrite<typeof prizeV2ABI, 'increaseVotingPeriod', TMode>({
    abi: prizeV2ABI,
    functionName: 'increaseVotingPeriod',
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
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link prizeV2ABI}__ and `functionName` set to `"addBridgedUsdcFunds"`.
 */
export function usePreparePrizeV2AddBridgedUsdcFunds(
  config: Omit<
    UsePrepareContractWriteConfig<typeof prizeV2ABI, 'addBridgedUsdcFunds'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: prizeV2ABI,
    functionName: 'addBridgedUsdcFunds',
    ...config,
  } as UsePrepareContractWriteConfig<typeof prizeV2ABI, 'addBridgedUsdcFunds'>);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link prizeV2ABI}__ and `functionName` set to `"addEthFunds"`.
 */
export function usePreparePrizeV2AddEthFunds(
  config: Omit<
    UsePrepareContractWriteConfig<typeof prizeV2ABI, 'addEthFunds'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: prizeV2ABI,
    functionName: 'addEthFunds',
    ...config,
  } as UsePrepareContractWriteConfig<typeof prizeV2ABI, 'addEthFunds'>);
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
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link prizeV2ABI}__ and `functionName` set to `"changeMinimumSlipageFeePercentage"`.
 */
export function usePreparePrizeV2ChangeMinimumSlipageFeePercentage(
  config: Omit<
    UsePrepareContractWriteConfig<typeof prizeV2ABI, 'changeMinimumSlipageFeePercentage'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: prizeV2ABI,
    functionName: 'changeMinimumSlipageFeePercentage',
    ...config,
  } as UsePrepareContractWriteConfig<
    typeof prizeV2ABI,
    'changeMinimumSlipageFeePercentage'
  >);
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
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link prizeV2ABI}__ and `functionName` set to `"increaseSubmissionPeriod"`.
 */
export function usePreparePrizeV2IncreaseSubmissionPeriod(
  config: Omit<
    UsePrepareContractWriteConfig<typeof prizeV2ABI, 'increaseSubmissionPeriod'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: prizeV2ABI,
    functionName: 'increaseSubmissionPeriod',
    ...config,
  } as UsePrepareContractWriteConfig<typeof prizeV2ABI, 'increaseSubmissionPeriod'>);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link prizeV2ABI}__ and `functionName` set to `"increaseVotingPeriod"`.
 */
export function usePreparePrizeV2IncreaseVotingPeriod(
  config: Omit<
    UsePrepareContractWriteConfig<typeof prizeV2ABI, 'increaseVotingPeriod'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: prizeV2ABI,
    functionName: 'increaseVotingPeriod',
    ...config,
  } as UsePrepareContractWriteConfig<typeof prizeV2ABI, 'increaseVotingPeriod'>);
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
