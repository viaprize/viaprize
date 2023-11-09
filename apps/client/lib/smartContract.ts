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
  UseContractEventConfig,
  UseContractReadConfig,
  UseContractWriteConfig,
  UsePrepareContractWriteConfig,
  useContractEvent,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
} from 'wagmi';
import {
  PrepareWriteContractResult,
  ReadContractResult,
} from 'wagmi/actions';

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Ownable
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const ownableABI = [
  {
    type: 'error',
    inputs: [{ name: 'owner', internalType: 'address', type: 'address' }],
    name: 'OwnableInvalidOwner',
  },
  {
    type: 'error',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'OwnableUnauthorizedAccount',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'previousOwner', internalType: 'address', type: 'address', indexed: true },
      { name: 'newOwner', internalType: 'address', type: 'address', indexed: true },
    ],
    name: 'OwnershipTransferred',
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: 'newOwner', internalType: 'address', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
  },
] as const;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// SubmissionAVLTree
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const submissionAvlTreeABI = [
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'submissionHash', internalType: 'bytes32', type: 'bytes32' },
      { name: 'votes', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'addVotes',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'submitter', internalType: 'address', type: 'address' },
      { name: 'submissionHash', internalType: 'bytes32', type: 'bytes32' },
      { name: 'submissionText', internalType: 'string', type: 'string' },
    ],
    name: 'add_submission',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'submissionHash', internalType: 'bytes32', type: 'bytes32' }],
    name: 'findSubmission',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
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
    inputs: [{ name: 'submissionHash', internalType: 'bytes32', type: 'bytes32' }],
    name: 'getSubmission',
    outputs: [
      {
        name: '',
        internalType: 'struct SubmissionAVLTree.SubmissionInfo',
        type: 'tuple',
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
    inputs: [{ name: 'submissionHash', internalType: 'bytes32', type: 'bytes32' }],
    name: 'getSubmissionVote',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'inOrderTraversal',
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
    name: 'root',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'submissionHash', internalType: 'bytes32', type: 'bytes32' },
      { name: 'status', internalType: 'bool', type: 'bool' },
    ],
    name: 'setFundedTrue',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'submissionHash', internalType: 'bytes32', type: 'bytes32' },
      { name: 'votes', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'subVotes',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      { name: '', internalType: 'bytes32', type: 'bytes32' },
      { name: '', internalType: 'address', type: 'address' },
    ],
    name: 'submissionFunderBalances',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    name: 'submissions',
    outputs: [
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
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: '_submissionHash', internalType: 'bytes32', type: 'bytes32' },
      { name: 'funder', internalType: 'address', type: 'address' },
      { name: 'balances', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'updateFunderBalance',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'submissionHash', internalType: 'bytes32', type: 'bytes32' }],
    name: 'votesGreaterThanZero',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
] as const;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ViaPrize
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const viaPrizeABI = [
  {
    stateMutability: 'nonpayable',
    type: 'constructor',
    inputs: [
      { name: '_admins', internalType: 'address[]', type: 'address[]' },
      { name: '_platformAdmins', internalType: 'address[]', type: 'address[]' },
      { name: '_platFormFee', internalType: 'uint256', type: 'uint256' },
      { name: '_proposerFee', internalType: 'uint256', type: 'uint256' },
      { name: '_platformAddress', internalType: 'address', type: 'address' },
    ],
  },
  { type: 'error', inputs: [], name: 'NotAdmin' },
  { type: 'error', inputs: [], name: 'NotEnoughFunds' },
  { type: 'error', inputs: [], name: 'NotYourVote' },
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
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'addressRefunded',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    name: 'admins',
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
    inputs: [{ name: 'recipient', internalType: 'address', type: 'address' }],
    name: 'check_refund_amount',
    outputs: [{ name: '_refundAmount', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: 'recipient', internalType: 'address', type: 'address' }],
    name: 'claimRefund',
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
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'funders',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
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
    name: 'isPlatformAdmin',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
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
    inputs: [
      { name: '', internalType: 'bytes32', type: 'bytes32' },
      { name: '', internalType: 'address', type: 'address' },
    ],
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
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: '_submissionHash', internalType: 'bytes32', type: 'bytes32' }],
    name: 'use_unused_votes',
    outputs: [],
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
  { stateMutability: 'payable', type: 'receive' },
] as const;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ViaPrizeFactory
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0dd8d97E5b41010F5a47dAA2217aed175Ad15dd4)
 */
export const viaPrizeFactoryABI = [
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
      { name: '_contractId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'createViaPrize',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
  },
] as const;

/**
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0dd8d97E5b41010F5a47dAA2217aed175Ad15dd4)
 */
export const viaPrizeFactoryAddress = {
  1: '0x0dd8d97E5b41010F5a47dAA2217aed175Ad15dd4',
} as const;

/**
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0dd8d97E5b41010F5a47dAA2217aed175Ad15dd4)
 */
export const viaPrizeFactoryConfig = {
  address: viaPrizeFactoryAddress,
  abi: viaPrizeFactoryABI,
} as const;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Core
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link ownableABI}__.
 */
export function writeOwnable<TFunctionName extends string>(
  config:
    | Omit<WriteContractPreparedArgs<typeof ownableABI, TFunctionName>, 'abi'>
    | Omit<WriteContractUnpreparedArgs<typeof ownableABI, TFunctionName>, 'abi'>,
) {
  return writeContract({ abi: ownableABI, ...config } as unknown as WriteContractArgs<
    typeof ownableABI,
    TFunctionName
  >);
}

/**
 * Wraps __{@link prepareWriteContract}__ with `abi` set to __{@link ownableABI}__.
 */
export function prepareWriteOwnable<
  TAbi extends readonly unknown[] = typeof ownableABI,
  TFunctionName extends string = string,
>(config: Omit<PrepareWriteContractConfig<TAbi, TFunctionName>, 'abi'>) {
  return prepareWriteContract({
    abi: ownableABI,
    ...config,
  } as unknown as PrepareWriteContractConfig<TAbi, TFunctionName>);
}

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link submissionAvlTreeABI}__.
 */
export function writeSubmissionAvlTree<TFunctionName extends string>(
  config:
    | Omit<WriteContractPreparedArgs<typeof submissionAvlTreeABI, TFunctionName>, 'abi'>
    | Omit<
      WriteContractUnpreparedArgs<typeof submissionAvlTreeABI, TFunctionName>,
      'abi'
    >,
) {
  return writeContract({
    abi: submissionAvlTreeABI,
    ...config,
  } as unknown as WriteContractArgs<typeof submissionAvlTreeABI, TFunctionName>);
}

