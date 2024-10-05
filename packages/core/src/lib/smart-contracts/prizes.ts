import { encodeFunctionData, hexToString, stringToHex } from 'viem'
import type { prizes } from '../../database/schema'
import { PRIZE_FACTORY_ABI, PRIZE_V2_ABI } from '../abi'
import { CONTRACT_CONSTANTS_PER_CHAIN } from '../constants'
import { Blockchain } from './blockchain'

export class PrizesBlockchain extends Blockchain {
  async getEncodedStartSubmission(submissionDurationInMinutes: number) {
    const data = encodeFunctionData({
      abi: PRIZE_V2_ABI,
      functionName: 'startSubmissionPeriod',
      args: [BigInt(submissionDurationInMinutes)],
    })
    return data
  }
  getPrizeFactoryV2Address() {
    const constants =
      CONTRACT_CONSTANTS_PER_CHAIN[
        this.chainId as keyof typeof CONTRACT_CONSTANTS_PER_CHAIN
      ]
    return constants.PRIZE_FACTORY_V2_ADDRESS
  }
  async getEncodedEndVoting() {
    const data = encodeFunctionData({
      abi: PRIZE_V2_ABI,
      functionName: 'endVotingPeriod',
      args: [],
    })
    return data
  }
  async getEncodedEndDispute() {
    const data = encodeFunctionData({
      abi: PRIZE_V2_ABI,
      functionName: 'endDispute',
      args: [],
    })
    return data
  }
  async getEncodedAddUsdcFunds(
    amount: bigint,
    deadline: bigint,
    v: number,
    s: `0x${string}`,
    r: `0x${string}`,
    ethSignedMessageHash: `0x${string}`,
    fiatPayment: boolean,
  ) {
    const data = encodeFunctionData({
      abi: PRIZE_V2_ABI,
      functionName: 'addUsdcFunds',
      args: [amount, deadline, v, s, r, ethSignedMessageHash, fiatPayment],
    })
    return data
  }
  async getEncodedAddVoteData(
    submissionHash: `0x${string}`,
    voteAmount: bigint,
    v: number,
    s: `0x${string}`,
    r: `0x${string}`,
  ) {
    const data = encodeFunctionData({
      abi: PRIZE_V2_ABI,
      functionName: 'vote',
      args: [submissionHash, voteAmount, v, s, r],
    })
    return data
  }
  async getEncodedAddSubmissionData(
    contestant: `0x${string}`,
    submissionText: string,
  ) {
    const data = encodeFunctionData({
      abi: PRIZE_V2_ABI,
      functionName: 'addSubmission',
      args: [contestant, stringToHex(submissionText)],
    })
    return data
  }
  async getEncodedDeployPrizeData(
    customPrize: Pick<
      typeof prizes.$inferSelect,
      'id' | 'proposerAddress' | 'platformFeePercentage' | 'authorFeePercentage'
    >,
  ) {
    const constants =
      CONTRACT_CONSTANTS_PER_CHAIN[
        this.chainId as keyof typeof CONTRACT_CONSTANTS_PER_CHAIN
      ]
    const data = encodeFunctionData({
      abi: PRIZE_FACTORY_ABI,
      functionName: 'createViaPrize',
      args: [
        customPrize.id,
        customPrize.proposerAddress as `0x${string}`,
        constants.ADMINS,
        customPrize.platformFeePercentage,
        customPrize.authorFeePercentage,
        constants.USDC,
        constants.USDC_BRIDGE,
        constants.SWAP_ROUTER,
        constants.USDC_TO_USDCE_POOL,
        constants.USDC_TO_ETH_POOL,
        constants.ETH_PRICE,
        constants.WETH,
      ],
    })
    return data
  }

  async getEncodedEndSubmissionAndStartVoting(
    customPrize: Pick<typeof prizes.$inferInsert, 'votingDurationInMinutes'>,
  ) {
    const endSubmissionPeriodData = await this.getEncodedEndSubmission()
    const startVotingPeriodData = await this.getEncodedStartVoting({
      votingDurationInMinutes: customPrize.votingDurationInMinutes,
    })

    return {
      endSubmissionPeriodData,
      startVotingPeriodData,
    }
  }
  async getEncodedEndSubmission() {
    const data = encodeFunctionData({
      abi: PRIZE_V2_ABI,
      functionName: 'endSubmissionPeriod',
      args: [],
    })
    return data
  }
  async getEncodedStartVoting(
    customPrize: Pick<typeof prizes.$inferInsert, 'votingDurationInMinutes'>,
  ) {
    const data = encodeFunctionData({
      abi: PRIZE_V2_ABI,
      functionName: 'startVotingPeriod',
      args: [BigInt(customPrize.votingDurationInMinutes)],
    })
    return data
  }
}
