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
          10: '0x0c32dA33f13cbC16101029c9C6d7c2998101cdBF',
        },
        PrizeFactoryV2: {
          10: '0xaDa6E22f72bb21Cb9d67779E5451949b4655F8F1',
        },
      },
    }),
    react({
      useContractEvent: false,
      useContractItemEvent: false,
    }),
  ],
});
