import { http, createPublicClient } from 'viem'
import { getChain } from '../utils'

export class Blockchain {
  rpcUrl: string
  chainId: number
  blockchainClient
  constructor(rpcUrl: string, chainId: number) {
    this.rpcUrl = rpcUrl
    this.chainId = chainId
    this.blockchainClient = createPublicClient({
      chain: getChain(this.chainId as 10),
      transport: http(this.rpcUrl),
    })
  }
}
