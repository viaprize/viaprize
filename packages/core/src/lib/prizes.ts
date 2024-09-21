import { count, desc, eq } from 'drizzle-orm'
import { nanoid } from 'nanoid'
import { encodeFunctionData } from 'viem'
import type { ViaprizeDatabase } from '../database'
import { prizes } from '../database/schema'
import { PRIZE_FACTORY_ABI } from '../lib/abi'
import { CacheTag } from './cache-tag'
import { CONTRACT_CONSTANTS_PER_CHAIN } from './constants'
import { stringToSlug } from './utils'
const CACHE_TAGS = {
  PENDING_PRIZES: { value: 'pending-prizes', requiresSuffix: false },
  ACTIVE_PRIZES_COUNT: { value: 'active-prizes-count', requiresSuffix: false },
  DEPLOYED_PRIZES: { value: 'deployed-prizes', requiresSuffix: false },
  SLUG_PRIZE: { value: 'slug-prize-in-', requiresSuffix: true },
} as const
export class Prizes extends CacheTag {
  db
  chainId: number

  constructor(viaprizeDb: ViaprizeDatabase, chainId: number) {
    super(CACHE_TAGS)
    this.db = viaprizeDb.database
    this.chainId = chainId
  }

  async getPendingPrizes() {
    const proposals = await this.db.query.prizes.findMany({
      where: eq(prizes.proposalStage, 'PENDING'),
      orderBy: desc(prizes.createdAt),
    })

    return proposals
  }

  async getDeployedPrizesCount() {
    const countPrize = await this.db
      .select({ count: count() })
      .from(prizes)
      .where(eq(prizes.proposalStage, 'APPROVED'))
    return countPrize[0]?.count
  }

  async getDeployedPrizes() {
    const deployedPrizes = await this.db.query.prizes.findMany({
      where: eq(prizes.proposalStage, 'APPROVED'),
      orderBy: desc(prizes.createdAt),
    })
    return deployedPrizes
  }

  async getPrizeById(prizeId: string) {
    const prize = await this.db.query.prizes.findFirst({
      where: eq(prizes.id, prizeId),
    })
    return prize
  }

  async getPrizeBySlug(slug: string) {
    const prize = await this.db.query.prizes.findFirst({
      where: eq(prizes.slug, slug),
    })
    return prize
  }

  getPrizeFactoryV2Address() {
    const constants =
      CONTRACT_CONSTANTS_PER_CHAIN[
        this.chainId as keyof typeof CONTRACT_CONSTANTS_PER_CHAIN
      ]
    return constants.PRIZE_FACTORY_V2_ADDRESS
  }

  async approveDeployedPrize(prizeId: string, contractAddress: string) {
    await this.db.transaction(async (trx) => {
      const prize = await trx.query.prizes.findFirst({
        where: eq(prizes.id, prizeId),
      })

      if (!prize) {
        console.error('Prize not found')
        return
      }
      if (prize.proposalStage === 'APPROVED') {
        console.error(new Error('Prize already approved'))
        return
      }

      console.log(prize)
      if (prize.proposalStage !== 'APPROVED_BUT_NOT_DEPLOYED') {
        throw new Error('Prize not in correct stage')
      }
      await trx
        .update(prizes)
        .set({
          primaryContractAddress: contractAddress,
          proposalStage: 'APPROVED',
        })
        .where(eq(prizes.id, prizeId))
    })
  }

  async approvePrizeProposal(prizeId: string) {
    await this.db
      .update(prizes)
      .set({
        proposalStage: 'APPROVED_BUT_NOT_DEPLOYED',
      })
      .where(eq(prizes.id, prizeId))
  }

  async getEncodedDeployPrizeData(prizeId: string) {
    const prize = await this.getPrizeById(prizeId)
    if (!prize) {
      throw new Error('Prize not found')
    }
    const constants =
      CONTRACT_CONSTANTS_PER_CHAIN[
        this.chainId as keyof typeof CONTRACT_CONSTANTS_PER_CHAIN
      ]

    const data = encodeFunctionData({
      abi: PRIZE_FACTORY_ABI,
      functionName: 'createViaPrize',
      args: [
        prizeId,
        prize.proposerAddress as `0x${string}`,
        constants.ADMINS,
        prize.platformFeePercentage,
        prize.authorFeePercentage,
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

  async addPrizeProposal(data: {
    title: string
    description: string
    submissionStartDate: string
    submissionDuration: number
    votingStartDate: string
    votingDuration: number
    imageUrl: string
    username: string
    proposerAddress: string
  }) {
    const slug = stringToSlug(data.title)
    const randomId = nanoid(3)
    const prizeId = await this.db.transaction(async (trx) => {
      // const [slugExists] = await trx
      //   .select({
      //     slug: prizes.slug,
      //   })
      //   .from(prizes)
      //   .where(eq(prizes.slug, slug))
      //   .limit(1);
      const slugExists = await trx.query.prizes.findFirst({
        where: eq(prizes.slug, slug),
        columns: {
          slug: true,
        },
      })
      const [prize] = await trx
        .insert(prizes)
        .values({
          authorUsername: data.username,
          description: data.description,
          imageUrl: data.imageUrl,
          submissionDurationInMinutes: data.submissionDuration,
          startVotingDate: data.votingStartDate,
          title: data.title,
          slug: slugExists ? `${slug}_${randomId}` : slug,
          votingDurationInMinutes: data.votingDuration,
          proposerAddress: data.proposerAddress,
          startSubmissionDate: data.submissionStartDate,
        })
        .returning({
          id: prizes.id,
        })
      if (!prize) {
        throw new Error('Prize not created in database')
      }
      return prize.id
    })

    return prizeId
  }
}
