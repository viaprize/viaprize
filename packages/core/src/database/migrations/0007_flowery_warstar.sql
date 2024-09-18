ALTER TABLE "prizes" DROP CONSTRAINT "prizes_author_user_username_fk";
--> statement-breakpoint
ALTER TABLE "prizes" ADD COLUMN "title" text NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "prizes" ADD CONSTRAINT "prizes_author_user_username_fk" FOREIGN KEY ("author") REFERENCES "public"."user"("username") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
