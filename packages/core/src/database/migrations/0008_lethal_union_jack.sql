ALTER TABLE "donations" ADD COLUMN "prizeId" varchar;--> statement-breakpoint
ALTER TABLE "submissions" ADD COLUMN "won" real DEFAULT 0 NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "donations" ADD CONSTRAINT "donations_prizeId_prizes_id_fk" FOREIGN KEY ("prizeId") REFERENCES "public"."prizes"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "donations" ADD CONSTRAINT "donations_transactionId_unique" UNIQUE("transactionId");