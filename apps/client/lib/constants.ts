export const campaignsTags = [
  'Climate Change',
  'Network Civilizations',
  'Open-Source',
  'Community Coordination',
  'Health',
  'Education',
];

export const USDC = '0x0b2c639c533813f4aa9d7837caf62653d097ff85' as `0x${string}`;
export const USDC_BRIDGE = '0x7F5c764cBc14f9669B88837ca1490cCa17c31607' as `0x${string}`;
export const SWAP_ROUTER = '0xE592427A0AEce92De3Edee1F18E0157C05861564' as `0x${string}`;
export const USDC_TO_USDCE_POOL =
  '0x2ab22ac86b25bd448a4d9dc041bd2384655299c4' as `0x${string}`;
export const USDC_TO_ETH_POOL =
  '0x85149247691df622eaf1a8bd0cafd40bc45154a9' as `0x${string}`;
export const ETH_PRICE = '0x13e3Ee699D1909E989722E753853AE30b17e08c5' as `0x${string}`;
export const WETH = '0x4200000000000000000000000000000000000006' as `0x${string}`;

export const ADMINS = [
  '0x850a146D7478dAAa98Fc26Fd85e6A24e50846A9d',
  '0xd9ee3059F3d85faD72aDe7f2BbD267E73FA08D7F',
  '0x8e0103Af21C9a474035Bf00B56195b9ef3196C99',
  '0x8b5E4bA136D3a483aC9988C20CBF0018cC687E6f',
] as `0x${string}`[];
export const VOTE_ABI = [
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
    inputs: [
      {
        internalType: 'uint256',
        name: '_nonce',
        type: 'uint256',
      },
      {
        internalType: 'bytes32',
        name: '_submission',
        type: 'bytes32',
      },
      {
        internalType: 'uint256',
        name: '_amount',
        type: 'uint256',
      },
    ],
    name: 'VOTE_HASH',
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
] as const;

export const EXTRA_FUNDRAISERS_IDS = [
  'bacb6584-7e45-465b-b4af-a3ed24a84233',
  'a4dac4dc-e5e7-4840-84a9-f00587eac3ec',
  '97a24692-9762-4384-8bf5-837cd3aaaa3b',
  '40257733-e1bb-4f52-b7d6-e393b086b44b',
];

export const EXTRA_PRIZES = [
  '1c5a8b62-ae43-4dde-b550-95848c7f9729',
  'ea2121a8-5801-4bc5-a74c-eb05068f4c36',
  'c81d5f26-ee66-42af-bbaf-5ead96df1d56',
];

