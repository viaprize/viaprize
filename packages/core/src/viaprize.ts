import { type ViaprizeConfig, viaprizeConfigSchema } from "./config";
import { ViaprizeDatabase } from "./database";
import { Donations } from "./lib/donations";
import { Prizes } from "./lib/prizes";
import { Users } from "./lib/users";
import { Wallet } from "./lib/wallet";

export class Viaprize {
  config: ViaprizeConfig;
  donations: Donations;
  prizes: Prizes;
  users: Users;
  database: ViaprizeDatabase;

  wallet: Wallet;

  constructor({ config }: { config: ViaprizeConfig }) {
    this.config = viaprizeConfigSchema.parse(config);
    this.database = new ViaprizeDatabase({
      databaseUrl: this.config.databaseUrl,
    });
    this.wallet = new Wallet(this.config.walletPaymentInfraUrl);
    this.donations = new Donations(this.database);
    this.users = new Users(this.database, this.wallet);
    this.prizes = new Prizes(this.database);
  }
}
