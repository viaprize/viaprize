import { relations } from "drizzle-orm";
import { pgTable, text, varchar } from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";
import { prizes } from "./prizes";
import { users } from "./users";

export const prizeComments = pgTable("prize_comments", {
  id: varchar("id")
    .$default(() => nanoid(10))
    .primaryKey(),
  prizeId: varchar("prizeId").notNull(),
  username: varchar("username").notNull(),
  comment: text("comment").notNull(),
});

export const prizeCommentsRelations = relations(prizeComments, ({ one }) => ({
  prize: one(prizes, {
    fields: [prizeComments.prizeId],
    references: [prizes.id],
  }),
  user: one(users, {
    fields: [prizeComments.username],
    references: [users.username],
  }),
}));
