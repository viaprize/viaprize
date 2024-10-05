import {
  and,
  asc,
  count,
  desc,
  eq,
  gte,
  inArray,
  lte,
  or,
  sql,
} from 'drizzle-orm'
import { nanoid } from 'nanoid'
import {
  type TransactionReceipt,
  encodeFunctionData,
  parseEventLogs,
} from 'viem'
import { fraxtalTestnet } from 'viem/chains'
import type { z } from 'zod'
import type { ViaprizeDatabase } from '../database'
import {
  activities,
  donations,
  type insertDonationSchema,
  prizeComments,
  prizes,
  prizesToContestants,
  submissions,
  votes,
} from '../database/schema'
import { PRIZE_FACTORY_ABI, PRIZE_V2_ABI } from '../lib/abi'
import { CacheTag } from './cache-tag'
import { CONTRACT_CONSTANTS_PER_CHAIN } from './constants'
import { PrizesBlockchain } from './smart-contracts/prizes'
import { stringToSlug } from './utils'

const CACHE_TAGS = {
  PENDING_PRIZES: { value: 'pending-prizes', requiresSuffix: false },
  ACTIVE_PRIZES_COUNT: { value: 'active-prizes-count', requiresSuffix: false },
  DEPLOYED_PRIZES: { value: 'deployed-prizes', requiresSuffix: false },
  SLUG_PRIZE: { value: 'slug-prize-in-', requiresSuffix: true },
  TOTAL_PRIZE_POOL: { value: 'total-prize-pool', requiresSuffix: false },
  LATEST_PRIZE_ACTIVITES: {
    value: 'latest-prize-activities',
    requiresSuffix: false,
  },
} as const

interface FilterOptions {
  categories?: string[]
  prizeStatus?: 'active' | 'ended'
  minAmount?: number
  maxAmount?: number
  sort?: 'ASC' | 'DESC'
}
export type PrizeStages = typeof prizes.stage._.data | null
export type PrizeStagesWithoutNull = typeof prizes.stage._.data
export class Prizes extends CacheTag<typeof CACHE_TAGS> {
  db
  chainId: number
  blockchain: PrizesBlockchain

  constructor(viaprizeDb: ViaprizeDatabase, chainId: number, rpcUrl: string) {
    super(CACHE_TAGS)
    this.db = viaprizeDb.database
    this.chainId = chainId
    this.blockchain = new PrizesBlockchain(rpcUrl, chainId)
  }

  async getContestants(prizeId: string) {
    const contestants = await this.db.query.prizesToContestants.findMany({
      where: eq(prizesToContestants.prizeId, prizeId),
      with: {
        user: {
          columns: {
            username: true,
            image: true,
          },
        },
      },
    })
    return contestants
  }

  async getLatestActivitiesInPrizes(limit = 5) {
    const latestActivities = await this.db.query.activities.findMany({
      orderBy: desc(activities.createdAt),
      where: eq(activities.tag, 'PRIZE'),
      columns: {
        createdAt: true,
        activity: true,
      },
      with: {
        user: {
          columns: {
            username: true,
            image: true,
          },
        },
      },
      limit,
    })
    return latestActivities
  }

  async getDeployedPrizesCount() {
    const countPrize = await this.db
      .select({ count: count() })
      .from(prizes)
      .where(eq(prizes.proposalStage, 'APPROVED'))
    return countPrize[0]?.count || 0
  }

  async getFilteredPrizes(filters: FilterOptions) {
    const { categories, prizeStatus, minAmount, maxAmount, sort } = filters
    const conditions: Array<any> = [] // Replace `any` with a more specific type if possible

    // Define the valid stages based on the prize status
    const stages: PrizeStagesWithoutNull[] =
      prizeStatus === 'active'
        ? [
            'NOT_STARTED',
            'SUBMISSIONS_OPEN',
            'VOTING_OPEN',
            'DISPUTE_AVAILABLE',
            'DISPUTE_ACTIVE',
          ]
        : ['WON', 'REFUNDED']

    // Use inArray for stage filtering
    conditions.push(inArray(prizes.stage, stages))

    // Filter by prize amount
    if (minAmount !== undefined) {
      conditions.push(gte(prizes.funds, minAmount))
    }
    if (maxAmount !== undefined) {
      conditions.push(lte(prizes.funds, maxAmount))
    }

    // Filter by categories
    if (categories?.length) {
      const categoryConditions = categories.map(
        (category) => sql`${prizes.skillSets}::jsonb ? ${category}`,
      )
      conditions.push(or(...categoryConditions))
    }

    // Combine conditions using `and`
    const whereClause = conditions.length > 0 ? and(...conditions) : undefined

    // Construct and execute the query
    return await this.db.query.prizes.findMany({
      where: whereClause,
      orderBy: sort === 'ASC' ? asc(prizes.createdAt) : desc(prizes.createdAt),
    })
  }

  async getPendingPrizes() {
    const proposals = await this.db.query.prizes.findMany({
      where: eq(prizes.proposalStage, 'PENDING'),
      orderBy: desc(prizes.createdAt),
    })

    return proposals
  }

