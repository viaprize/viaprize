import { count, eq } from "drizzle-orm";
import { z } from "zod";
import { ViaprizeDatabase } from "../database";
import {
  donations,
  insertDonationSchema,
  prizeDonationsView,
} from "../database/schema";

export class Donations {
  db;
  constructor(viaprizeDb: ViaprizeDatabase) {
    this.db = viaprizeDb.database;
  }
  async getDonationsByPrize() {
    const donations = await this.db.select().from(prizeDonationsView).execute();
    return donations;
  }

  async getDonationByTransactionId(transactionId: string) {
    const donation = await this.db.query.donations.findFirst({
      where: eq(donations.transactionId, transactionId),
    });
    return donation;
  }

  async addDonation(insertDonation: z.infer<typeof insertDonationSchema>) {
    const donation = await this.db
      .insert(donations)
      .values(insertDonation)
      .execute();
    return donation;
  }

  async count() {
    const lenght = (
      await this.db.select({ count: count() }).from(donations).execute()
    )[0];
    return lenght.count;
  }
}
