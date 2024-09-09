import { eq } from 'drizzle-orm'
import { nanoid } from 'nanoid'
import type { ViaprizeDatabase } from '../database'
import { prizes } from '../database/schema'
import { stringToSlug } from './utils'

export class Prizes {
  db
  constructor(viaprizeDb: ViaprizeDatabase) {
    this.db = viaprizeDb.database
  }

  async addPrizeProposal(data: {
    title: string
    description: string
    submissionStartDate: Date
    submissionDuration: number
    votingStartDate: Date
    votingDuration: number
    imageUrl: string
    username: string
    proposerAddress: string
  }) {
    const slug = stringToSlug(data.title)
    const randomId = nanoid(3)
    const prizeId = await this.db.transaction(async (trx) => {
      const [slugExists] = await trx
        .select({
          slug: prizes.slug,
        })
        .from(prizes)
        .where(eq(prizes.slug, slug))
        .limit(1)
      const [prize] = await trx
        .insert(prizes)
        .values({
          authorUsername: data.username as any,
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
      return prize?.id
    })

    return prizeId
  }
}
