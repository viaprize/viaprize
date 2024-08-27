import { ViaprizeConfig, viaprizeConfigSchema } from "./config";

export class Viaprize {
  config: ViaprizeConfig;
  constructor({ config }: { config: ViaprizeConfig }) {
    this.config = viaprizeConfigSchema.parse(config);
  }
}