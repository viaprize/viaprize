DO $$ BEGIN
 CREATE TYPE "public"."donationTokenTypeEnum" AS ENUM('TOKEN', 'NFT');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."donationTypeEnum" AS ENUM('PAYMENT', 'GIFT');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."recipientTypeEnum" AS ENUM('PRIZE', 'FUNDRAISER', 'GITCOIN', 'UNKNOWN');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."prizeProposalStage" AS ENUM('PENDING', 'APPROVED', 'REJECTED');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."prizeStage" AS ENUM('NOT_STARTED', 'SUBMISSIONS_OPEN', 'VOTING_OPEN', 'DISPUTE_AVAILABLE', 'DISPUTE_ACTIVE', 'WON', 'REFUNDED');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "account" (
	"userId" text NOT NULL,
	"type" text NOT NULL,
	"provider" text NOT NULL,
	"providerAccountId" text NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" text,
	"scope" text,
	"id_token" text,
	"session_state" text,
	CONSTRAINT "account_provider_providerAccountId_pk" PRIMARY KEY("provider","providerAccountId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "authenticator" (
	"credentialID" text NOT NULL,
	"userId" text NOT NULL,
	"providerAccountId" text NOT NULL,
	"credentialPublicKey" text NOT NULL,
	"counter" integer NOT NULL,
	"credentialDeviceType" text NOT NULL,
	"credentialBackedUp" boolean NOT NULL,
	"transports" text,
	CONSTRAINT "authenticator_userId_credentialID_pk" PRIMARY KEY("userId","credentialID"),
	CONSTRAINT "authenticator_credentialID_unique" UNIQUE("credentialID")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "donations" (
	"id" serial PRIMARY KEY NOT NULL,
	"amount" numeric DEFAULT '0' NOT NULL,
	"token" varchar NOT NULL,
	"decimals" integer DEFAULT 6 NOT NULL,
	"tokenType" "donationTokenTypeEnum" DEFAULT 'TOKEN' NOT NULL,
	"type" "donationTypeEnum" DEFAULT 'PAYMENT' NOT NULL,
	"donor" varchar NOT NULL,
	"recipient" varchar NOT NULL,
	"recipientType" "recipientTypeEnum" DEFAULT 'UNKNOWN' NOT NULL,
	"transactionId" varchar,
	"paymentId" varchar,
	"isFiat" boolean DEFAULT false NOT NULL,
	"isRefunded" boolean DEFAULT false NOT NULL,
	"isPartiallyRefunded" boolean DEFAULT false NOT NULL,
	"totalRefunded" numeric DEFAULT '0' NOT NULL,
	"username" varchar,
	"createdAt" timestamp with time zone,
	"updatedAt" timestamp with time zone,
	CONSTRAINT "donations_paymentId_unique" UNIQUE("paymentId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "prize_comments" (
	"id" varchar PRIMARY KEY NOT NULL,
	"prizeId" varchar NOT NULL,
	"username" varchar NOT NULL,
	"comment" text NOT NULL,
	"createdAt" timestamp with time zone,
	"updatedAt" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "prize_proposals" (
	"id" varchar PRIMARY KEY NOT NULL,
	"slug" varchar,
	"description" text NOT NULL,
	"startVotingDate" timestamp with time zone NOT NULL,
	"startSubmissionDate" timestamp with time zone NOT NULL,
	"submissionDurationInMinutes" integer NOT NULL,
	"votingDurationInMinutes" integer NOT NULL,
	"judgesAddresses" text[],
	"skillSets" text[],
	"priorities" text[],
	"imageUrl" varchar,
	"author" varchar NOT NULL,
	CONSTRAINT "prize_proposals_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "prizes" (
	"id" varchar PRIMARY KEY NOT NULL,
	"slug" varchar,
	"description" text NOT NULL,
	"startVotingDate" timestamp with time zone NOT NULL,
	"startSubmissionDate" timestamp with time zone NOT NULL,
	"submissionDurationInMinutes" integer NOT NULL,
	"votingDurationInMinutes" integer NOT NULL,
	"primaryContractAddress" text NOT NULL,
	"judgesAddresses" json,
	"skillSets" json,
	"priorities" text[],
	"imageUrl" varchar,
	"proposerFeePercentage" integer DEFAULT 5,
	"platformFeePercentage" integer DEFAULT 5,
	"contractVersion" integer DEFAULT 201,
	"totalFunds" integer DEFAULT 0,
	"totalRefunded" integer DEFAULT 0,
	"totalWithdrawn" integer DEFAULT 0,
	"prizeStage" "prizeStage" DEFAULT 'NOT_STARTED',
	"proposalStage" "prizeProposalStage" DEFAULT 'PENDING',
	"proposerAddress" text NOT NULL,
	"createdAt" timestamp with time zone,
	"updatedAt" timestamp with time zone,
	"author" varchar NOT NULL,
	CONSTRAINT "prizes_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "prizes_to_contestants" (
	"username" varchar NOT NULL,
	"prizeId" varchar NOT NULL,
	CONSTRAINT "prizes_to_contestants_username_prizeId_pk" PRIMARY KEY("username","prizeId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "submissions" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"description" text NOT NULL,
	"submitterAddress" text NOT NULL,
	"prizeId" varchar,
	"username" varchar,
	"createdAt" timestamp with time zone,
	"updatedAt" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text,
	"authId" varchar,
	"username" varchar,
	"fullName" varchar,
	"isAdmin" boolean DEFAULT false,
	"bio" text DEFAULT '',
	"avatar" text,
	"skillSets" text[],
	"priorities" text[],
	"updatedAt" timestamp with time zone,
	"createdAt" timestamp with time zone,
	CONSTRAINT "user_email_unique" UNIQUE("email"),
	CONSTRAINT "user_authId_unique" UNIQUE("authId"),
	CONSTRAINT "user_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "wallets" (
	"address" text PRIMARY KEY NOT NULL,
	"network" text NOT NULL,
	"key" text,
	"metadata" json,
	"username" varchar,
	"prizeId" varchar,
	"createdAt" timestamp with time zone,
	"updatedAt" timestamp with time zone
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "account" ADD CONSTRAINT "account_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "authenticator" ADD CONSTRAINT "authenticator_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "donations" ADD CONSTRAINT "donations_username_user_username_fk" FOREIGN KEY ("username") REFERENCES "public"."user"("username") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "prize_comments" ADD CONSTRAINT "prize_comments_prizeId_prizes_id_fk" FOREIGN KEY ("prizeId") REFERENCES "public"."prizes"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "prize_comments" ADD CONSTRAINT "prize_comments_username_user_username_fk" FOREIGN KEY ("username") REFERENCES "public"."user"("username") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "prize_proposals" ADD CONSTRAINT "prize_proposals_author_user_username_fk" FOREIGN KEY ("author") REFERENCES "public"."user"("username") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "prizes" ADD CONSTRAINT "prizes_author_user_username_fk" FOREIGN KEY ("author") REFERENCES "public"."user"("username") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "prizes_to_contestants" ADD CONSTRAINT "prizes_to_contestants_username_user_username_fk" FOREIGN KEY ("username") REFERENCES "public"."user"("username") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "prizes_to_contestants" ADD CONSTRAINT "prizes_to_contestants_prizeId_prizes_id_fk" FOREIGN KEY ("prizeId") REFERENCES "public"."prizes"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "submissions" ADD CONSTRAINT "submissions_prizeId_prizes_id_fk" FOREIGN KEY ("prizeId") REFERENCES "public"."prizes"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "submissions" ADD CONSTRAINT "submissions_username_user_username_fk" FOREIGN KEY ("username") REFERENCES "public"."user"("username") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "wallets" ADD CONSTRAINT "wallets_username_user_username_fk" FOREIGN KEY ("username") REFERENCES "public"."user"("username") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "wallets" ADD CONSTRAINT "wallets_prizeId_prizes_id_fk" FOREIGN KEY ("prizeId") REFERENCES "public"."prizes"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
