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
 CREATE TYPE "public"."prize" AS ENUM('not started', 'submissions open', 'voting open', 'dispute available', 'dispute active', 'won', 'refunded');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
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
	"createdAt" timestamp,
	"updatedAt" timestamp,
	CONSTRAINT "donations_paymentId_unique" UNIQUE("paymentId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "prize_comments" (
	"id" varchar PRIMARY KEY NOT NULL,
	"prizeId" varchar NOT NULL,
	"username" varchar NOT NULL,
	"comment" text NOT NULL
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
	"skillsets" text[],
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
	"judgesAddresses" text[],
	"skillsets" text[],
	"priorities" text[],
	"imageUrl" varchar,
	"propserFeePercentage" integer DEFAULT 5,
	"platformFeePercentage" integer DEFAULT 5,
	"contractVersion" integer DEFAULT 201,
	"totalFunds" integer DEFAULT 0,
	"totalRefunded" integer DEFAULT 0,
	"totalWithdrawn" integer DEFAULT 0,
	"stage" "prize" DEFAULT 'not started',
	"proposerAddress" text NOT NULL,
	"createdAt" timestamp,
	"updatedAt" timestamp,
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
	"createdAt" timestamp,
	"updatedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "wallets" (
	"address" text PRIMARY KEY NOT NULL,
	"network" text NOT NULL,
	"key" text,
	"metadata" json,
	"updatedAt" timestamp,
	"username" varchar,
	"prizeId" varchar,
	"createdAt" timestamp
);
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "fullName" varchar;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "prize_proposals" ADD CONSTRAINT "prize_proposals_author_users_username_fk" FOREIGN KEY ("author") REFERENCES "public"."users"("username") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "prizes" ADD CONSTRAINT "prizes_author_users_username_fk" FOREIGN KEY ("author") REFERENCES "public"."users"("username") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "prizes_to_contestants" ADD CONSTRAINT "prizes_to_contestants_username_users_username_fk" FOREIGN KEY ("username") REFERENCES "public"."users"("username") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "prizes_to_contestants" ADD CONSTRAINT "prizes_to_contestants_prizeId_prizes_id_fk" FOREIGN KEY ("prizeId") REFERENCES "public"."prizes"("id") ON DELETE no action ON UPDATE no action;
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
 ALTER TABLE "wallets" ADD CONSTRAINT "wallets_username_users_username_fk" FOREIGN KEY ("username") REFERENCES "public"."users"("username") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "wallets" ADD CONSTRAINT "wallets_prizeId_prizes_id_fk" FOREIGN KEY ("prizeId") REFERENCES "public"."prizes"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN IF EXISTS "walletAddress";