/**
 * Wraps __{@link prepareWriteContract}__ with `abi` set to __{@link submissionAvlTreeABI}__.
 */
export function prepareWriteSubmissionAvlTree<
  TAbi extends readonly unknown[] = typeof submissionAvlTreeABI,
  TFunctionName extends string = string,
>(config: Omit<PrepareWriteContractConfig<TAbi, TFunctionName>, 'abi'>) {
  return prepareWriteContract({
    abi: submissionAvlTreeABI,
    ...config,
  } as unknown as PrepareWriteContractConfig<TAbi, TFunctionName>);
}

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link viaPrizeABI}__.
 */
export function writeViaPrize<TFunctionName extends string>(
  config:
    | Omit<WriteContractPreparedArgs<typeof viaPrizeABI, TFunctionName>, 'abi'>
    | Omit<WriteContractUnpreparedArgs<typeof viaPrizeABI, TFunctionName>, 'abi'>,
) {
  return writeContract({ abi: viaPrizeABI, ...config } as unknown as WriteContractArgs<
    typeof viaPrizeABI,
    TFunctionName
  >);
}

/**
 * Wraps __{@link prepareWriteContract}__ with `abi` set to __{@link viaPrizeABI}__.
 */
export function prepareWriteViaPrize<
  TAbi extends readonly unknown[] = typeof viaPrizeABI,
  TFunctionName extends string = string,
>(config: Omit<PrepareWriteContractConfig<TAbi, TFunctionName>, 'abi'>) {
  return prepareWriteContract({
    abi: viaPrizeABI,
    ...config,
  } as unknown as PrepareWriteContractConfig<TAbi, TFunctionName>);
}

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link viaPrizeFactoryABI}__.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0dd8d97E5b41010F5a47dAA2217aed175Ad15dd4)
 */
export function writeViaPrizeFactory<
  TFunctionName extends string,
  TMode extends WriteContractMode,
  TChainId extends number = keyof typeof viaPrizeFactoryAddress,
>(
  config:
    | (Omit<
      WriteContractPreparedArgs<typeof viaPrizeFactoryABI, TFunctionName>,
      'abi' | 'address'
    > & {
      mode: TMode;
      chainId?: TMode extends 'prepared'
      ? TChainId
      : keyof typeof viaPrizeFactoryAddress;
    })
    | (Omit<
      WriteContractUnpreparedArgs<typeof viaPrizeFactoryABI, TFunctionName>,
      'abi' | 'address'
    > & {
      mode: TMode;
      chainId?: TMode extends 'prepared'
      ? TChainId
      : keyof typeof viaPrizeFactoryAddress;
    }),
) {
  return writeContract({
    abi: viaPrizeFactoryABI,
    address: viaPrizeFactoryAddress[1],
    ...config,
  } as unknown as WriteContractArgs<typeof viaPrizeFactoryABI, TFunctionName>);
}

/**
 * Wraps __{@link prepareWriteContract}__ with `abi` set to __{@link viaPrizeFactoryABI}__.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0dd8d97E5b41010F5a47dAA2217aed175Ad15dd4)
 */
export function prepareWriteViaPrizeFactory<
  TAbi extends readonly unknown[] = typeof viaPrizeFactoryABI,
  TFunctionName extends string = string,
>(
  config: Omit<PrepareWriteContractConfig<TAbi, TFunctionName>, 'abi' | 'address'> & {
    chainId?: keyof typeof viaPrizeFactoryAddress;
  },
) {
  return prepareWriteContract({
    abi: viaPrizeFactoryABI,
    address: viaPrizeFactoryAddress[1],
    ...config,
  } as unknown as PrepareWriteContractConfig<TAbi, TFunctionName>);
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// React
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link ownableABI}__.
 */
export function useOwnableRead<
  TFunctionName extends string,
  TSelectData = ReadContractResult<typeof ownableABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof ownableABI, TFunctionName, TSelectData>,
    'abi'
  > = {} as any,
) {
  return useContractRead({ abi: ownableABI, ...config } as UseContractReadConfig<
    typeof ownableABI,
    TFunctionName,
    TSelectData
  >);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link ownableABI}__ and `functionName` set to `"owner"`.
 */
export function useOwnableOwner<
  TFunctionName extends 'owner',
  TSelectData = ReadContractResult<typeof ownableABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof ownableABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: ownableABI,
    functionName: 'owner',
    ...config,
  } as UseContractReadConfig<typeof ownableABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link ownableABI}__.
 */
export function useOwnableWrite<
  TFunctionName extends string,
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
      PrepareWriteContractResult<typeof ownableABI, string>['request']['abi'],
      TFunctionName,
      TMode
    >
    : UseContractWriteConfig<typeof ownableABI, TFunctionName, TMode> & {
      abi?: never;
    } = {} as any,
) {
  return useContractWrite<typeof ownableABI, TFunctionName, TMode>({
    abi: ownableABI,
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link ownableABI}__ and `functionName` set to `"renounceOwnership"`.
 */
export function useOwnableRenounceOwnership<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
      PrepareWriteContractResult<
        typeof ownableABI,
        'renounceOwnership'
      >['request']['abi'],
      'renounceOwnership',
      TMode
    > & { functionName?: 'renounceOwnership' }
    : UseContractWriteConfig<typeof ownableABI, 'renounceOwnership', TMode> & {
      abi?: never;
      functionName?: 'renounceOwnership';
    } = {} as any,
) {
  return useContractWrite<typeof ownableABI, 'renounceOwnership', TMode>({
    abi: ownableABI,
    functionName: 'renounceOwnership',
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link ownableABI}__ and `functionName` set to `"transferOwnership"`.
 */
export function useOwnableTransferOwnership<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
      PrepareWriteContractResult<
        typeof ownableABI,
        'transferOwnership'
      >['request']['abi'],
      'transferOwnership',
      TMode
    > & { functionName?: 'transferOwnership' }
    : UseContractWriteConfig<typeof ownableABI, 'transferOwnership', TMode> & {
      abi?: never;
      functionName?: 'transferOwnership';
    } = {} as any,
) {
  return useContractWrite<typeof ownableABI, 'transferOwnership', TMode>({
    abi: ownableABI,
    functionName: 'transferOwnership',
    ...config,
  } as any);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link ownableABI}__.
 */
export function usePrepareOwnableWrite<TFunctionName extends string>(
  config: Omit<
    UsePrepareContractWriteConfig<typeof ownableABI, TFunctionName>,
    'abi'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: ownableABI,
    ...config,
  } as UsePrepareContractWriteConfig<typeof ownableABI, TFunctionName>);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link ownableABI}__ and `functionName` set to `"renounceOwnership"`.
 */
