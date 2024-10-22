import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { arbitrum, base, optimism, optimismGoerli, polygonMumbai } from 'wagmi/chains';
const getChain = (chainName: string): Chain => {
  switch (chainName) {
    case 'op': {
      return optimism;
    }
    case 'op-goerli': {
      return optimismGoerli;
    }
    case 'mumbai': {
      return polygonMumbai;
    }
    case 'base': {
      return base;
    }
    default: {
      throw new Error('Chain Id is not defined in the app');
    }
  }
};
export const config = getDefaultConfig({
  appName: 'Viaprize',
  projectId: 'af44ac93e8878d0961629186986b6a4e',
  chains: [optimism, arbitrum, base],
  // If your dApp uses server side rendering (SSR)
});
