import { relations } from "drizzle-orm";
import { pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";
import { prizes } from "./prizes";
import { users } from "./users";

export const prizeComments = pgTable("prize_comments", {
  id: varchar("id")
    .$default(() => nanoid(10))
    .primaryKey(),
  prizeId: varchar("prizeId").notNull().references(() => prizes.id, {
    onDelete: "cascade",
  }),
  username: varchar("username").notNull().references(() => users.username,{
    onDelete: "cascade",
  }),
  comment: text("comment").notNull(),
  createdAt: timestamp("createdAt", {
    mode: "date",
    withTimezone: true,
  }).$default(() => new Date()),
  updatedAt: timestamp("updatedAt", {
    mode: "date",
    withTimezone: true,
  }).$onUpdate(() => new Date()),
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
