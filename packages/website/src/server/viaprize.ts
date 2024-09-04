import { env } from "@/env";
import { Viaprize } from "@viaprize/core/viaprize";
export const viaprize = new Viaprize({
  config: {
    databaseUrl: env.DATABASE_URL,
    inMemoryDb: false,
    mode: "development",
    walletPaymentInfraUrl: env.WALLET_PAYMENT_INFRA_API,
  },
});
