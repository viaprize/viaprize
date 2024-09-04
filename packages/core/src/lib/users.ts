import { eq } from "drizzle-orm";
import type { z } from "zod";
import type { ViaprizeDatabase } from "../database";
import { type insertUserSchema, users } from "../database/schema";

export class Users {
  db;
  constructor(viaprizeDb: ViaprizeDatabase) {
    this.db = viaprizeDb.database;
  }
  async updateUserById(id: string, data: z.infer<typeof insertUserSchema>) {
    await this.db
      .update(users)
      .set(data as any)
      .where(eq(users.id, id));
  }
}
