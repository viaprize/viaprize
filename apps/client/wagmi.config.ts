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
          1: '0x0dd8d97E5b41010F5a47dAA2217aed175Ad15dd4',
        },
      },
    }),
    react(),
  ],
});
