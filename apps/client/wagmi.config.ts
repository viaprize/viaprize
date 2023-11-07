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
          1: '0x550055FfB1B0c51c96644D8e3302084403B0d215',
        },
      },
    }),
    react(),
  ],
});
