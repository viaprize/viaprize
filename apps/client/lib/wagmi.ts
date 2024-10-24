import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { http } from 'viem';
import { arbitrum, celo } from 'wagmi/chains';
export const config = getDefaultConfig({
  appName: 'Viaprize',
  projectId: 'af44ac93e8878d0961629186986b6a4e',
  chains: [celo, arbitrum],
  transports: {
    [celo.id]: http('https://celo-mainnet.infura.io/v3/628ea65fa762421b9c74dac71f5c8a41'),
  },
  // If your dApp uses server side rendering (SSR)
});
