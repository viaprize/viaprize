import type { Chain } from 'wagmi';

import { base, optimism, optimismGoerli, polygonMumbai } from 'wagmi/chains';

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

export default config;