export function usePrepareOwnableRenounceOwnership(
  config: Omit<
    UsePrepareContractWriteConfig<typeof ownableABI, 'renounceOwnership'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: ownableABI,
    functionName: 'renounceOwnership',
    ...config,
  } as UsePrepareContractWriteConfig<typeof ownableABI, 'renounceOwnership'>);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link ownableABI}__ and `functionName` set to `"transferOwnership"`.
 */
export function usePrepareOwnableTransferOwnership(
  config: Omit<
    UsePrepareContractWriteConfig<typeof ownableABI, 'transferOwnership'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: ownableABI,
    functionName: 'transferOwnership',
    ...config,
  } as UsePrepareContractWriteConfig<typeof ownableABI, 'transferOwnership'>);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link ownableABI}__.
 */
export function useOwnableEvent<TEventName extends string>(
  config: Omit<UseContractEventConfig<typeof ownableABI, TEventName>, 'abi'> = {} as any,
) {
  return useContractEvent({ abi: ownableABI, ...config } as UseContractEventConfig<
    typeof ownableABI,
    TEventName
  >);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link ownableABI}__ and `eventName` set to `"OwnershipTransferred"`.
 */
export function useOwnableOwnershipTransferredEvent(
  config: Omit<
    UseContractEventConfig<typeof ownableABI, 'OwnershipTransferred'>,
    'abi' | 'eventName'
  > = {} as any,
) {
  return useContractEvent({
    abi: ownableABI,
    eventName: 'OwnershipTransferred',
    ...config,
  } as UseContractEventConfig<typeof ownableABI, 'OwnershipTransferred'>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link submissionAvlTreeABI}__.
 */
export function useSubmissionAvlTreeRead<
  TFunctionName extends string,
  TSelectData = ReadContractResult<typeof submissionAvlTreeABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof submissionAvlTreeABI, TFunctionName, TSelectData>,
    'abi'
  > = {} as any,
) {
  return useContractRead({
    abi: submissionAvlTreeABI,
    ...config,
  } as UseContractReadConfig<typeof submissionAvlTreeABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link submissionAvlTreeABI}__ and `functionName` set to `"findSubmission"`.
 */
export function useSubmissionAvlTreeFindSubmission<
  TFunctionName extends 'findSubmission',
  TSelectData = ReadContractResult<typeof submissionAvlTreeABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof submissionAvlTreeABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: submissionAvlTreeABI,
    functionName: 'findSubmission',
    ...config,
  } as UseContractReadConfig<typeof submissionAvlTreeABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link submissionAvlTreeABI}__ and `functionName` set to `"getAllSubmissions"`.
 */
export function useSubmissionAvlTreeGetAllSubmissions<
  TFunctionName extends 'getAllSubmissions',
  TSelectData = ReadContractResult<typeof submissionAvlTreeABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof submissionAvlTreeABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: submissionAvlTreeABI,
    functionName: 'getAllSubmissions',
    ...config,
  } as UseContractReadConfig<typeof submissionAvlTreeABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link submissionAvlTreeABI}__ and `functionName` set to `"getSubmission"`.
 */
export function useSubmissionAvlTreeGetSubmission<
  TFunctionName extends 'getSubmission',
  TSelectData = ReadContractResult<typeof submissionAvlTreeABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof submissionAvlTreeABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: submissionAvlTreeABI,
    functionName: 'getSubmission',
    ...config,
  } as UseContractReadConfig<typeof submissionAvlTreeABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link submissionAvlTreeABI}__ and `functionName` set to `"getSubmissionVote"`.
 */
export function useSubmissionAvlTreeGetSubmissionVote<
  TFunctionName extends 'getSubmissionVote',
  TSelectData = ReadContractResult<typeof submissionAvlTreeABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof submissionAvlTreeABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: submissionAvlTreeABI,
    functionName: 'getSubmissionVote',
    ...config,
  } as UseContractReadConfig<typeof submissionAvlTreeABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link submissionAvlTreeABI}__ and `functionName` set to `"inOrderTraversal"`.
 */
export function useSubmissionAvlTreeInOrderTraversal<
  TFunctionName extends 'inOrderTraversal',
  TSelectData = ReadContractResult<typeof submissionAvlTreeABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof submissionAvlTreeABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: submissionAvlTreeABI,
    functionName: 'inOrderTraversal',
    ...config,
  } as UseContractReadConfig<typeof submissionAvlTreeABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link submissionAvlTreeABI}__ and `functionName` set to `"root"`.
 */
export function useSubmissionAvlTreeRoot<
  TFunctionName extends 'root',
  TSelectData = ReadContractResult<typeof submissionAvlTreeABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof submissionAvlTreeABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: submissionAvlTreeABI,
    functionName: 'root',
    ...config,
  } as UseContractReadConfig<typeof submissionAvlTreeABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link submissionAvlTreeABI}__ and `functionName` set to `"submissionFunderBalances"`.
 */
export function useSubmissionAvlTreeSubmissionFunderBalances<
  TFunctionName extends 'submissionFunderBalances',
  TSelectData = ReadContractResult<typeof submissionAvlTreeABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof submissionAvlTreeABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: submissionAvlTreeABI,
    functionName: 'submissionFunderBalances',
    ...config,
  } as UseContractReadConfig<typeof submissionAvlTreeABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link submissionAvlTreeABI}__ and `functionName` set to `"submissions"`.
 */
export function useSubmissionAvlTreeSubmissions<
  TFunctionName extends 'submissions',
  TSelectData = ReadContractResult<typeof submissionAvlTreeABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof submissionAvlTreeABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: submissionAvlTreeABI,
    functionName: 'submissions',
    ...config,
  } as UseContractReadConfig<typeof submissionAvlTreeABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link submissionAvlTreeABI}__ and `functionName` set to `"votesGreaterThanZero"`.
 */
export function useSubmissionAvlTreeVotesGreaterThanZero<
  TFunctionName extends 'votesGreaterThanZero',
  TSelectData = ReadContractResult<typeof submissionAvlTreeABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof submissionAvlTreeABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: submissionAvlTreeABI,
    functionName: 'votesGreaterThanZero',
    ...config,
  } as UseContractReadConfig<typeof submissionAvlTreeABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link submissionAvlTreeABI}__.
 */
