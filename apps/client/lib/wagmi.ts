import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { arbitrum, celo } from 'wagmi/chains';
export const config = getDefaultConfig({
  appName: 'Viaprize',
  projectId: 'af44ac93e8878d0961629186986b6a4e',
  chains: [celo, arbitrum],
  // If your dApp uses server side rendering (SSR)
});
