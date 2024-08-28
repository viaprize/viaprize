import { relations } from "drizzle-orm";
import { json, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { prizes } from "./prizes";
import { users } from "./users";

export const wallets = pgTable("wallets", {
  address: text("address").primaryKey(),
  network: text("network").notNull(),
  key: text("key"),
  metadata: json("metadata"),
  updatedAt: timestamp("updatedAt", { mode: "date" }).$onUpdate(
    () => new Date()
  ),
  username: varchar("username").references(() => users.username, {
    onDelete: "cascade",
  }),
  prizeId: varchar("prizeId").references(() => prizes.id, {
    onDelete: "cascade",
  }),

  createdAt: timestamp("createdAt", { mode: "date" }).$default(
    () => new Date()
  ),
});

export const walletRelations = relations(wallets, ({ one }) => ({
  user: one(users, {
    fields: [wallets.username],
    references: [users.username],
  }),
  prize: one(prizes, {
    fields: [wallets.prizeId],
    references: [prizes.id],
  }),
}));
