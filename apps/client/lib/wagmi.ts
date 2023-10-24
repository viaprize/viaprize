import type { Chain } from 'wagmi';
import { configureChains, createConfig } from 'wagmi';
import { optimism, optimismGoerli } from 'wagmi/chains';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { env } from '@env';

const getChain = (chainName: string): Chain => {
  switch (chainName) {
    case 'op': {
      return optimism;
    }
    case 'op-goerli': {
      return optimismGoerli;
    }
    default: {
      throw new Error('Chain Id is not defined in the app');
    }
  }
};

const getProvider = (chainName: string) => {
  switch (chainName) {
    case 'op': {
      return alchemyProvider({
        apiKey: '224qz7e8XHRyAkY6AXLYHhGB9cPxeuYG',
      });
    }
    case 'op-goerli': {
      return alchemyProvider({
        apiKey: 'WJky3_r1JKKeHmTC6CsDg9_iJdaAvIqK',
      });
    }
    default: {
      throw new Error('Chain Id is not defined in the app');
    }
  }
};

const chain = getChain(env.NEXT_PUBLIC_CHAIN);
const provider = getProvider(env.NEXT_PUBLIC_CHAIN);
export const configureChainsConfig = configureChains([chain], [provider]);
const config = createConfig({
  autoConnect: true,
  publicClient: configureChainsConfig.publicClient,
  webSocketPublicClient: configureChainsConfig.webSocketPublicClient,
});
export default config;
