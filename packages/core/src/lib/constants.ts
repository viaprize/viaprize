export type ValidChainIDs = keyof typeof CONTRACT_CONSTANTS_PER_CHAIN;
export const CONTRACT_CONSTANTS_PER_CHAIN = {
  10: {
    ADMINS: [
      "0x850a146D7478dAAa98Fc26Fd85e6A24e50846A9d",
      "0xd9ee3059F3d85faD72aDe7f2BbD267E73FA08D7F",
      "0x8e0103Af21C9a474035Bf00B56195b9ef3196C99",
      "0x8b5E4bA136D3a483aC9988C20CBF0018cC687E6f",
    ] as `0x${string}`[],
    USDC: "0x0b2c639c533813f4aa9d7837caf62653d097ff85" as `0x${string}`,
    USDC_BRIDGE: "0x7F5c764cBc14f9669B88837ca1490cCa17c31607" as `0x${string}`,
    SWAP_ROUTER: "0xE592427A0AEce92De3Edee1F18E0157C05861564" as `0x${string}`,
    USDC_TO_USDCE_POOL:
      "0x2ab22ac86b25bd448a4d9dc041bd2384655299c4" as `0x${string}`,
    USDC_TO_ETH_POOL:
      "0x85149247691df622eaf1a8bd0cafd40bc45154a9" as `0x${string}`,
    ETH_PRICE: "0x13e3Ee699D1909E989722E753853AE30b17e08c5" as `0x${string}`,
    WETH: "0x4200000000000000000000000000000000000006" as `0x${string}`,
    PRIZE_FACTORY_V2_ADDRESS:
      "0x06CC63ef167A1bde2215b9AdE93525afc0BFa8e6" as `0x${string}`,
    TRANSACTION_BATCH:
      "0x8c79858cAa48B17BfB1dd7B9335BCC4bDde82a3a" as `0x${string}`,
  },
};
