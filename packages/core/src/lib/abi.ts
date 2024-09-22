export const PRIZE_FACTORY_ABI = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'string',
        name: 'id',
        type: 'string',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'viaPrizeAddress',
        type: 'address',
      },
    ],
    name: 'NewViaPrizeCreated',
    type: 'event',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: '_id',
        type: 'string',
      },
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
        internalType: 'uint8',
        name: '_platFormFee',
        type: 'uint8',
      },
      {
        internalType: 'uint8',
        name: '_proposerFee',
        type: 'uint8',
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
    name: 'createViaPrize',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const

export const PRIZE_V2_ABI = [
  {
    inputs: [
      {
        internalType: 'address',
        name: '_visionary',
        type: 'address',
      },
      {
        internalType: 'address[]',
        name: '_platformAdmins',
        type: 'address[]',
      },
      {
        internalType: 'uint8',
        name: '_platFormFee',
        type: 'uint8',
      },
      {
        internalType: 'uint8',
        name: '_visionaryFee',
        type: 'uint8',
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
    name: 'CAE',
    type: 'error',
  },
  {
    inputs: [],
    name: 'DPNA',
    type: 'error',
  },
  {
    inputs: [],
    name: 'LM',
    type: 'error',
  },
  {
    inputs: [],
    name: 'NAC',
    type: 'error',
  },
  {
    inputs: [],
    name: 'NAF',
    type: 'error',
  },
  {
    inputs: [],
    name: 'NP',
    type: 'error',
  },
  {
    inputs: [],
    name: 'NPP',
    type: 'error',
  },
  {
    inputs: [],
    name: 'NotActive',
    type: 'error',
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
    name: 'ReentrancyGuardReentrantCall',
    type: 'error',
  },
  {
    inputs: [],
    name: 'RewardsAlreadyDistributed',
    type: 'error',
  },
  {
    inputs: [],
    name: 'SS',
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
    name: 'VMPPEIL',
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
        internalType: 'address',
        name: '_address',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: '_amount',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'bool',
        name: 'refunded',
        type: 'bool',
      },
    ],
    name: 'CryptoFunderRefunded',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'endedAt',
        type: 'uint256',
      },
    ],
    name: 'DisputeEnded',
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
        internalType: 'enum ErrorAndEventsLibrary.DonationType',
        name: '_donationType',
        type: 'uint8',
      },
      {
        indexed: false,
        internalType: 'enum ErrorAndEventsLibrary.TokenType',
        name: '_tokenType',
        type: 'uint8',
      },
      {
        indexed: false,
        internalType: 'bool',
        name: '_isFiat',
        type: 'bool',
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
        name: '_address',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: '_amount',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'bool',
        name: 'refunded',
        type: 'bool',
      },
    ],
    name: 'FiatFunderRefund',
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
        internalType: 'uint256',
        name: 'endedAt',
        type: 'uint256',
      },
    ],
    name: 'SubmissionEnded',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'changedAt',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'increasedBy',
        type: 'uint256',
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'Deadline',
        type: 'uint256',
      },
    ],
    name: 'SubmissionPeriodChanged',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'startedAt',
        type: 'uint256',
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'Deadline',
        type: 'uint256',
      },
    ],
    name: 'SubmissionStarted',
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
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'endedAt',
        type: 'uint256',
      },
    ],
    name: 'VotingEnded',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'changedAt',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'increasedBy',
        type: 'uint256',
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'Deadline',
        type: 'uint256',
      },
    ],
    name: 'VotingPeriodChanged',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'startedAt',
        type: 'uint256',
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'Deadline',
        type: 'uint256',
      },
    ],
    name: 'VotingStarted',
    type: 'event',
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
        name: '_voter',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '_amount',
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
      {
        internalType: 'bool',
        name: '_fiatPayment',
        type: 'bool',
      },
    ],
    name: 'addTokenFunds',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
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
      {
        internalType: 'bool',
        name: '_fiatPayment',
        type: 'bool',
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
        internalType: 'uint8',
        name: '_maximumSlipageFeePercentage',
        type: 'uint8',
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
        internalType: 'uint256',
        name: '_submissionTime',
        type: 'uint256',
      },
    ],
    name: 'changeSubmissionPeriod',
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
    ],
    name: 'changeVote',
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
    name: 'changeVotingPeriod',
    outputs: [],
    stateMutability: 'nonpayable',
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
    name: 'cryptoFunderAmount',
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
    name: 'disputeSubmission',
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
    name: 'endDisputePeriodEarly',
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
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    name: 'fiatFunderAmount',
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
    name: 'getAllCryptoFunders',
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
    name: 'getAllFiatFunders',
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
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    name: 'individualCryptoPercentage',
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
    ],
    name: 'individualFiatPercentage',
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
    name: 'isCryptoFunder',
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
    name: 'isFiatFunder',
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
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    name: 'isVisionary',
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
    name: 'maximumSlipageFeePercentage',
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
    inputs: [],
    name: 'nonce',
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
    inputs: [],
    name: 'platformFee',
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
    ],
    name: 'raiseDispute',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'refunded',
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
    name: 'submissionTime',
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
    ],
    name: 'totalFunderAmount',
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
    inputs: [],
    name: 'visionary',
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
    name: 'visionaryFee',
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
        internalType: 'bytes32',
        name: '_submissionHash',
        type: 'bytes32',
      },
      {
        internalType: 'uint256',
        name: '_amount',
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
    inputs: [],
    name: 'votingTime',
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
] as const
