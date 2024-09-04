import { z } from "zod";

export const viaprizeConfigSchema = z.object({
  databaseUrl: z.string().url("Invalid database URL"),
  inMemoryDb: z.boolean().default(false),
  mode: z.enum(["development", "production"]).default("development"),
  walletPaymentInfraUrl: z.string().url("Invalid wallet payment infra URL"),
});

export type ViaprizeConfig = z.infer<typeof viaprizeConfigSchema>;
