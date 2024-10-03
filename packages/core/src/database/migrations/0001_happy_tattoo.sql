CREATE TABLE IF NOT EXISTS "activities" (
	"id" varchar PRIMARY KEY NOT NULL,
	"username" varchar,
	"activity" text NOT NULL,
	"tag" text DEFAULT 'PRIZE' NOT NULL,
	"createdAt" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "prizes" ALTER COLUMN "totalRefunded" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "prizes" ALTER COLUMN "totalWithdrawn" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "totalFundsWon" numeric DEFAULT '0';--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "activities" ADD CONSTRAINT "activities_username_user_username_fk" FOREIGN KEY ("username") REFERENCES "public"."user"("username") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
