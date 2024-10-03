import {
  integer,
  pgTable,
  primaryKey,
  text,
  varchar,
  timestamp,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { users } from "./users";
import { nanoid } from "nanoid";
export const activities = pgTable("activities", {
  id: varchar("id")
    .$default(() => nanoid(10))
    .primaryKey(),
  username: varchar("username")
    .references(() => users.username, {
      onDelete: "cascade",
    })
    .notNull(),
  activity: text("activity").notNull(),
  tag: text("tag").notNull().default("PRIZE"),
  createdAt: timestamp("createdAt", {
    mode: "date",
    withTimezone: true,
  })
    .$default(() => new Date())
    .notNull(),
});

export const activitiesRelations = relations(activities, ({ one, many }) => ({
  user: one(users, {
    fields: [activities.username],
    references: [users.username],
  }),
}));
