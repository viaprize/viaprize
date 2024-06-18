export const campaignsTags = [
  'Climate Change',
  'Network Civilizations',
  'Open-Source',
  'Community Coordination',
  'Health',
  'Education',
];

export const USDC = '0x0b2c639c533813f4aa9d7837caf62653d097ff85';
export const USDC_BRIDGE = '0x7F5c764cBc14f9669B88837ca1490cCa17c31607';
export const SWAP_ROUTER = '0xE592427A0AEce92De3Edee1F18E0157C05861564';
export const USDC_TO_USDCE_POOL = '0x2ab22ac86b25bd448a4d9dc041bd2384655299c4';
export const USDC_TO_ETH_POOL = '0x85149247691df622eaf1a8bd0cafd40bc45154a9';
export const ETH_PRICE = '0x13e3Ee699D1909E989722E753853AE30b17e08c5';
export const WETH = '0x4200000000000000000000000000000000000006';

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
