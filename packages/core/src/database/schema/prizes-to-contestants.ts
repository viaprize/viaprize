import { relations } from "drizzle-orm";
import { pgTable, primaryKey, varchar } from "drizzle-orm/pg-core";
import { prizes } from "./prizes";
import { users } from "./users";

export const prizesToContestants = pgTable(
  "prizes_to_contestants",
  {
    username: varchar("username")
      .notNull()
      .references(() => users.username),
    prizeId: varchar("prizeId")
      .notNull()
      .references(() => prizes.id),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.username, t.prizeId] }),
  })
);

export const prizeToContestantsRelations = relations(
  prizesToContestants,
  ({ one }) => ({
    group: one(prizes, {
      fields: [prizesToContestants.prizeId],
      references: [prizes.id],
    }),
    user: one(users, {
      fields: [prizesToContestants.username],
      references: [users.username],
    }),
  })
);