export function useSubmissionAvlTreeWrite<
  TFunctionName extends string,
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
      PrepareWriteContractResult<typeof submissionAvlTreeABI, string>['request']['abi'],
      TFunctionName,
      TMode
    >
    : UseContractWriteConfig<typeof submissionAvlTreeABI, TFunctionName, TMode> & {
      abi?: never;
    } = {} as any,
) {
  return useContractWrite<typeof submissionAvlTreeABI, TFunctionName, TMode>({
    abi: submissionAvlTreeABI,
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link submissionAvlTreeABI}__ and `functionName` set to `"addVotes"`.
 */
export function useSubmissionAvlTreeAddVotes<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
      PrepareWriteContractResult<
        typeof submissionAvlTreeABI,
        'addVotes'
      >['request']['abi'],
      'addVotes',
      TMode
    > & { functionName?: 'addVotes' }
    : UseContractWriteConfig<typeof submissionAvlTreeABI, 'addVotes', TMode> & {
      abi?: never;
      functionName?: 'addVotes';
    } = {} as any,
) {
  return useContractWrite<typeof submissionAvlTreeABI, 'addVotes', TMode>({
    abi: submissionAvlTreeABI,
    functionName: 'addVotes',
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link submissionAvlTreeABI}__ and `functionName` set to `"add_submission"`.
 */
export function useSubmissionAvlTreeAddSubmission<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
      PrepareWriteContractResult<
        typeof submissionAvlTreeABI,
        'add_submission'
      >['request']['abi'],
      'add_submission',
      TMode
    > & { functionName?: 'add_submission' }
    : UseContractWriteConfig<typeof submissionAvlTreeABI, 'add_submission', TMode> & {
      abi?: never;
      functionName?: 'add_submission';
    } = {} as any,
) {
  return useContractWrite<typeof submissionAvlTreeABI, 'add_submission', TMode>({
    abi: submissionAvlTreeABI,
    functionName: 'add_submission',
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link submissionAvlTreeABI}__ and `functionName` set to `"setFundedTrue"`.
 */
export function useSubmissionAvlTreeSetFundedTrue<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
      PrepareWriteContractResult<
        typeof submissionAvlTreeABI,
        'setFundedTrue'
      >['request']['abi'],
      'setFundedTrue',
      TMode
    > & { functionName?: 'setFundedTrue' }
    : UseContractWriteConfig<typeof submissionAvlTreeABI, 'setFundedTrue', TMode> & {
      abi?: never;
      functionName?: 'setFundedTrue';
    } = {} as any,
) {
  return useContractWrite<typeof submissionAvlTreeABI, 'setFundedTrue', TMode>({
    abi: submissionAvlTreeABI,
    functionName: 'setFundedTrue',
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link submissionAvlTreeABI}__ and `functionName` set to `"subVotes"`.
 */
export function useSubmissionAvlTreeSubVotes<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
      PrepareWriteContractResult<
        typeof submissionAvlTreeABI,
        'subVotes'
      >['request']['abi'],
      'subVotes',
      TMode
    > & { functionName?: 'subVotes' }
    : UseContractWriteConfig<typeof submissionAvlTreeABI, 'subVotes', TMode> & {
      abi?: never;
      functionName?: 'subVotes';
    } = {} as any,
) {
  return useContractWrite<typeof submissionAvlTreeABI, 'subVotes', TMode>({
    abi: submissionAvlTreeABI,
    functionName: 'subVotes',
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link submissionAvlTreeABI}__ and `functionName` set to `"updateFunderBalance"`.
 */
export function useSubmissionAvlTreeUpdateFunderBalance<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
      PrepareWriteContractResult<
        typeof submissionAvlTreeABI,
        'updateFunderBalance'
      >['request']['abi'],
      'updateFunderBalance',
      TMode
    > & { functionName?: 'updateFunderBalance' }
    : UseContractWriteConfig<
      typeof submissionAvlTreeABI,
      'updateFunderBalance',
      TMode
    > & {
      abi?: never;
      functionName?: 'updateFunderBalance';
    } = {} as any,
) {
  return useContractWrite<typeof submissionAvlTreeABI, 'updateFunderBalance', TMode>({
    abi: submissionAvlTreeABI,
    functionName: 'updateFunderBalance',
    ...config,
  } as any);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link submissionAvlTreeABI}__.
 */
export function usePrepareSubmissionAvlTreeWrite<TFunctionName extends string>(
  config: Omit<
    UsePrepareContractWriteConfig<typeof submissionAvlTreeABI, TFunctionName>,
    'abi'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: submissionAvlTreeABI,
    ...config,
  } as UsePrepareContractWriteConfig<typeof submissionAvlTreeABI, TFunctionName>);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link submissionAvlTreeABI}__ and `functionName` set to `"addVotes"`.
 */
export function usePrepareSubmissionAvlTreeAddVotes(
  config: Omit<
    UsePrepareContractWriteConfig<typeof submissionAvlTreeABI, 'addVotes'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: submissionAvlTreeABI,
    functionName: 'addVotes',
    ...config,
  } as UsePrepareContractWriteConfig<typeof submissionAvlTreeABI, 'addVotes'>);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link submissionAvlTreeABI}__ and `functionName` set to `"add_submission"`.
 */
export function usePrepareSubmissionAvlTreeAddSubmission(
  config: Omit<
    UsePrepareContractWriteConfig<typeof submissionAvlTreeABI, 'add_submission'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: submissionAvlTreeABI,
    functionName: 'add_submission',
    ...config,
  } as UsePrepareContractWriteConfig<typeof submissionAvlTreeABI, 'add_submission'>);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link submissionAvlTreeABI}__ and `functionName` set to `"setFundedTrue"`.
 */
export function usePrepareSubmissionAvlTreeSetFundedTrue(
  config: Omit<
    UsePrepareContractWriteConfig<typeof submissionAvlTreeABI, 'setFundedTrue'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: submissionAvlTreeABI,
    functionName: 'setFundedTrue',
    ...config,
  } as UsePrepareContractWriteConfig<typeof submissionAvlTreeABI, 'setFundedTrue'>);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link submissionAvlTreeABI}__ and `functionName` set to `"subVotes"`.
 */
export function usePrepareSubmissionAvlTreeSubVotes(
  config: Omit<
    UsePrepareContractWriteConfig<typeof submissionAvlTreeABI, 'subVotes'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: submissionAvlTreeABI,
    functionName: 'subVotes',
    ...config,
  } as UsePrepareContractWriteConfig<typeof submissionAvlTreeABI, 'subVotes'>);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link submissionAvlTreeABI}__ and `functionName` set to `"updateFunderBalance"`.
 */
