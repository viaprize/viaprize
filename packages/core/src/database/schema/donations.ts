import { eq } from 'drizzle-orm'
import {
  boolean,
  integer,
  numeric,
  pgEnum,
  pgMaterializedView,
  pgTable,
  serial,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core'
import { createInsertSchema } from 'drizzle-zod'
export const donationTokenTypeEnum = pgEnum('donationTokenTypeEnum', [
  'TOKEN',
  'NFT',
])

export const recipientTypeEnum = pgEnum('recipientTypeEnum', [
  'PRIZE',
  'FUNDRAISER',
  'GITCOIN',
  'UNKNOWN',
])
export const donationTypeEnum = pgEnum('donationTypeEnum', ['PAYMENT', 'GIFT'])
export const donations = pgTable('donations', {
  id: serial('id').primaryKey(),
  valueInToken: numeric('amount').notNull().default('0'),
  token: varchar('token').notNull(),
  decimals: integer('decimals').notNull().default(6),
  tokenType: donationTokenTypeEnum('tokenType').notNull().default('TOKEN'),
  type: donationTypeEnum('type').notNull().default('PAYMENT'),
  donor: varchar('donor').notNull(),
  recipientAddress: varchar('recipient').notNull(),
  recipientType: recipientTypeEnum('recipientType')
    .notNull()
    .default('UNKNOWN'),
  transactionId: varchar('transactionId'),
  paymentId: varchar('paymentId').unique(),

  isFiat: boolean('isFiat').notNull().default(false),
  isFullyRefunded: boolean('isRefunded').notNull().default(false),
  isPartiallyRefunded: boolean('isPartiallyRefunded').notNull().default(false),
  totalRefunded: numeric('totalRefunded').notNull().default('0'),

  createdAt: timestamp('createdAt', {
    mode: 'date',
    withTimezone: true,
  }).$default(() => new Date()),
  updatedAt: timestamp('updatedAt', {
    mode: 'date',
    withTimezone: true,
  }).$onUpdate(() => new Date()),
})

export const prizeDonationsView = pgMaterializedView('prize_donations_view').as(
  (qb) =>
    qb.select().from(donations).where(eq(donations.recipientType, 'PRIZE')),
)
export const fundraiserDonationsView = pgMaterializedView(
  'fundraiser_donations_view',
).as((qb) =>
  qb.select().from(donations).where(eq(donations.recipientType, 'FUNDRAISER')),
)
export const gitcoinDonationsView = pgMaterializedView(
  'gitcoin_donations_view',
).as((qb) =>
  qb.select().from(donations).where(eq(donations.recipientType, 'GITCOIN')),
)

const donationViews = {
  prizeDonationsView,
  fundraiserDonationsView,
  gitcoinDonationsView,
} as const

// Schema for inserting a user - can be used to validate API requests
export const insertDonationSchema = createInsertSchema(donations)

// Create a union type of the variable names
export type DonationViewNames = keyof typeof donationViews
