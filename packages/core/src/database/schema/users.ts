import { relations } from "drizzle-orm";
import {
  boolean,
  pgTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";
import { prizeProposals } from "./prize-proposals";
import { prizes } from "./prizes";
import { submissions } from "./submissions";
import { wallets } from "./wallets";

export const users = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$default(() => nanoid(12)),
  email: text("email").unique(),
  authId: varchar("authId").unique(),
  username: varchar("username").unique(),
  fullName: varchar("fullName"),
  isAdmin: boolean("isAdmin").default(false),
  bio: text("bio").default(""),
  avatar: text("avatar"),
  skillSets: text("skillSets").array(),
  priorities: text("priorities").array(),
  updatedAt: timestamp("updatedAt", {
    mode: "date",
    withTimezone: true,
  }).$onUpdate(() => new Date()),
  createdAt: timestamp("createdAt", {
    mode: "date",
    withTimezone: true,
  }).$default(() => new Date()),
});

export const usersRelations = relations(users, ({ many }) => ({
  wallets: many(wallets),
  prizes: many(prizes),
  prizeProposals: many(prizeProposals),
  prizeComments: many(users),
  submission: many(submissions),
}));
