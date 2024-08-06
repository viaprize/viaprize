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
        'contracts/portal.sol/*.json',
        'contracts/v2/fundRaisers/passThroughV2Factory.sol/*.json',
        'contracts/v2/prizes/prizesV2Factory.sol/*.json',
        'contracts/v2/prizes/prizes.sol/*.json',
      ],
      deployments: {
        // PrizeJudgesFactory: {
        //   10: '0x7f1aF102d6EBaa0F673C3C574c58EB052db93675',
        // },
        passThroughV2Factory: {
          // 80001: '0xAe37824e718488787D1bbD87E35985ED107a0C7E',
          8453: '0xdCcF514720AABBfFF6bed7a7Db4b498677EfD3D3',
        },
        PrizeFactoryV2: {
          8453: '0x6A2a33085C94B9DA08a5abC17f362FB54612a5CD',
        },
      },
    }),
    react({
      useContractEvent: false,
      useContractItemEvent: false,
    }),
  ],
});
