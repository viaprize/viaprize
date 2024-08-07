/* eslint-disable @typescript-eslint/no-unused-vars -- will use later */
import { env } from '@env';
import type { Chain } from 'wagmi';
import { configureChains, createConfig } from 'wagmi';
import { base, optimism, optimismGoerli, polygonMumbai } from 'wagmi/chains';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';

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

const getProvider = (chainName: string) => {
  return jsonRpcProvider({
    rpc: (chain) => ({
      http: env.NEXT_PUBLIC_RPC_URL,
    }),
  });
};

export const chain = getChain(env.NEXT_PUBLIC_CHAIN);
const provider = getProvider(env.NEXT_PUBLIC_CHAIN);
export const configureChainsConfig = configureChains([chain], [provider]);
const config = createConfig({
  autoConnect: true,
  publicClient: configureChainsConfig.publicClient,
  webSocketPublicClient: configureChainsConfig.webSocketPublicClient,
});
export default config;
