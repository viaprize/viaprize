import {
  EthereumClient,
  w3mConnectors,
  w3mProvider,
} from "@web3modal/ethereum";
import { Web3Modal } from "@web3modal/react";
import React from "react";
import { WagmiConfig, configureChains, createConfig } from "wagmi";
import { polygonMumbai } from "wagmi/chains";

interface WagmiProviderType {
  children: React.ReactNode;
}

const chains = [polygonMumbai];
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- because i will change this soon
const projectId = process.env.NEXT_PUBLIC_W3C_PID!;
// eslint-disable-next-line -- can't seem to understand its types
const { publicClient } = configureChains(chains, [w3mProvider({ projectId })]);
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, chains }),
  publicClient,
});

const ethereumClient = new EthereumClient(wagmiConfig, chains);
function WagmiProvider({ children }: WagmiProviderType) {
  return (
    <>
      <WagmiConfig config={wagmiConfig}>{children}</WagmiConfig>
      <Web3Modal projectId={projectId} ethereumClient={ethereumClient} />
    </>
  );
}

export default WagmiProvider;