export function usePrepareSubmissionAvlTreeUpdateFunderBalance(
  config: Omit<
    UsePrepareContractWriteConfig<typeof submissionAvlTreeABI, 'updateFunderBalance'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: submissionAvlTreeABI,
    functionName: 'updateFunderBalance',
    ...config,
  } as UsePrepareContractWriteConfig<typeof submissionAvlTreeABI, 'updateFunderBalance'>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link viaPrizeABI}__.
 */
export function useViaPrizeRead<
  TFunctionName extends string,
  TSelectData = ReadContractResult<typeof viaPrizeABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof viaPrizeABI, TFunctionName, TSelectData>,
    'abi'
  > = {} as any,
) {
  return useContractRead({ abi: viaPrizeABI, ...config } as UseContractReadConfig<
    typeof viaPrizeABI,
    TFunctionName,
    TSelectData
  >);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link viaPrizeABI}__ and `functionName` set to `"addressRefunded"`.
 */
export function useViaPrizeAddressRefunded<
  TFunctionName extends 'addressRefunded',
  TSelectData = ReadContractResult<typeof viaPrizeABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof viaPrizeABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: viaPrizeABI,
    functionName: 'addressRefunded',
    ...config,
  } as UseContractReadConfig<typeof viaPrizeABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link viaPrizeABI}__ and `functionName` set to `"admins"`.
 */
export function useViaPrizeAdmins<
  TFunctionName extends 'admins',
  TSelectData = ReadContractResult<typeof viaPrizeABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof viaPrizeABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: viaPrizeABI,
    functionName: 'admins',
    ...config,
  } as UseContractReadConfig<typeof viaPrizeABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link viaPrizeABI}__ and `functionName` set to `"check_refund_amount"`.
 */
export function useViaPrizeCheckRefundAmount<
  TFunctionName extends 'check_refund_amount',
  TSelectData = ReadContractResult<typeof viaPrizeABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof viaPrizeABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: viaPrizeABI,
    functionName: 'check_refund_amount',
    ...config,
  } as UseContractReadConfig<typeof viaPrizeABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link viaPrizeABI}__ and `functionName` set to `"distributed"`.
 */
export function useViaPrizeDistributed<
  TFunctionName extends 'distributed',
  TSelectData = ReadContractResult<typeof viaPrizeABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof viaPrizeABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: viaPrizeABI,
    functionName: 'distributed',
    ...config,
  } as UseContractReadConfig<typeof viaPrizeABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link viaPrizeABI}__ and `functionName` set to `"funderVotes"`.
 */
export function useViaPrizeFunderVotes<
  TFunctionName extends 'funderVotes',
  TSelectData = ReadContractResult<typeof viaPrizeABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof viaPrizeABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: viaPrizeABI,
    functionName: 'funderVotes',
    ...config,
  } as UseContractReadConfig<typeof viaPrizeABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link viaPrizeABI}__ and `functionName` set to `"funders"`.
 */
export function useViaPrizeFunders<
  TFunctionName extends 'funders',
  TSelectData = ReadContractResult<typeof viaPrizeABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof viaPrizeABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: viaPrizeABI,
    functionName: 'funders',
    ...config,
  } as UseContractReadConfig<typeof viaPrizeABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link viaPrizeABI}__ and `functionName` set to `"getAllSubmissions"`.
 */
export function useViaPrizeGetAllSubmissions<
  TFunctionName extends 'getAllSubmissions',
  TSelectData = ReadContractResult<typeof viaPrizeABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof viaPrizeABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: viaPrizeABI,
    functionName: 'getAllSubmissions',
    ...config,
  } as UseContractReadConfig<typeof viaPrizeABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link viaPrizeABI}__ and `functionName` set to `"get_submission_by_hash"`.
 */
export function useViaPrizeGetSubmissionByHash<
  TFunctionName extends 'get_submission_by_hash',
  TSelectData = ReadContractResult<typeof viaPrizeABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof viaPrizeABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: viaPrizeABI,
    functionName: 'get_submission_by_hash',
    ...config,
  } as UseContractReadConfig<typeof viaPrizeABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link viaPrizeABI}__ and `functionName` set to `"get_submission_time"`.
 */
export function useViaPrizeGetSubmissionTime<
  TFunctionName extends 'get_submission_time',
  TSelectData = ReadContractResult<typeof viaPrizeABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof viaPrizeABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: viaPrizeABI,
    functionName: 'get_submission_time',
    ...config,
  } as UseContractReadConfig<typeof viaPrizeABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link viaPrizeABI}__ and `functionName` set to `"get_voting_time"`.
 */
export function useViaPrizeGetVotingTime<
  TFunctionName extends 'get_voting_time',
  TSelectData = ReadContractResult<typeof viaPrizeABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof viaPrizeABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: viaPrizeABI,
    functionName: 'get_voting_time',
    ...config,
  } as UseContractReadConfig<typeof viaPrizeABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link viaPrizeABI}__ and `functionName` set to `"isAdmin"`.
 */
export function useViaPrizeIsAdmin<
  TFunctionName extends 'isAdmin',
  TSelectData = ReadContractResult<typeof viaPrizeABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof viaPrizeABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: viaPrizeABI,
    functionName: 'isAdmin',
    ...config,
  } as UseContractReadConfig<typeof viaPrizeABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link viaPrizeABI}__ and `functionName` set to `"isPlatformAdmin"`.
 */
export function useViaPrizeIsPlatformAdmin<
  TFunctionName extends 'isPlatformAdmin',
  TSelectData = ReadContractResult<typeof viaPrizeABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof viaPrizeABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: viaPrizeABI,
    functionName: 'isPlatformAdmin',
    ...config,
  } as UseContractReadConfig<typeof viaPrizeABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link viaPrizeABI}__ and `functionName` set to `"platformAddress"`.
 */
export function useViaPrizePlatformAddress<
  TFunctionName extends 'platformAddress',
  TSelectData = ReadContractResult<typeof viaPrizeABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof viaPrizeABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: viaPrizeABI,
    functionName: 'platformAddress',
    ...config,
  } as UseContractReadConfig<typeof viaPrizeABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link viaPrizeABI}__ and `functionName` set to `"platformAdmins"`.
 */
export function useViaPrizePlatformAdmins<
  TFunctionName extends 'platformAdmins',
  TSelectData = ReadContractResult<typeof viaPrizeABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof viaPrizeABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: viaPrizeABI,
    functionName: 'platformAdmins',
    ...config,
  } as UseContractReadConfig<typeof viaPrizeABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link viaPrizeABI}__ and `functionName` set to `"platform_reward"`.
 */
