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
        'contracts/portalFactory.sol/*.json',
        'contracts/v2/prizes/prizesV2Factory.sol/*.json',
        'contracts/v2/prizes/prizes.sol/*.json',
      ],
      deployments: {
        // PrizeJudgesFactory: {
        //   10: '0x7f1aF102d6EBaa0F673C3C574c58EB052db93675',
        // },
        portalFactory: {
          // 80001: '0xAe37824e718488787D1bbD87E35985ED107a0C7E',
          10: '0xA75b783F132Dea807e9197Ebd200c884Aa1D7fa0',
        },
        PrizeFactoryV2: {
          10: '0xd861aFdb5265EB580Db3D7a3126559E4c47B6B8b',
        },
      },
    }),
    react({
      useContractEvent: false,
      useContractItemEvent: false,
    }),
  ],
});
