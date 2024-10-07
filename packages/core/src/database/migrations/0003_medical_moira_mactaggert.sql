ALTER TABLE "prizes" ALTER COLUMN "judgesAddresses" SET DEFAULT '[]'::json;--> statement-breakpoint
ALTER TABLE "prizes" ALTER COLUMN "skillSets" SET DEFAULT '[]'::json;--> statement-breakpoint
ALTER TABLE "prizes" ALTER COLUMN "totalFunds" SET DATA TYPE numeric;--> statement-breakpoint
ALTER TABLE "submissions" ALTER COLUMN "prizeId" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "submissions" ALTER COLUMN "username" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "submissions" ALTER COLUMN "createdAt" SET NOT NULL;