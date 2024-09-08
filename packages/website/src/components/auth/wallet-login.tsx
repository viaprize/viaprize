import { ConnectButton } from '@rainbow-me/rainbowkit'
export const WalletLogin = () => {
  return (
    <ConnectButton
      chainStatus={{ largeScreen: 'full', smallScreen: 'icon' }}
      label="Log in with Wallet"
    />
  )
}
