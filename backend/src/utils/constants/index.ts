export const DEFAULT_PLATFORM_FEE = 5;

interface ABIObject {
  constant: boolean;
  inputs: { name: string; type: string }[];
  name: string;
  outputs: { name: string; type: string }[];
  payable: boolean;
  stateMutability: string;
  type: string;
}

export const PRIZE_V2_ABI = [
  {
    inputs: [
      {
        internalType: 'address',
        name: '_proposer',
        type: 'address',
      },
      {
        internalType: 'address[]',
        name: '_platformAdmins',
        type: 'address[]',
      },
      {
        internalType: 'uint256',
        name: '_platFormFee',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_proposerFee',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: '_usdcAddress',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_usdcBridgedAddress',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_swapRouter',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_usdcToUsdcePool',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_usdcToEthPool',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_ethPriceAggregator',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_wethToken',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    inputs: [],
    name: 'NotEnoughFunds',
    type: 'error',
  },
  {
    inputs: [],
    name: 'NotYourVote',
    type: 'error',
  },
  {
    inputs: [],
    name: 'RewardsAlreadyDistributed',
    type: 'error',
  },
  {
    inputs: [],
    name: 'SubmissionDoesntExist',
    type: 'error',
  },
  {
    inputs: [],
    name: 'SubmissionPeriodActive',
    type: 'error',
  },
  {
    inputs: [],
    name: 'SubmissionPeriodNotActive',
    type: 'error',
  },
  {
    inputs: [],
    name: 'VotingPeriodActive',
    type: 'error',
  },
  {
    inputs: [],
    name: 'VotingPeriodNotActive',
    type: 'error',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'proposer',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'contractAddress',
        type: 'address',
      },
    ],
    name: 'CampaignCreated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'bytes32',
        name: '_submissionHash',
        type: 'bytes32',
      },
      {
        indexed: true,
        internalType: 'address',
        name: '_contestant',
        type: 'address',
      },
    ],
    name: 'DisputeRaised',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'donator',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'token_or_nft',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'enum PrizeV2.DonationType',
        name: '_donationType',
        type: 'uint8',
      },
      {
        indexed: false,
        internalType: 'enum PrizeV2.TokenType',
        name: '_tokenType',
        type: 'uint8',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'Donation',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'contestant',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'submissionHash',
        type: 'bytes32',
      },
    ],
    name: 'SubmissionCreated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'votedTo',
        type: 'bytes32',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'votedBy',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amountVoted',
        type: 'uint256',
      },
    ],
    name: 'Voted',
    type: 'event',
  },
  {
    inputs: [],
    name: 'PRECISION',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'REFUND_SUBMISSION_HASH',
    outputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'VERSION',
    outputs: [
      {
        internalType: 'uint8',
        name: '',
        type: 'uint8',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_amountUsdc',
        type: 'uint256',
      },
    ],
    name: 'addBridgedUsdcFunds',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_amountOutMinimum',
        type: 'uint256',
      },
    ],
    name: 'addEthFunds',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'contestant',
        type: 'address',
      },
      {
        internalType: 'string',
        name: 'submissionText',
        type: 'string',
      },
    ],
    name: 'addSubmission',
    outputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'spender',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '_amountUsdc',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_deadline',
        type: 'uint256',
      },
      {
        internalType: 'uint8',
        name: 'v',
        type: 'uint8',
      },
      {
        internalType: 'bytes32',
        name: 's',
        type: 'bytes32',
      },
      {
        internalType: 'bytes32',
        name: 'r',
        type: 'bytes32',
      },
      {
        internalType: 'bytes32',
        name: '_ethSignedMessageHash',
        type: 'bytes32',
      },
    ],
    name: 'addUsdcFunds',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'allFunders',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'bridgedUsdcPool',
    outputs: [
      {
        internalType: 'contract IUniswapV3Pool',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_minimumSlipageFeePercentage',
        type: 'uint256',
      },
    ],
    name: 'changeMinimumSlipageFeePercentage',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: '_previous_submissionHash',
        type: 'bytes32',
      },
      {
        internalType: 'bytes32',
        name: '_new_submissionHash',
        type: 'bytes32',
      },
      {
        internalType: 'uint8',
        name: 'v',
        type: 'uint8',
      },
      {
        internalType: 'bytes32',
        name: 's',
        type: 'bytes32',
      },
      {
        internalType: 'bytes32',
        name: 'r',
        type: 'bytes32',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
      {
        internalType: 'bytes32',
        name: '_ethSignedMessageHash',
        type: 'bytes32',
      },
    ],
    name: 'changeVote',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: '_previousSubmissionHash',
        type: 'bytes32',
      },
      {
        internalType: 'bytes32',
        name: '_newSubmissionHash',
        type: 'bytes32',
      },
      {
        internalType: 'address[]',
        name: '_funders',
        type: 'address[]',
      },
      {
        internalType: 'uint256[]',
        name: '_amounts',
        type: 'uint256[]',
      },
    ],
    name: 'disputeChangeVote',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'disputePeriod',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'distributed',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'endDispute',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'endSubmissionPeriod',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'endVotingPeriod',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'ethPriceAggregator',
    outputs: [
      {
        internalType: 'contract AggregatorV3Interface',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'ethUsdcPool',
    outputs: [
      {
        internalType: 'contract IUniswapV3Pool',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    name: 'funderAmount',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
    ],
    name: 'funderVotes',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getAllFunders',
    outputs: [
      {
        internalType: 'address[]',
        name: '',
        type: 'address[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getAllPlatformAdmins',
    outputs: [
      {
        internalType: 'address[]',
        name: '',
        type: 'address[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getAllSubmissions',
    outputs: [
      {
        components: [
          {
            internalType: 'bytes32',
            name: 'submissionHash',
            type: 'bytes32',
          },
          {
            internalType: 'string',
            name: 'submissionText',
            type: 'string',
          },
          {
            internalType: 'uint256',
            name: 'usdcVotes',
            type: 'uint256',
          },
          {
            internalType: 'address',
            name: 'contestant',
            type: 'address',
          },
          {
            internalType: 'bool',
            name: 'funded',
            type: 'bool',
          },
          {
            internalType: 'int256',
            name: 'height',
            type: 'int256',
          },
          {
            internalType: 'uint256',
            name: 'left',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'right',
            type: 'uint256',
          },
        ],
        internalType: 'struct SubmissionAVLTree.SubmissionInfo[]',
        name: '',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'submissionHash',
        type: 'bytes32',
      },
    ],
    name: 'getSubmissionByHash',
    outputs: [
      {
        components: [
          {
            internalType: 'bytes32',
            name: 'submissionHash',
            type: 'bytes32',
          },
          {
            internalType: 'string',
            name: 'submissionText',
            type: 'string',
          },
          {
            internalType: 'uint256',
            name: 'usdcVotes',
            type: 'uint256',
          },
          {
            internalType: 'address',
            name: 'contestant',
            type: 'address',
          },
          {
            internalType: 'bool',
            name: 'funded',
            type: 'bool',
          },
          {
            internalType: 'int256',
            name: 'height',
            type: 'int256',
          },
          {
            internalType: 'uint256',
            name: 'left',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'right',
            type: 'uint256',
          },
        ],
        internalType: 'struct SubmissionAVLTree.SubmissionInfo',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getSubmissionTime',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getVotingTime',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_submissionTime',
        type: 'uint256',
      },
    ],
    name: 'increaseSubmissionPeriod',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_votingTime',
        type: 'uint256',
      },
    ],
    name: 'increaseVotingPeriod',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'isActive',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    name: 'isContestant',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    name: 'isFunder',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    name: 'isPlatformAdmin',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    name: 'isProposer',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    name: 'isRefundRequestedAddress',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'minimumSlipageFeePercentage',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'platformAddress',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'platformAdmins',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'platformFee',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'proposer',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'proposerFee',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: '_submissionHash',
        type: 'bytes32',
      },
      {
        internalType: 'uint8',
        name: 'v',
        type: 'uint8',
      },
      {
        internalType: 'bytes32',
        name: 's',
        type: 'bytes32',
      },
      {
        internalType: 'bytes32',
        name: 'r',
        type: 'bytes32',
      },
      {
        internalType: 'bytes32',
        name: '_ethSignedMessageHash',
        type: 'bytes32',
      },
    ],
    name: 'raiseDispute',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'refundRequestedFunders',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_submissionTime',
        type: 'uint256',
      },
    ],
    name: 'startSubmissionPeriod',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_votingTime',
        type: 'uint256',
      },
    ],
    name: 'startVotingPeriod',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'submissionPeriod',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'swapRouter',
    outputs: [
      {
        internalType: 'contract ISwapRouter',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'totalFunds',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'totalRewards',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'totalVotes',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: '_submissionHash',
        type: 'bytes32',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
      {
        internalType: 'uint8',
        name: 'v',
        type: 'uint8',
      },
      {
        internalType: 'bytes32',
        name: 's',
        type: 'bytes32',
      },
      {
        internalType: 'bytes32',
        name: 'r',
        type: 'bytes32',
      },
    ],
    name: 'vote',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'votingPeriod',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_tokenAddress',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_to',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '_amount',
        type: 'uint256',
      },
    ],
    name: 'withdrawTokens',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    stateMutability: 'payable',
    type: 'receive',
  },
] as const;
