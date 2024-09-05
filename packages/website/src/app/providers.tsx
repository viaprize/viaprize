"use client";
import { wagmiConfig } from "@/lib/wagmi";
import { TRPCReactProvider } from "@/trpc/react";
import {
  RainbowKitAuthenticationProvider,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";

import {
  SessionProvider,
  getCsrfToken,
  signIn,
  signOut,
  useSession,
} from "next-auth/react";
import { State, WagmiProvider } from "wagmi";
import { optimism } from "wagmi/chains";

import { SIWE_PUBLIC_MESSAGE } from "@/lib/constant";
import { createAuthenticationAdapter } from "@rainbow-me/rainbowkit";
import { SiweMessage } from "siwe-viem";

const authenticationAdapter = createAuthenticationAdapter({
  getNonce: async () => {
    const csrfToken = await getCsrfToken();
    return csrfToken;
  },

  createMessage: ({ nonce, address, chainId }) => {
    return new SiweMessage({
      domain: window.location.host,
      address,
      statement: SIWE_PUBLIC_MESSAGE,
      uri: window.location.origin,
      version: "1",
      chainId,
      nonce,
    });
  },

  getMessageBody: ({ message }) => {
    return message.prepareMessage();
  },

  verify: async ({ message, signature }) => {
    await signIn("credentials", {
      message: JSON.stringify(message),
      signedMessage: signature,
      callbackUrl: "/prize",
    });

    return true;
  },

  signOut: async () => {
    await signOut();
  },
});

function WalletProvider({ children }: { children: React.ReactNode }) {
  const { status } = useSession();
  return (
    <RainbowKitAuthenticationProvider
      adapter={authenticationAdapter}
      status={status}
    >
      <RainbowKitProvider coolMode initialChain={optimism}>
        {children}
      </RainbowKitProvider>
    </RainbowKitAuthenticationProvider>
  );
}
export function Providers({
  children,
  initialState,
}: {
  children: React.ReactNode;
  initialState: State | undefined;
}) {
  return (
    <WagmiProvider config={wagmiConfig} initialState={initialState}>
      <TRPCReactProvider>
        <SessionProvider>
          <WalletProvider>{children}</WalletProvider>
        </SessionProvider>
      </TRPCReactProvider>
    </WagmiProvider>
  );
}
