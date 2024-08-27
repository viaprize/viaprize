import { boolean, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const users = pgTable('users',{
    id: uuid("id").primaryKey(),
    email: text("email").unique(),
    authId: varchar("authId").unique(),
    username: varchar("username").unique(),
    isAdmin: boolean("isAdmin").default(false),
    bio: text("bio").default(""),
    avatar: text("avatar"),
    skillset: text("skillset").array(),
    priorities: text("priorities").array(),
    walletAddress: text("walletAddress").array(),
    updatedAt: timestamp('updatedAt', { mode: 'date'}).$onUpdate(() => new Date()),
    createdAt: timestamp('createdAt', { mode: 'date'}).$default(() => new Date())
})