  async startSubmissionPeriodByContractAddress(contractAddress: string) {
    await this.db
      .update(prizes)
      .set({
        stage: 'SUBMISSIONS_OPEN',
      })
      .where(eq(prizes.primaryContractAddress, contractAddress.toLowerCase()))
  }
  async endDisputePeriodByContractAddress(contractAddress: string) {
    await this.db
      .update(prizes)
      .set({
        stage: 'WON',
      })
      .where(eq(prizes.primaryContractAddress, contractAddress))
  }
  async endVotingPeriodByContractAddress(contractAddress: string) {
    await this.db
      .update(prizes)
      .set({
        stage: 'DISPUTE_AVAILABLE',
      })
      .where(eq(prizes.primaryContractAddress, contractAddress.toLowerCase()))
  }

  async startVotingPeriodByContractAddress(contractAddress: string) {
    await this.db
      .update(prizes)
      .set({
        stage: 'VOTING_OPEN',
      })
      .where(eq(prizes.primaryContractAddress, contractAddress.toLowerCase()))
  }

  async refundByContractAddress({
    primaryContractAddress,
    totalRefunded,
  }: {
    primaryContractAddress: string
    totalRefunded: number
  }) {
    await this.db
      .update(prizes)
      .set({
        stage: 'REFUNDED',
        totalRefunded: totalRefunded,
      })
      .where(
        eq(prizes.primaryContractAddress, primaryContractAddress.toLowerCase()),
      )
  }

  async getPrizeByContractAddress(contractAddress: string) {
    console.log(contractAddress)
    const prize = await this.db.query.prizes.findFirst({
      where: eq(prizes.primaryContractAddress, contractAddress),
    })
    console.log(prize)
    if (!prize) {
      throw new Error('Prize not found')
    }
    return prize
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
      with: {
        submissions: {
          orderBy: desc(submissions.createdAt),
        },
        comments: {
          orderBy: desc(prizeComments.createdAt),
        },
        author: {
          columns: {
            name: true,
            username: true,
            image: true,
          },
        },
      },
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
    const prize = (
      await this.db
        .select()
        .from(prizes)
        .where(eq(prizes.id, prizeId))
        .limit(1)
        .execute()
    )[0]
    if (!prize) {
      console.error('Prize not found')
      return
    }
    if (prize.proposalStage === 'APPROVED') {
      console.error(new Error('Prize already approved'))
      return
    }
    if (prize.proposalStage !== 'APPROVED_BUT_NOT_DEPLOYED') {
      throw new Error('Prize not in correct stage')
    }

    const [res] = await this.db
      .update(prizes)
      .set({
        primaryContractAddress: contractAddress.toLowerCase(),
        proposalStage: 'APPROVED',
      })
      .returning({ contractAddress: prizes.primaryContractAddress })

    return res
  }

  async approvePrizeProposal(prizeId: string) {
    await this.db
      .update(prizes)
      .set({
        proposalStage: 'APPROVED_BUT_NOT_DEPLOYED',
      })
      .where(eq(prizes.id, prizeId))
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

  async addSubmission(data: typeof submissions.$inferInsert) {
    const submissionId = await this.db.transaction(async (trx) => {
      const [submission] = await trx
        .insert(submissions)
        .values({
          submissionHash: data.submissionHash,
          description: data.description,
          submitterAddress: data.submitterAddress,
          prizeId: data.prizeId,
          username: data.username,
        })
        .returning({
          submissionHash: submissions.submissionHash,
        })
      await trx
        .update(prizes)
        .set({
          numberOfSubmissions: sql`${prizes.numberOfSubmissions} + 1`,
        })
        .where(eq(prizes.id, data.prizeId))

      if (!submission) {
        throw new Error('Submission not created in database')
      }
      return submissions.submissionHash
    })

    return submissionId
  }

  async addContestant({
    prizeId,
    username,
  }: Pick<typeof prizesToContestants.$inferSelect, 'prizeId' | 'username'>) {
    await this.db.transaction(async (trx) => {
      await trx.insert(prizesToContestants).values({
        username: username,
        prizeId: prizeId,
      })

      await trx
        .update(prizes)
        .set({
          numberOfComments: sql`${prizes.numberOfComments} + 1`,
        })
        .where(eq(prizes.id, prizeId))
    })
  }

  async addVote(
    data: Pick<
      typeof votes.$inferSelect,
      | 'voteHash'
      | 'submissionHash'
      | 'prizeId'
      | 'funderAddress'
      | 'voteAmount'
      | 'username'
    >,
  ) {
    const voteId = await this.db.transaction(async (trx) => {
      const [vote] = await trx
        .insert(votes)
        .values({
          voteHash: data.voteHash,
          submissionHash: data.submissionHash,
          prizeId: data.prizeId,
          funderAddress: data.funderAddress,
          voteAmount: data.voteAmount,
          username: data.username,
        })
        .returning({
          voteId: votes.voteHash,
        })
      if (!vote) {
        throw new Error('Vote not casted, please try again')
      }
      return votes.voteHash
    })

    return voteId
  }
  async addUsdcFunds(data: z.infer<typeof insertDonationSchema>) {
    const donation = await this.db.insert(donations).values(data).execute()

    return donation
  }
}