export function useViaPrizePlatformReward<
  TFunctionName extends 'platform_reward',
  TSelectData = ReadContractResult<typeof viaPrizeABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof viaPrizeABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: viaPrizeABI,
    functionName: 'platform_reward',
    ...config,
  } as UseContractReadConfig<typeof viaPrizeABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link viaPrizeABI}__ and `functionName` set to `"proposerAddress"`.
 */
export function useViaPrizeProposerAddress<
  TFunctionName extends 'proposerAddress',
  TSelectData = ReadContractResult<typeof viaPrizeABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof viaPrizeABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: viaPrizeABI,
    functionName: 'proposerAddress',
    ...config,
  } as UseContractReadConfig<typeof viaPrizeABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link viaPrizeABI}__ and `functionName` set to `"proposer_reward"`.
 */
export function useViaPrizeProposerReward<
  TFunctionName extends 'proposer_reward',
  TSelectData = ReadContractResult<typeof viaPrizeABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof viaPrizeABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: viaPrizeABI,
    functionName: 'proposer_reward',
    ...config,
  } as UseContractReadConfig<typeof viaPrizeABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link viaPrizeABI}__ and `functionName` set to `"refunded"`.
 */
export function useViaPrizeRefunded<
  TFunctionName extends 'refunded',
  TSelectData = ReadContractResult<typeof viaPrizeABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof viaPrizeABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: viaPrizeABI,
    functionName: 'refunded',
    ...config,
  } as UseContractReadConfig<typeof viaPrizeABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link viaPrizeABI}__ and `functionName` set to `"total_funds"`.
 */
export function useViaPrizeTotalFunds<
  TFunctionName extends 'total_funds',
  TSelectData = ReadContractResult<typeof viaPrizeABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof viaPrizeABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: viaPrizeABI,
    functionName: 'total_funds',
    ...config,
  } as UseContractReadConfig<typeof viaPrizeABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link viaPrizeABI}__ and `functionName` set to `"total_rewards"`.
 */
export function useViaPrizeTotalRewards<
  TFunctionName extends 'total_rewards',
  TSelectData = ReadContractResult<typeof viaPrizeABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof viaPrizeABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: viaPrizeABI,
    functionName: 'total_rewards',
    ...config,
  } as UseContractReadConfig<typeof viaPrizeABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link viaPrizeABI}__.
 */
