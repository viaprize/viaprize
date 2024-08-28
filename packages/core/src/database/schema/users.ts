import { relations } from "drizzle-orm";
import {
  boolean,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { prizeProposals } from "./prize-proposals";
import { prizes } from "./prizes";
import { wallets } from "./wallets";

export const users = pgTable("users", {
  id: uuid("id").primaryKey(),
  email: text("email").unique(),
  authId: varchar("authId").unique(),
  username: varchar("username").unique(),
  fullName: varchar("fullName"),
  isAdmin: boolean("isAdmin").default(false),
  bio: text("bio").default(""),
  avatar: text("avatar"),
  skillsets: text("skillset").array(),
  priorities: text("priorities").array(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).$onUpdate(
    () => new Date()
  ),
  createdAt: timestamp("createdAt", { mode: "date" }).$default(
    () => new Date()
  ),
});

export const usersRelations = relations(users, ({ many }) => ({
  wallets: many(wallets),

  prizes: many(prizes),
  prizeProposals: many(prizeProposals),
  prizeComments: many(users),
}));
