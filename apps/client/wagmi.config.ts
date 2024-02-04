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
        'contracts/PrizeFactory.sol/*.json',
        'contracts/PrizeJudgesFactory.sol/*.json',
        'contracts/Prize.sol/*.json',
        'contracts/PrizeJudges.sol/*.json',
        'contracts/portal.sol/*.json',
        'contracts/portalFactory.sol/*.json',
      ],
      deployments: {
        PrizeFactory: {
          10: '0xa7622aeFBF142f607A1Ad6a207F9955f0f93709A',
        },
        PrizeJudgesFactory: {
          10: '0x7f1aF102d6EBaa0F673C3C574c58EB052db93675',
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
    }),
  ],
});
