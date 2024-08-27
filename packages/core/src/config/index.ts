import { z } from "zod";
export const viaprizeConfigSchema = z.object({
  databaseUrl: z.string(),
  inMemoryDb: z.boolean().default(false),
  mode: z.enum(["development", "production"]).default("development"),
});

export type ViaprizeConfig = z.infer<typeof viaprizeConfigSchema>;
