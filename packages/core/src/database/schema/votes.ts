import { relations } from 'drizzle-orm'
import { pgTable, text, timestamp, varchar } from 'drizzle-orm/pg-core'
import { prizes } from './prizes'
import { submissions } from './submissions'
import { users } from './users'

export const votes = pgTable('votes', {
  voteId: varchar('id', { length: 255 }).primaryKey(),
  submissionHash: varchar('submissionHash')
    .references(() => submissions.submissionHash, {
      onDelete: 'cascade',
    })
    .notNull(),
  prizeId: varchar('prizeId')
    .references(() => submissions.prizeId, {
      onDelete: 'cascade',
    })
    .notNull(),
  funderAddress: text('funderAddress').notNull(),
  voteAmount: text('voteAmount').notNull(),
  username: varchar('username')
    .references(() => users.username, {
      onDelete: 'cascade',
    })
    .notNull(),
  createdAt: timestamp('createdAt', {
    mode: 'date',
    withTimezone: true,
  }).$default(() => new Date()),
  updatedAt: timestamp('updatedAt', {
    mode: 'date',
    withTimezone: true,
  }).$onUpdate(() => new Date()),
})

export const voteRelations = relations(votes, ({ one }) => ({
  submission: one(submissions, {
    fields: [votes.submissionHash],
    references: [submissions.submissionHash],
  }),
  prize: one(prizes, {
    fields: [votes.prizeId],
    references: [prizes.id],
  }),
  user: one(users, {
    fields: [votes.username],
    references: [users.username],
  }),
}))