export function useViaPrizeWrite<
  TFunctionName extends string,
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
      PrepareWriteContractResult<typeof viaPrizeABI, string>['request']['abi'],
      TFunctionName,
      TMode
    >
    : UseContractWriteConfig<typeof viaPrizeABI, TFunctionName, TMode> & {
      abi?: never;
    } = {} as any,
) {
  return useContractWrite<typeof viaPrizeABI, TFunctionName, TMode>({
    abi: viaPrizeABI,
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link viaPrizeABI}__ and `functionName` set to `"addFunds"`.
 */
export function useViaPrizeAddFunds<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
      PrepareWriteContractResult<typeof viaPrizeABI, 'addFunds'>['request']['abi'],
      'addFunds',
      TMode
    > & { functionName?: 'addFunds' }
    : UseContractWriteConfig<typeof viaPrizeABI, 'addFunds', TMode> & {
      abi?: never;
      functionName?: 'addFunds';
    } = {} as any,
) {
  return useContractWrite<typeof viaPrizeABI, 'addFunds', TMode>({
    abi: viaPrizeABI,
    functionName: 'addFunds',
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link viaPrizeABI}__ and `functionName` set to `"addSubmission"`.
 */
export function useViaPrizeAddSubmission<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
      PrepareWriteContractResult<typeof viaPrizeABI, 'addSubmission'>['request']['abi'],
      'addSubmission',
      TMode
    > & { functionName?: 'addSubmission' }
    : UseContractWriteConfig<typeof viaPrizeABI, 'addSubmission', TMode> & {
      abi?: never;
      functionName?: 'addSubmission';
    } = {} as any,
) {
  return useContractWrite<typeof viaPrizeABI, 'addSubmission', TMode>({
    abi: viaPrizeABI,
    functionName: 'addSubmission',
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link viaPrizeABI}__ and `functionName` set to `"change_vote"`.
 */
export function useViaPrizeChangeVote<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
      PrepareWriteContractResult<typeof viaPrizeABI, 'change_vote'>['request']['abi'],
      'change_vote',
      TMode
    > & { functionName?: 'change_vote' }
    : UseContractWriteConfig<typeof viaPrizeABI, 'change_vote', TMode> & {
      abi?: never;
      functionName?: 'change_vote';
    } = {} as any,
) {
  return useContractWrite<typeof viaPrizeABI, 'change_vote', TMode>({
    abi: viaPrizeABI,
    functionName: 'change_vote',
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link viaPrizeABI}__ and `functionName` set to `"claimRefund"`.
 */
export function useViaPrizeClaimRefund<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
      PrepareWriteContractResult<typeof viaPrizeABI, 'claimRefund'>['request']['abi'],
      'claimRefund',
      TMode
    > & { functionName?: 'claimRefund' }
    : UseContractWriteConfig<typeof viaPrizeABI, 'claimRefund', TMode> & {
      abi?: never;
      functionName?: 'claimRefund';
    } = {} as any,
) {
  return useContractWrite<typeof viaPrizeABI, 'claimRefund', TMode>({
    abi: viaPrizeABI,
    functionName: 'claimRefund',
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link viaPrizeABI}__ and `functionName` set to `"end_submission_period"`.
 */
export function useViaPrizeEndSubmissionPeriod<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
      PrepareWriteContractResult<
        typeof viaPrizeABI,
        'end_submission_period'
      >['request']['abi'],
      'end_submission_period',
      TMode
    > & { functionName?: 'end_submission_period' }
    : UseContractWriteConfig<typeof viaPrizeABI, 'end_submission_period', TMode> & {
      abi?: never;
      functionName?: 'end_submission_period';
    } = {} as any,
) {
  return useContractWrite<typeof viaPrizeABI, 'end_submission_period', TMode>({
    abi: viaPrizeABI,
    functionName: 'end_submission_period',
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link viaPrizeABI}__ and `functionName` set to `"end_voting_period"`.
 */
export function useViaPrizeEndVotingPeriod<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
      PrepareWriteContractResult<
        typeof viaPrizeABI,
        'end_voting_period'
      >['request']['abi'],
      'end_voting_period',
      TMode
    > & { functionName?: 'end_voting_period' }
    : UseContractWriteConfig<typeof viaPrizeABI, 'end_voting_period', TMode> & {
      abi?: never;
      functionName?: 'end_voting_period';
    } = {} as any,
) {
  return useContractWrite<typeof viaPrizeABI, 'end_voting_period', TMode>({
    abi: viaPrizeABI,
    functionName: 'end_voting_period',
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link viaPrizeABI}__ and `functionName` set to `"start_submission_period"`.
 */
export function useViaPrizeStartSubmissionPeriod<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
      PrepareWriteContractResult<
        typeof viaPrizeABI,
        'start_submission_period'
      >['request']['abi'],
      'start_submission_period',
      TMode
    > & { functionName?: 'start_submission_period' }
    : UseContractWriteConfig<typeof viaPrizeABI, 'start_submission_period', TMode> & {
      abi?: never;
      functionName?: 'start_submission_period';
    } = {} as any,
) {
  return useContractWrite<typeof viaPrizeABI, 'start_submission_period', TMode>({
    abi: viaPrizeABI,
    functionName: 'start_submission_period',
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link viaPrizeABI}__ and `functionName` set to `"start_voting_period"`.
 */
export function useViaPrizeStartVotingPeriod<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
      PrepareWriteContractResult<
        typeof viaPrizeABI,
        'start_voting_period'
      >['request']['abi'],
      'start_voting_period',
      TMode
    > & { functionName?: 'start_voting_period' }
    : UseContractWriteConfig<typeof viaPrizeABI, 'start_voting_period', TMode> & {
      abi?: never;
      functionName?: 'start_voting_period';
    } = {} as any,
) {
  return useContractWrite<typeof viaPrizeABI, 'start_voting_period', TMode>({
    abi: viaPrizeABI,
    functionName: 'start_voting_period',
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link viaPrizeABI}__ and `functionName` set to `"use_unused_votes"`.
 */
export function useViaPrizeUseUnusedVotes<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
      PrepareWriteContractResult<
        typeof viaPrizeABI,
        'use_unused_votes'
      >['request']['abi'],
      'use_unused_votes',
      TMode
    > & { functionName?: 'use_unused_votes' }
    : UseContractWriteConfig<typeof viaPrizeABI, 'use_unused_votes', TMode> & {
      abi?: never;
      functionName?: 'use_unused_votes';
    } = {} as any,
) {
  return useContractWrite<typeof viaPrizeABI, 'use_unused_votes', TMode>({
    abi: viaPrizeABI,
    functionName: 'use_unused_votes',
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link viaPrizeABI}__ and `functionName` set to `"vote"`.
 */
export function useViaPrizeVote<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
      PrepareWriteContractResult<typeof viaPrizeABI, 'vote'>['request']['abi'],
      'vote',
      TMode
    > & { functionName?: 'vote' }
    : UseContractWriteConfig<typeof viaPrizeABI, 'vote', TMode> & {
      abi?: never;
      functionName?: 'vote';
    } = {} as any,
) {
  return useContractWrite<typeof viaPrizeABI, 'vote', TMode>({
    abi: viaPrizeABI,
    functionName: 'vote',
    ...config,
  } as any);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link viaPrizeABI}__.
 */
export function usePrepareViaPrizeWrite<TFunctionName extends string>(
  config: Omit<
    UsePrepareContractWriteConfig<typeof viaPrizeABI, TFunctionName>,
    'abi'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: viaPrizeABI,
    ...config,
  } as UsePrepareContractWriteConfig<typeof viaPrizeABI, TFunctionName>);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link viaPrizeABI}__ and `functionName` set to `"addFunds"`.
 */
export function usePrepareViaPrizeAddFunds(
  config: Omit<
    UsePrepareContractWriteConfig<typeof viaPrizeABI, 'addFunds'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: viaPrizeABI,
    functionName: 'addFunds',
    ...config,
  } as UsePrepareContractWriteConfig<typeof viaPrizeABI, 'addFunds'>);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link viaPrizeABI}__ and `functionName` set to `"addSubmission"`.
 */
export function usePrepareViaPrizeAddSubmission(
  config: Omit<
    UsePrepareContractWriteConfig<typeof viaPrizeABI, 'addSubmission'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: viaPrizeABI,
    functionName: 'addSubmission',
    ...config,
  } as UsePrepareContractWriteConfig<typeof viaPrizeABI, 'addSubmission'>);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link viaPrizeABI}__ and `functionName` set to `"change_vote"`.
 */
export function usePrepareViaPrizeChangeVote(
  config: Omit<
    UsePrepareContractWriteConfig<typeof viaPrizeABI, 'change_vote'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: viaPrizeABI,
    functionName: 'change_vote',
    ...config,
  } as UsePrepareContractWriteConfig<typeof viaPrizeABI, 'change_vote'>);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link viaPrizeABI}__ and `functionName` set to `"claimRefund"`.
 */
export function usePrepareViaPrizeClaimRefund(
  config: Omit<
    UsePrepareContractWriteConfig<typeof viaPrizeABI, 'claimRefund'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: viaPrizeABI,
    functionName: 'claimRefund',
    ...config,
  } as UsePrepareContractWriteConfig<typeof viaPrizeABI, 'claimRefund'>);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link viaPrizeABI}__ and `functionName` set to `"end_submission_period"`.
 */
export function usePrepareViaPrizeEndSubmissionPeriod(
  config: Omit<
    UsePrepareContractWriteConfig<typeof viaPrizeABI, 'end_submission_period'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: viaPrizeABI,
    functionName: 'end_submission_period',
    ...config,
  } as UsePrepareContractWriteConfig<typeof viaPrizeABI, 'end_submission_period'>);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link viaPrizeABI}__ and `functionName` set to `"end_voting_period"`.
 */
export function usePrepareViaPrizeEndVotingPeriod(
  config: Omit<
    UsePrepareContractWriteConfig<typeof viaPrizeABI, 'end_voting_period'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: viaPrizeABI,
    functionName: 'end_voting_period',
    ...config,
  } as UsePrepareContractWriteConfig<typeof viaPrizeABI, 'end_voting_period'>);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link viaPrizeABI}__ and `functionName` set to `"start_submission_period"`.
 */
export function usePrepareViaPrizeStartSubmissionPeriod(
  config: Omit<
    UsePrepareContractWriteConfig<typeof viaPrizeABI, 'start_submission_period'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: viaPrizeABI,
    functionName: 'start_submission_period',
    ...config,
  } as UsePrepareContractWriteConfig<typeof viaPrizeABI, 'start_submission_period'>);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link viaPrizeABI}__ and `functionName` set to `"start_voting_period"`.
 */
