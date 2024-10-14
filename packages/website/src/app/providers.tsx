'use client'
import { wagmiConfig } from '@/lib/wagmi'
import { TRPCReactProvider } from '@/trpc/react'
import {
  RainbowKitAuthenticationProvider,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit'

import {
  SessionProvider,
  getCsrfToken,
  signIn,
  signOut,
  useSession,
} from 'next-auth/react'
import { type State, WagmiProvider } from 'wagmi'
import { optimism } from 'wagmi/chains'

import { SIWE_PUBLIC_MESSAGE } from '@/lib/constant'
import { createAuthenticationAdapter } from '@rainbow-me/rainbowkit'
import { SiweMessage } from 'siwe-viem'

function WalletProvider({ children }: { children: React.ReactNode }) {
  return (
    <RainbowKitProvider coolMode initialChain={optimism}>
      {children}
    </RainbowKitProvider>
  )
}
export function Providers({
  children,
  initialState,
}: {
  children: React.ReactNode
  initialState: State | undefined
}) {
  return (
    <WagmiProvider config={wagmiConfig} initialState={initialState}>
      <TRPCReactProvider>
        <SessionProvider>
          <WalletProvider>{children}</WalletProvider>
        </SessionProvider>
      </TRPCReactProvider>
    </WagmiProvider>
  )
}
