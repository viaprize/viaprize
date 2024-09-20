import { pgTable, text } from "drizzle-orm/pg-core";

export const indexerEvents = pgTable("indexer-events", {
  eventId: text("eventId").primaryKey(),
});
