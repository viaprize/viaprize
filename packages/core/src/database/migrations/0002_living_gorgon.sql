ALTER TABLE "activities" ALTER COLUMN "username" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "activities" ALTER COLUMN "createdAt" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "submissions" ADD COLUMN "projectLink" text;