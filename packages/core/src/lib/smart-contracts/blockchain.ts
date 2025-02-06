import { http, createPublicClient, encodeFunctionData, erc20Abi } from 'viem'
import { ERC20_PERMIT_ABI } from '../abi'
import { CONTRACT_CONSTANTS_PER_CHAIN, type ValidChainIDs } from '../constants'
import { getChain } from '../utils'

export class Blockchain {
  rpcUrl: string
  chainId: ValidChainIDs
  blockchainClient
  constructor(rpcUrl: string, chainId: ValidChainIDs) {
    this.rpcUrl = rpcUrl
    this.chainId = chainId
    this.blockchainClient = createPublicClient({
      chain: getChain(this.chainId),
      transport: http(this.rpcUrl),
    })
  }
  getUsdcBalance(address: `0x${string}`) {
    const constants = CONTRACT_CONSTANTS_PER_CHAIN[this.chainId]
    const balance = this.blockchainClient.readContract({
      abi: erc20Abi,
      address: constants.USDC,
      functionName: 'balanceOf',
      args: [address],
    })
    return balance
  }

  getEncodedERC20PermitFunction(
    owner: `0x${string}`,
    spender: `0x${string}`,
    value: bigint,
    deadline: bigint,
    v: number,
    r: `0x${string}`,
    s: `0x${string}`,
  ) {
    return encodeFunctionData({
      abi: ERC20_PERMIT_ABI,
      functionName: 'permit',
      args: [owner, spender, value, deadline, v, r, s],
    })
  }
  getEncodedERC20TransferFromFunction(
    from: `0x${string}`,
    to: `0x${string}`,
    value: bigint,
  ) {
    return encodeFunctionData({
      abi: ERC20_PERMIT_ABI,
      functionName: 'transferFrom',
      args: [from, to, value],
    })
  }
}
