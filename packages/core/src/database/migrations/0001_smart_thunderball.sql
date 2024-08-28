ALTER TABLE "prize_comments" DROP CONSTRAINT "prize_comments_prizeId_prizes_id_fk";
--> statement-breakpoint
ALTER TABLE "prize_comments" DROP CONSTRAINT "prize_comments_username_users_username_fk";
--> statement-breakpoint
ALTER TABLE "prize_proposals" DROP CONSTRAINT "prize_proposals_author_users_username_fk";
--> statement-breakpoint
ALTER TABLE "prizes" DROP CONSTRAINT "prizes_author_users_username_fk";
--> statement-breakpoint
ALTER TABLE "prizes_to_contestants" DROP CONSTRAINT "prizes_to_contestants_username_users_username_fk";
--> statement-breakpoint
ALTER TABLE "prizes_to_contestants" DROP CONSTRAINT "prizes_to_contestants_prizeId_prizes_id_fk";
--> statement-breakpoint
ALTER TABLE "submissions" DROP CONSTRAINT "submissions_username_users_username_fk";
--> statement-breakpoint
ALTER TABLE "prizes" ALTER COLUMN "createdAt" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "prizes" ALTER COLUMN "updatedAt" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "updatedAt" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "createdAt" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "wallets" ALTER COLUMN "updatedAt" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "wallets" ALTER COLUMN "createdAt" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "prize_comments" ADD CONSTRAINT "prize_comments_prizeId_prizes_id_fk" FOREIGN KEY ("prizeId") REFERENCES "public"."prizes"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "prize_comments" ADD CONSTRAINT "prize_comments_username_users_username_fk" FOREIGN KEY ("username") REFERENCES "public"."users"("username") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "prize_proposals" ADD CONSTRAINT "prize_proposals_author_users_username_fk" FOREIGN KEY ("author") REFERENCES "public"."users"("username") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "prizes" ADD CONSTRAINT "prizes_author_users_username_fk" FOREIGN KEY ("author") REFERENCES "public"."users"("username") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "prizes_to_contestants" ADD CONSTRAINT "prizes_to_contestants_username_users_username_fk" FOREIGN KEY ("username") REFERENCES "public"."users"("username") ON DELETE cascade ON UPDATE no action;
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
 ALTER TABLE "submissions" ADD CONSTRAINT "submissions_username_users_username_fk" FOREIGN KEY ("username") REFERENCES "public"."users"("username") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