export function usePrepareViaPrizeStartVotingPeriod(
  config: Omit<
    UsePrepareContractWriteConfig<typeof viaPrizeABI, 'start_voting_period'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: viaPrizeABI,
    functionName: 'start_voting_period',
    ...config,
  } as UsePrepareContractWriteConfig<typeof viaPrizeABI, 'start_voting_period'>);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link viaPrizeABI}__ and `functionName` set to `"use_unused_votes"`.
 */
export function usePrepareViaPrizeUseUnusedVotes(
  config: Omit<
    UsePrepareContractWriteConfig<typeof viaPrizeABI, 'use_unused_votes'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: viaPrizeABI,
    functionName: 'use_unused_votes',
    ...config,
  } as UsePrepareContractWriteConfig<typeof viaPrizeABI, 'use_unused_votes'>);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link viaPrizeABI}__ and `functionName` set to `"vote"`.
 */
export function usePrepareViaPrizeVote(
  config: Omit<
    UsePrepareContractWriteConfig<typeof viaPrizeABI, 'vote'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: viaPrizeABI,
    functionName: 'vote',
    ...config,
  } as UsePrepareContractWriteConfig<typeof viaPrizeABI, 'vote'>);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link viaPrizeABI}__.
 */
export function useViaPrizeEvent<TEventName extends string>(
  config: Omit<UseContractEventConfig<typeof viaPrizeABI, TEventName>, 'abi'> = {} as any,
) {
  return useContractEvent({ abi: viaPrizeABI, ...config } as UseContractEventConfig<
    typeof viaPrizeABI,
    TEventName
  >);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link viaPrizeABI}__ and `eventName` set to `"SubmissionCreated"`.
 */
export function useViaPrizeSubmissionCreatedEvent(
  config: Omit<
    UseContractEventConfig<typeof viaPrizeABI, 'SubmissionCreated'>,
    'abi' | 'eventName'
  > = {} as any,
) {
  return useContractEvent({
    abi: viaPrizeABI,
    eventName: 'SubmissionCreated',
    ...config,
  } as UseContractEventConfig<typeof viaPrizeABI, 'SubmissionCreated'>);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link viaPrizeFactoryABI}__.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0dd8d97E5b41010F5a47dAA2217aed175Ad15dd4)
 */
export function useViaPrizeFactoryWrite<
  TFunctionName extends string,
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof viaPrizeFactoryAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
      PrepareWriteContractResult<typeof viaPrizeFactoryABI, string>['request']['abi'],
      TFunctionName,
      TMode
    > & { address?: Address; chainId?: TChainId }
    : UseContractWriteConfig<typeof viaPrizeFactoryABI, TFunctionName, TMode> & {
      abi?: never;
      address?: never;
      chainId?: TChainId;
    } = {} as any,
) {
  return useContractWrite<typeof viaPrizeFactoryABI, TFunctionName, TMode>({
    abi: viaPrizeFactoryABI,
    address: viaPrizeFactoryAddress[1],
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link viaPrizeFactoryABI}__ and `functionName` set to `"createViaPrize"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0dd8d97E5b41010F5a47dAA2217aed175Ad15dd4)
 */
export function useViaPrizeFactoryCreateViaPrize<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof viaPrizeFactoryAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
      PrepareWriteContractResult<
        typeof viaPrizeFactoryABI,
        'createViaPrize'
      >['request']['abi'],
      'createViaPrize',
      TMode
    > & { address?: Address; chainId?: TChainId; functionName?: 'createViaPrize' }
    : UseContractWriteConfig<typeof viaPrizeFactoryABI, 'createViaPrize', TMode> & {
      abi?: never;
      address?: never;
      chainId?: TChainId;
      functionName?: 'createViaPrize';
    } = {} as any,
) {
  return useContractWrite<typeof viaPrizeFactoryABI, 'createViaPrize', TMode>({
    abi: viaPrizeFactoryABI,
    address: viaPrizeFactoryAddress[1],
    functionName: 'createViaPrize',
    ...config,
  } as any);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link viaPrizeFactoryABI}__.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0dd8d97E5b41010F5a47dAA2217aed175Ad15dd4)
 */
export function usePrepareViaPrizeFactoryWrite<TFunctionName extends string>(
  config: Omit<
    UsePrepareContractWriteConfig<typeof viaPrizeFactoryABI, TFunctionName>,
    'abi' | 'address'
  > & { chainId?: keyof typeof viaPrizeFactoryAddress } = {} as any,
) {
  return usePrepareContractWrite({
    abi: viaPrizeFactoryABI,
    address: viaPrizeFactoryAddress[1],
    ...config,
  } as UsePrepareContractWriteConfig<typeof viaPrizeFactoryABI, TFunctionName>);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link viaPrizeFactoryABI}__ and `functionName` set to `"createViaPrize"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0dd8d97E5b41010F5a47dAA2217aed175Ad15dd4)
 */
export function usePrepareViaPrizeFactoryCreateViaPrize(
  config: Omit<
    UsePrepareContractWriteConfig<typeof viaPrizeFactoryABI, 'createViaPrize'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof viaPrizeFactoryAddress } = {} as any,
) {
  return usePrepareContractWrite({
    abi: viaPrizeFactoryABI,
    address: viaPrizeFactoryAddress[1],
    functionName: 'createViaPrize',
    ...config,
  } as UsePrepareContractWriteConfig<typeof viaPrizeFactoryABI, 'createViaPrize'>);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link viaPrizeFactoryABI}__.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0dd8d97E5b41010F5a47dAA2217aed175Ad15dd4)
 */
export function useViaPrizeFactoryEvent<TEventName extends string>(
  config: Omit<
    UseContractEventConfig<typeof viaPrizeFactoryABI, TEventName>,
    'abi' | 'address'
  > & { chainId?: keyof typeof viaPrizeFactoryAddress } = {} as any,
) {
  return useContractEvent({
    abi: viaPrizeFactoryABI,
    address: viaPrizeFactoryAddress[1],
    ...config,
  } as UseContractEventConfig<typeof viaPrizeFactoryABI, TEventName>);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link viaPrizeFactoryABI}__ and `eventName` set to `"NewViaPrizeCreated"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0dd8d97E5b41010F5a47dAA2217aed175Ad15dd4)
 */
export function useViaPrizeFactoryNewViaPrizeCreatedEvent(
  config: Omit<
    UseContractEventConfig<typeof viaPrizeFactoryABI, 'NewViaPrizeCreated'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof viaPrizeFactoryAddress } = {} as any,
) {
  return useContractEvent({
    abi: viaPrizeFactoryABI,
    address: viaPrizeFactoryAddress[1],
    eventName: 'NewViaPrizeCreated',
    ...config,
  } as UseContractEventConfig<typeof viaPrizeFactoryABI, 'NewViaPrizeCreated'>);
}
