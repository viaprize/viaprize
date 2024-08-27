CREATE TABLE IF NOT EXISTS "users" (
	"id" uuid PRIMARY KEY NOT NULL,
	"email" text,
	"authId" varchar,
	"username" varchar,
	"isAdmin" boolean DEFAULT false,
	"bio" text DEFAULT '',
	"avatar" text,
	"skillset" text[],
	"priorities" text[],
	"walletAddress" text[],
	"updatedAt" timestamp,
	"createdAt" timestamp,
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_authId_unique" UNIQUE("authId"),
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
