import { defineConfig } from '@wagmi/cli';
import { hardhat, react } from '@wagmi/cli/plugins';

export default defineConfig({
  out: 'lib/smartContract.ts',
  contracts: [],
  plugins: [
    hardhat({
      project: '../contracts',
      deployments: {
        ViaPrizeFactory: {
          1: '0xafa0f403EF2De1965a02f517c2DBec58D62Dd2B2',
        },
      },
    }),
    react(),
  ],
});
