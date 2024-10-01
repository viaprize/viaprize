import { relations } from "drizzle-orm";
import {
  integer,
  pgTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { prizes } from "./prizes";
import { submissions } from "./submissions";
import { users } from "./users";

export const votes = pgTable("votes", {
  voteHash: varchar("id", { length: 255 }).primaryKey(),
  submissionHash: varchar("submissionHash")
    .references(() => submissions.submissionHash, {
      onDelete: "cascade",
      onUpdate: "cascade",
    })
    .notNull(),
  prizeId: varchar("prizeId")
    .references(() => prizes.id, {
      onDelete: "cascade",
    })
    .notNull(),
  funderAddress: text("funderAddress").notNull(),
  voteAmount: integer("voteAmount").notNull(),
  username: varchar("username")
    .references(() => users.username, {
      onDelete: "cascade",
    })
    .notNull(),
  createdAt: timestamp("createdAt", {
    mode: "date",
    withTimezone: true,
  }).$default(() => new Date()),
  updatedAt: timestamp("updatedAt", {
    mode: "date",
    withTimezone: true,
  }).$onUpdate(() => new Date()),
});

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
}));
