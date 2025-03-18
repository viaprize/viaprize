'use client'
import { wagmiConfig } from '@/lib/wagmi'
import { TRPCReactProvider } from '@/trpc/react'
import {
  RainbowKitAuthenticationProvider,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit'
import { AppProgressBar as ProgressBar } from 'next-nprogress-bar'

import { env } from '@/env'
import { PrivyProvider } from '@privy-io/react-auth'
import {
  SessionProvider,
  getCsrfToken,
  signIn,
  signOut,
  useSession,
} from 'next-auth/react'
import { type State, WagmiProvider } from 'wagmi'
import { optimism, sepolia } from 'wagmi/chains'

function WalletProvider({ children }: { children: React.ReactNode }) {
  return (
    <RainbowKitProvider coolMode initialChain={env.NEXT_PUBLIC_CHAIN_ID === '10' ? optimism : sepolia}>
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
    <PrivyProvider
      appId={env.NEXT_PUBLIC_PRIVY_APP_ID}
      config={{
        // Customize Privy's appearance in your app
        appearance: {
          theme: 'light',
          accentColor: '#676FFF',

        },
        // Create embedded wallets for users who don't have a wallet
        embeddedWallets: {
          createOnLogin: 'users-without-wallets',
        },
      }}
    >


      <WagmiProvider config={wagmiConfig} initialState={initialState}>

        <ProgressBar
          height="4px"
          color="#17824d"
          options={{ showSpinner: false }}
          shallowRouting
        />
        <TRPCReactProvider>
          <SessionProvider>
            <WalletProvider>{children}</WalletProvider>
          </SessionProvider>
        </TRPCReactProvider>
      </WagmiProvider>
    </PrivyProvider>
  )
}
