import { type ViaprizeConfig, viaprizeConfigSchema } from './config'
import { ViaprizeDatabase } from './database'
import { Donations } from './lib/donations'

export class Viaprize {
  config: ViaprizeConfig
  donations: Donations
  database: ViaprizeDatabase

  constructor({ config }: { config: ViaprizeConfig }) {
    this.config = viaprizeConfigSchema.parse(config)
    this.database = new ViaprizeDatabase({
      databaseUrl: this.config.databaseUrl,
    })
    this.donations = new Donations(this.database)
  }
}
