import { MetaMaskInpageProvider } from '@metamask/providers';
type EthereumEvents = {
  connect: { chainId: string };
  disconnect: { message: string; code: number; data?: unknown };
  accountsChanged: string[];
  chainChanged: string;
  close: unknown;
};
export interface Ethereum extends MetaMaskInpageProvider {
  on<K extends keyof EthereumEvents>(
    event: K,
    handler: (event: EthereumEvents[K]) => void,
  ): void;
  // other methods...
}
declare global {
  interface Window {
    ethereum: Ethereum;
  }
}