export const FUND_MCR_ADDRESS = [
  {
    inputs: [
      {
        internalType: 'address',
        name: 'reserveAddress',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'spender',
        type: 'address',
      },
      {
        internalType: 'bytes32',
        name: '_ethSignedMessageHash',
        type: 'bytes32',
      },
      {
        internalType: 'bytes[]',
        name: '_data',
        type: 'bytes[]',
      },
      {
        internalType: 'uint256[]',
        name: '_poolIds',
        type: 'uint256[]',
      },
      {
        internalType: 'uint256[]',
        name: '_amounts',
        type: 'uint256[]',
      },
      {
        internalType: 'uint256',
        name: 'totalAmount',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'token',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'deadline',
        type: 'uint256',
      },
      {
        internalType: 'uint8',
        name: 'v',
        type: 'uint8',
      },
      {
        internalType: 'bytes32',
        name: 'r',
        type: 'bytes32',
      },
      {
        internalType: 'bytes32',
        name: 's',
        type: 'bytes32',
      },
    ],
    name: 'fundUsingUsdc',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_usdcAddress',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    inputs: [],
    name: '_usdc',
    outputs: [
      {
        internalType: 'contract IERC20Permit',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

export const MULTI_ROUND_CHECKOUT = [
  {
    inputs: [],
    name: 'AmountsNotEqualRoundsLength',
    type: 'error',
  },
  {
    inputs: [],
    name: 'ExcessAmountSent',
    type: 'error',
  },
  {
    inputs: [],
    name: 'INVALID_INPUT',
    type: 'error',
  },
  {
    inputs: [],
    name: 'InvalidInitialization',
    type: 'error',
  },
  {
    inputs: [],
    name: 'NotInitializing',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
    ],
    name: 'OwnableInvalidOwner',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'OwnableUnauthorizedAccount',
    type: 'error',
  },
  {
    inputs: [],
    name: 'VotesNotEqualRoundsLength',
    type: 'error',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint8',
        name: 'version',
        type: 'uint8',
      },
    ],
    name: 'Initialized',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'previousOwner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'OwnershipTransferred',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'Paused',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'Unpaused',
    type: 'event',
  },
  {
    inputs: [],
    name: 'allo',
    outputs: [
      {
        internalType: 'contract IAllo',
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
        internalType: 'uint256[]',
        name: '_poolIds',
        type: 'uint256[]',
      },
      {
        internalType: 'uint256[]',
        name: '_amounts',
        type: 'uint256[]',
      },
      {
        internalType: 'bytes[]',
        name: '_data',
        type: 'bytes[]',
      },
    ],
    name: 'allocate',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes[]',
        name: '_data',
        type: 'bytes[]',
      },
      {
        internalType: 'uint256[]',
        name: '_poolIds',
        type: 'uint256[]',
      },
      {
        internalType: 'uint256[]',
        name: '_amounts',
        type: 'uint256[]',
      },
      {
        internalType: 'uint256',
        name: 'totalAmount',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'token',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'deadline',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'nonce',
        type: 'uint256',
      },
      {
        internalType: 'uint8',
        name: 'v',
        type: 'uint8',
      },
      {
        internalType: 'bytes32',
        name: 'r',
        type: 'bytes32',
      },
      {
        internalType: 'bytes32',
        name: 's',
        type: 'bytes32',
      },
    ],
    name: 'allocateDAIPermit',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes[]',
        name: '_data',
        type: 'bytes[]',
      },
      {
        internalType: 'uint256[]',
        name: '_poolIds',
        type: 'uint256[]',
      },
      {
        internalType: 'uint256[]',
        name: '_amounts',
        type: 'uint256[]',
      },
      {
        internalType: 'uint256',
        name: 'totalAmount',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'token',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'deadline',
        type: 'uint256',
      },
      {
        internalType: 'uint8',
        name: 'v',
        type: 'uint8',
      },
      {
        internalType: 'bytes32',
        name: 'r',
        type: 'bytes32',
      },
      {
        internalType: 'bytes32',
        name: 's',
        type: 'bytes32',
      },
    ],
    name: 'allocateERC20Permit',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_allo',
        type: 'address',
      },
    ],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'owner',
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
    name: 'pause',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'paused',
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
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'unpause',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_allo',
        type: 'address',
      },
    ],
    name: 'updateAllo',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes[][]',
        name: 'votes',
        type: 'bytes[][]',
      },
      {
        internalType: 'address[]',
        name: 'rounds',
        type: 'address[]',
      },
      {
        internalType: 'uint256[]',
        name: 'amounts',
        type: 'uint256[]',
      },
    ],
    name: 'vote',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes[][]',
        name: 'votes',
        type: 'bytes[][]',
      },
      {
        internalType: 'address[]',
        name: 'rounds',
        type: 'address[]',
      },
      {
        internalType: 'uint256[]',
        name: 'amounts',
        type: 'uint256[]',
      },
      {
        internalType: 'uint256',
        name: 'totalAmount',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'token',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'deadline',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'nonce',
        type: 'uint256',
      },
      {
        internalType: 'uint8',
        name: 'v',
        type: 'uint8',
      },
      {
        internalType: 'bytes32',
        name: 'r',
        type: 'bytes32',
      },
      {
        internalType: 'bytes32',
        name: 's',
        type: 'bytes32',
      },
    ],
    name: 'voteDAIPermit',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes[][]',
        name: 'votes',
        type: 'bytes[][]',
      },
      {
        internalType: 'address[]',
        name: 'rounds',
        type: 'address[]',
      },
      {
        internalType: 'uint256[]',
        name: 'amounts',
        type: 'uint256[]',
      },
      {
        internalType: 'uint256',
        name: 'totalAmount',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'token',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'deadline',
        type: 'uint256',
      },
      {
        internalType: 'uint8',
        name: 'v',
        type: 'uint8',
      },
      {
        internalType: 'bytes32',
        name: 'r',
        type: 'bytes32',
      },
      {
        internalType: 'bytes32',
        name: 's',
        type: 'bytes32',
      },
    ],
    name: 'voteERC20Permit',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const;

