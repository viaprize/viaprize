import { Viaprize } from '@viaprize/core/viaprize'

export const viaprize = new Viaprize({
  config: {
    databaseUrl: process.env.DATABASE_URL ?? '',
    inMemoryDb: false,
    mode: 'development',
    wallet: {
      walletPaymentInfraUrl:
        'https://49yjt1y4yg.execute-api.us-west-1.amazonaws.com',
      walletApiKey: process.env.WALLET_API_KEY ?? '',
      rpcUrl: process.env.RPC_URL ?? '',
    },
    chainId: Number.parseInt(process.env.CHAIN_ID ?? '10'),
  },
})
