import { http, createPublicClient } from 'viem'
import { getChain } from './utils'

export type WalletType = 'reserve' | 'gasless'
export type AddressType = 'signer' | 'vault'

type TransactionData = {
  to: string
  value: string
  data: string
}

export class Wallet {
  url: string
  rpcUrl: string
  chainId: number
  walletApiKey: string
  blockchainClient
  constructor(
    url: string,
    rpcUrl: string,
    chainId: number,
    walletApiKey: string,
  ) {
    this.walletApiKey = walletApiKey
    this.url = url
    this.rpcUrl = rpcUrl
    this.chainId = chainId
    this.blockchainClient = createPublicClient({
      chain: getChain(this.chainId as 10),
      transport: http(this.rpcUrl),
    })
  }
  async generateWallet() {
    // Generate a wallet
    const res: { address: string; key: string } = (await (
      await fetch(this.url + '/wallet/generate')
    ).json()) as any
    return res
  }

  async simulateTransaction(
    tx: TransactionData,
    type: WalletType,
    addressType: AddressType,
  ) {
    const address = await this.getAddress(type, addressType)
    const res = await this.blockchainClient.call({
      account: address as `0x${string}`,
      to: tx.to as `0x${string}`,
      value: BigInt(tx.value),
      data: tx.data as `0x${string}`,
    })
    return res.data
  }

  async sendTransaction(tx: TransactionData, type: WalletType) {
    const transactionHash = await (
      await fetch(`${this.url}/${type}`, {
        body: JSON.stringify(tx),
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.walletApiKey,
          'x-chain-id': this.chainId.toString(),
        },
        method: 'POST',
      })
    )
      .json()
      .then((res) => {
        console.log({ res })
        return (res as any).hash as string
      })
    return transactionHash
  }

  async getAddress(type: WalletType, addressType: AddressType) {
    // Get the wallet address
    const res: { address: string } = (await (
      await fetch(
        this.url + `/${type}${addressType === 'signer' ? '/signer' : ''}`,
      )
    ).json()) as any
    return res.address
  }
}
