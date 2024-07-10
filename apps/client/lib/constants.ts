export const campaignsTags = [
  'Climate Change',
  'Network Civilizations',
  'Open-Source',
  'Community Coordination',
  'Health',
  'Education',
];

export const USDC = '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913' as `0x${string}`;
export const USDC_BRIDGE = '0xd9aAEc86B65D86f6A7B5B1b0c42FFA531710b6CA' as `0x${string}`;
export const SWAP_ROUTER = '0x2626664c2603336E57B271c5C0b26F421741e481' as `0x${string}`;
export const USDC_TO_USDCE_POOL =
  '0x06959273E9A65433De71F5A452D529544E07dDD0' as `0x${string}`;
export const USDC_TO_ETH_POOL =
  '0xd0b53D9277642d899DF5C87A3966A349A798F224' as `0x${string}`;
export const ETH_PRICE = '0x71041dddad3595F9CEd3DcCFBe3D1F4b0a16Bb70' as `0x${string}`;
export const WETH = '0x4200000000000000000000000000000000000006' as `0x${string}`;

export const ADMINS = [
  '0x850a146D7478dAAa98Fc26Fd85e6A24e50846A9d',
  '0xd9ee3059F3d85faD72aDe7f2BbD267E73FA08D7F',
  '0x8e0103Af21C9a474035Bf00B56195b9ef3196C99',
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
