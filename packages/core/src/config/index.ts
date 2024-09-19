import { z } from 'zod'

export const viaprizeConfigSchema = z.object({
  databaseUrl: z.string().url('Invalid database URL'),
  inMemoryDb: z.boolean().default(false),
  mode: z.enum(['development', 'production']).default('development'),
  wallet: z.object({
    walletPaymentInfraUrl: z.string().url('Invalid wallet payment infra URL'),
    walletApiKey: z.string(),
    rpcUrl: z.string().url('Invalid RPC URL'),
  }),
  chainId: z.number().int().positive(),
})

export type ViaprizeConfig = z.infer<typeof viaprizeConfigSchema>
