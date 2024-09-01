import { type ViaprizeConfig, viaprizeConfigSchema } from './config'
import { ViaprizeDatabase } from './database'
import { Donations } from './lib/donations'

export class Viaprize {
  config: ViaprizeConfig
  donations: Donations

  constructor({ config }: { config: ViaprizeConfig }) {
    this.config = viaprizeConfigSchema.parse(config)
    const database = new ViaprizeDatabase({
      databaseUrl: this.config.databaseUrl,
    })
    this.donations = new Donations(database)
  }
}
