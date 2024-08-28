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
    console.log({ donations });
  }

  async addDonation(insertDonation: z.infer<typeof insertDonationSchema>) {
    const donation = await this.db
      .insert(donations)
      .values(insertDonation)
      .execute();
    return donation;
  }
}
