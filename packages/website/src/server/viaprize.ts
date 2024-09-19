import { env } from '@/env'
import { Viaprize } from '@viaprize/core/viaprize'
export const viaprize = new Viaprize({
  config: {
    databaseUrl: env.DATABASE_URL,
    inMemoryDb: false,
    mode: 'development',
    wallet: {
      walletPaymentInfraUrl: env.WALLET_PAYMENT_INFRA_API,
      walletApiKey: env.WALLET_API_KEY,
      rpcUrl: env.RPC_URL,
    },
    chainId: Number.parseInt(env.CHAIN_ID),
  },
})
