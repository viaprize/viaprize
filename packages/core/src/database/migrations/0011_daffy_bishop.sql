CREATE TABLE IF NOT EXISTS "votes" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"submissionHash" varchar NOT NULL,
	"prizeId" varchar NOT NULL,
	"funderAddress" text NOT NULL,
	"voteAmount" text NOT NULL,
	"username" varchar NOT NULL,
	"createdAt" timestamp with time zone,
	"updatedAt" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "prizes" ALTER COLUMN "totalFunds" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "prizes" ALTER COLUMN "numberOfContestants" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "prizes" ALTER COLUMN "numberOfFunders" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "prizes" ALTER COLUMN "numberOfComments" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "prizes" ALTER COLUMN "numberOfSubmissions" SET NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "votes" ADD CONSTRAINT "votes_submissionHash_submissions_id_fk" FOREIGN KEY ("submissionHash") REFERENCES "public"."submissions"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "votes" ADD CONSTRAINT "votes_prizeId_submissions_prizeId_fk" FOREIGN KEY ("prizeId") REFERENCES "public"."submissions"("prizeId") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "votes" ADD CONSTRAINT "votes_username_user_username_fk" FOREIGN KEY ("username") REFERENCES "public"."user"("username") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
