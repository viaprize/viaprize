import { eq } from "drizzle-orm";
import type { z } from "zod";
import type { ViaprizeDatabase } from "../database";
import { type insertUserSchema, users, wallets } from "../database/schema";
import { Wallet } from "./wallet";

export class Users {
  db;
  wallet;
  constructor(viaprizeDb: ViaprizeDatabase, wallet: Wallet) {
    this.db = viaprizeDb.database;
    this.wallet = wallet;
  }
  async updateUserById(id: string, data: z.infer<typeof insertUserSchema>) {
    await this.db
      .update(users)
      .set(data as any)
      .where(eq(users.id, id));
  }
  async getUserNameById(id: string) {
    return (
      await this.db.query.users.findFirst({
        columns: {
          username: true,
        },
        where: eq(users.id, id),
      })
    )?.username;
  }

  async onboardUser(data: {
    name: string;
    email: string;
    walletAddress?: string;
    network: string;
    username: string;
  }) {
    let address = data.walletAddress;
    let key: string;
    if (!data.walletAddress) {
      const wallet = await this.wallet.generateWallet();
      address = wallet.address;
      key = wallet.key;
    }
    if (!address) {
      throw new Error("Address is required either not generated");
    }
    await this.db.transaction(async (tx) => {
      await tx.update(users).set({
        name: data.name,
        email: data.email,
        username: data.username,
      });
      await tx.insert(wallets).values({
        address: address,
        network: data.network,
        key: key,
        username: data.username,
      });
    });

    return true;
  }
}
