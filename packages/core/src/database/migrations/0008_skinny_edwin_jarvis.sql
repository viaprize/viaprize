ALTER TYPE "prizeProposalStage" ADD VALUE 'APPROVED_BUT_NOT_DEPLOYED';--> statement-breakpoint
ALTER TABLE "prizes" ALTER COLUMN "proposerFeePercentage" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "prizes" ALTER COLUMN "platformFeePercentage" SET NOT NULL;