import { eq } from "drizzle-orm";
import type { ViaprizeDatabase } from "../database";
import { indexerEvents } from "../database/schema";

export class IndexerEvents {
  db;
  constructor(viaprizeDb: ViaprizeDatabase) {
    this.db = viaprizeDb.database;
  }
  async getEventById(id: string) {
    return await this.db.query.indexerEvents.findFirst({
      where: eq(indexerEvents.eventId, id),
    });
  }
  async createEvent(id: string) {
    return await this.db.insert(indexerEvents).values({
      eventId: id,
    });
  }
}
