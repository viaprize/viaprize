export const PRIZE_FACTORY_ABI = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "string",
        name: "id",
        type: "string",
      },
      {
        indexed: true,
        internalType: "address",
        name: "viaPrizeAddress",
        type: "address",
      },
    ],
    name: "NewViaPrizeCreated",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_id",
        type: "string",
      },
      {
        internalType: "address",
        name: "_proposer",
        type: "address",
      },
      {
        internalType: "address[]",
        name: "_platformAdmins",
        type: "address[]",
      },
      {
        internalType: "uint8",
        name: "_platFormFee",
        type: "uint8",
      },
      {
        internalType: "uint8",
        name: "_proposerFee",
        type: "uint8",
      },
      {
        internalType: "address",
        name: "_usdcAddress",
        type: "address",
      },
      {
        internalType: "address",
        name: "_usdcBridgedAddress",
        type: "address",
      },
      {
        internalType: "address",
        name: "_swapRouter",
        type: "address",
      },
      {
        internalType: "address",
        name: "_usdcToUsdcePool",
        type: "address",
      },
      {
        internalType: "address",
        name: "_usdcToEthPool",
        type: "address",
      },
      {
        internalType: "address",
        name: "_ethPriceAggregator",
        type: "address",
      },
      {
        internalType: "address",
        name: "_wethToken",
        type: "address",
      },
    ],
    name: "createViaPrize",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;
