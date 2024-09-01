import { relations } from 'drizzle-orm'
import { integer, pgTable, text, timestamp, varchar } from 'drizzle-orm/pg-core'
import { nanoid } from 'nanoid'
import { users } from './users'

export const prizeProposals = pgTable('prize_proposals', {
  id: varchar('id')
    .$default(() => nanoid(10))
    .primaryKey(),
  slug: varchar('slug').unique(),
  description: text('description').notNull(),
  startVotingDate: timestamp('startVotingDate', {
    mode: 'string',
    withTimezone: true,
  }).notNull(),
  startSubmissionDate: timestamp('startSubmissionDate', {
    mode: 'string',
    withTimezone: true,
  }).notNull(),
  submissionDurationInMinutes: integer('submissionDurationInMinutes').notNull(),
  votingDurationInMinutes: integer('votingDurationInMinutes').notNull(),
  judgesAddresses: text('judgesAddresses').array(),
  skillSets: text('skillSets').array(),
  priorities: text('priorities').array(),
  imageUrl: varchar('imageUrl'),
  // relations
  authorUsername: varchar('author')
    .references(() => users.username, {
      onDelete: 'cascade',
    })
    .notNull(),
})

export const prizeProposalsRelations = relations(prizeProposals, ({ one }) => ({
  author: one(users, {
    fields: [prizeProposals.authorUsername],
    references: [users.username],
  }),
}))
