import { Viaprize } from "@viaprize/core/index";

const viaprize = new Viaprize({
  config: {
    mode: "development",
    databaseUrl: "mongodb://localhost:27017/viaprize",
  },
});
