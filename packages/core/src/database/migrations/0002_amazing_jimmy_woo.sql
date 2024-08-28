-- Custom SQL migration file, put your code below! --
DO $$ BEGIN
  CREATE MATERIALIZED VIEW prize_donations_view AS
  SELECT * FROM "public"."donations" WHERE "public"."donations"."recipientType" = 'PRIZE';
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE MATERIALIZED VIEW fundraiser_donations_view AS
  SELECT * FROM "public"."donations" WHERE "public"."donations"."recipientType" = 'FUNDRAISER';
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE MATERIALIZED VIEW gitcoin_donations_view AS
  SELECT * FROM "public"."donations" WHERE "public"."donations"."recipientType" = 'GITCOIN';
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;
