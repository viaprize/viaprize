import { defineConfig } from '@wagmi/cli';
import { actions, hardhat, react } from '@wagmi/cli/plugins';

export default defineConfig({
  out: 'lib/smartContract.ts',
  contracts: [],
  plugins: [
    actions({
      getContract: false,
      readContract: false,
      watchContractEvent: false,
    }),
    hardhat({
      project: '../contracts',
      include: [
        "contracts/PrizeFactory.sol/*.json",
        "contracts/PrizeJudgesFactory.sol/*.json",
        "contracts/Prize.sol/*.json",
        "contracts/PrizeJudges.sol/*.json",
        "contracts/portal.sol/*.json",
        "contracts/portalFactory.sol/*.json",

      ],
      deployments: {
        PrizeFactory: {
          10: '0xAd5a14F8a94125e265ED12FBB153A92652540283'
        },
        PrizeJudgesFactory: {
          10: '0x515878E82EbEB6130d7C6Ee5CE674D2aF6cF344D'
        },
        portalFactory: {
          // 80001: '0xAe37824e718488787D1bbD87E35985ED107a0C7E',
          10: '0xA75b783F132Dea807e9197Ebd200c884Aa1D7fa0',
        },
      },
    }),
    react({
      useContractEvent: false,
      useContractItemEvent: false,

    })
  ],
});
