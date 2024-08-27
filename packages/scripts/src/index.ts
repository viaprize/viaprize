import { ViaprizeDatabase } from "@viaprize/core/database";
import { Viaprize } from "@viaprize/core/index";

const viaprize = new Viaprize({
  config: {
    mode: "development",
    databaseUrl: "postgresql://viaprize-dev_owner:gEPU4ZfQom7L@ep-blue-moon-a1srlo7i.ap-southeast-1.aws.neon.tech/v3-viaprize?sslmode=require",
  },
});


ViaprizeDatabase.migrate(viaprize.config.databaseUrl).then(() => {
  console.log("Migration complete");
})