export const usdcAddress = {
  10: '0x0b2c639c533813f4aa9d7837caf62653d097ff85',
  8453: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',
  42161: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
  42220: '0x4f604735c1cf31399c6e711d5962b2b3e0225ad3',
} as const;

export const CHAIN_ID = 10;

export const gitcoinRounds = [
  {
    roundSlug: 'opencivics',
    roundId: '386',
    chainId: 42161,
    token: usdcAddress[42161],
    description:
      'The OpenCivics Collaborative Research Round is designed to foster collaboration among researchers, civic innovators, and community organizers through open source research and knowledge production. Projects in this round are committed to contributing critical research into the commons and collaborating with others to share that knowledge in forms that directly empower community organizers',
    title: 'OpenCivics Collaborative Research Round',
    startDate: new Date('2024-08-07T17:30:00+05:30'),
    endDate: new Date('2024-08-21T17:29:00+05:30'),
    matchingPool: 42_000,
  },

  {
    roundSlug: 'collabtech',
    roundId: '384',
    chainId: 42161,
    token: usdcAddress[42161],
    description:
      'Let’s grow CollabTech: organisations on-chain, evolution of B2B SaaS, and future of work; projects advancing identity & reputation, governance & decision making, operations (accounting, sales automation, inventory management, talent, etc), community, and contributor tooling!',
    title: 'CollabTech Round and Thresholds Experiment',
    startDate: new Date('2024-08-07T03:30:00+05:30'),
    endDate: new Date('2024-08-21T03:30:00+05:30'),
    matchingPool: 30_000,
  },
  {
    roundSlug: 'biofipathfinders',
    roundId: '18',
    chainId: 42220,
    token: usdcAddress[42220],
    description:
      'The Bioregional Finance (BioFi) Pathfinders Round is a partnership between The BioFi Project, Open Civics, The Design School for Regenerating Earth, and Regen Coordination to support the most sophisticated Bioregional Organizing Teams around the world in developing, clarifying, and enhancing their BioFi vision, strategy, and capabilities. This invite-only round is aimed at advanced teams that are already practicing or actively developing their approach to Bioregional Finance (BioFi), with a focus on building Bioregional Financing Facilities (BFFs) or bioregional funding ecosystems more broadly. For detailed suggested questions to help shape your project description, visit https://nifty-humidity-dcf.notion.site/Pathfinders-Grantee-Questions-Template-fa60a0314b174422bd1f2735e3541cdc?pvs=4',
    title: 'BioFi Pathfinders',
    startDate: new Date('2024-10-23T17:30:00+05:30'),
    endDate: new Date('2024-11-07T06:29:00+05:30'),
    matchingPool: 55_000,
  },
  {
    roundSlug: 'regencitizen',
    roundId: '16',
    chainId: 42220,
    token: usdcAddress[42220],
    description:
      'The GG22 Regen Citizens Genesis Round is a joint initiative between GreenPill Network, ReFi DAO, Let’s Grow DAO, and Celo Public Goods. Focusing primarily on these organisation as a starting point, the aim of this round is to empower and recognize builders making meaningful contributions to the regenerative movement on Ethereum.',
    title: 'GG22 Regen Citizens Genesis',
    startDate: new Date('2024-10-23T09:30:00+05:30'),
    endDate: new Date('2024-11-06T18:29:00+05:30'),
    matchingPool: 21_000,
  },
  {
    roundSlug: 'testcelo',
    roundId: '19',
    chainId: 42220,
    token: usdcAddress[42220],
    description: 'testing the celo one ',
    title: 'gotcoin celo',
    startDate: new Date('2024-10-23T09:30:00+05:30'),
    endDate: new Date('2024-11-06T18:29:00+05:30'),
    matchingPool: 21_000,
  },
];
