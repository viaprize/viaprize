import { relations } from "drizzle-orm";
import { pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { prizes } from "./prizes";

export const submissions = pgTable("submissions", {
  submissionHash: varchar("id", { length: 255 }).primaryKey(),
  description: text("description").notNull(),
  submitterAddress: text("submitterAddress").notNull(),
  prizeId: varchar("prizeId").references(() => prizes.id, {
    onDelete: "cascade",
  }),
  createdAt: timestamp("createdAt", { mode: "date" }).$default(
    () => new Date()
  ),
  updatedAt: timestamp("updatedAt", { mode: "date" }).$onUpdate(
    () => new Date()
  ),
});

export const submissionRelations = relations(submissions, ({ one }) => ({
  prize: one(prizes, {
    fields: [submissions.prizeId],
    references: [prizes.id],
  }),
}));
