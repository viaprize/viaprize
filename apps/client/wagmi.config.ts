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
      deployments: {
        ViaPrizeFactory: {
          // 80001: '0x0dd8d97E5b41010F5a47dAA2217aed175Ad15dd4',
          10: '0x6f951e2C1fD898435C0773db4CdA3f78ce2ec1AC',
        },
        portalFactory: {
          // 80001: '0xAe37824e718488787D1bbD87E35985ED107a0C7E',
          10: '0x8dc530D45061d23A4C05787216E45A23244482f4',
        },
      },
    }),
    react(),
  ],
});
