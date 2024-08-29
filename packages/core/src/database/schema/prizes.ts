import { relations } from "drizzle-orm";
import {
  integer,
  json,
  pgEnum,
  pgTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";
import { prizeComments } from "./prize-comments";
import { submissions } from "./submissions";
import { users } from "./users";
import { wallets } from "./wallets";
export const prizeStagesEnum = pgEnum("prizeStage", [
  "NOT_STARTED",
  "SUBMISSIONS_OPEN",
  "VOTING_OPEN",
  "DISPUTE_AVAILABLE",
  "DISPUTE_ACTIVE",
  "WON",
  "REFUNDED",
]);

export const prizeProposalStage = pgEnum("prizeProposalStage", [
  "PENDING",
  "APPROVED",
  "REJECTED",
]);

export const prizes = pgTable("prizes", {
  id: varchar("id")
    .$default(() => nanoid(10))
    .primaryKey(),
  slug: varchar("slug").unique(),
  description: text("description").notNull(),
  startVotingDate: timestamp("startVotingDate", {
    mode: "string",
    withTimezone: true,
  }).notNull(),
  startSubmissionDate: timestamp("startSubmissionDate", {
    mode: "string",
    withTimezone: true,
  }).notNull(),
  submissionDurationInMinutes: integer("submissionDurationInMinutes").notNull(),
  votingDurationInMinutes: integer("votingDurationInMinutes").notNull(),
  primaryContractAddress: text("primaryContractAddress").notNull(),
  judgesAddresses: json("judgesAddresses").$type<string[]>(),
  skillSets: json("skillSets").$type<string[]>(),
  priorities: text("priorities").array(),
  imageUrl: varchar("imageUrl"),

  // smart contract values here
  authorFeePercentage: integer("proposerFeePercentage").default(5),
  platformFeePercentage: integer("platformFeePercentage").default(5),
  contractVersion: integer("contractVersion").default(201),
  funds: integer("totalFunds").default(0),
  totalRefunded: integer("totalRefunded").default(0),
  totalVotes: integer("totalWithdrawn").default(0),
  stage: prizeStagesEnum("prizeStage").default("NOT_STARTED"),
  proposalStage: prizeProposalStage("proposalStage").default("PENDING"),
  proposerAddress: text("proposerAddress").notNull(),
  createdAt: timestamp("createdAt", {
    mode: "date",
    withTimezone: true,
  }).$default(() => new Date()),
  updatedAt: timestamp("updatedAt", {
    mode: "date",
    withTimezone: true,
  }).$onUpdate(() => new Date()),

  // relations
  authorUsername: varchar("author")
    .references(() => users.username,{
      onDelete: "cascade",
    })
    .notNull(),
});

export const prizesRelations = relations(prizes, ({ one, many }) => ({
  author: one(users, {
    fields: [prizes.authorUsername],
    references: [users.username],
  }),
  submissions: many(submissions),
  secondaryContractAddresses: many(wallets),
  comments: many(prizeComments),
}));