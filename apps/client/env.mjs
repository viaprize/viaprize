// src/env.mjs
import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  /*
   * Serverside Environment variables, not available on the client.
   * Will throw if you access these variables on the client.
   */
  /*
   * Environment variables available on the client (and server).
   *
   * 💡 You'll get type errors if these are not prefixed with NEXT_PUBLIC_.
   */
  client: {
    NEXT_PUBLIC_CHAIN: z.string(),
    NEXT_PUBLIC_NETWORK_TYPE: z
      .enum(['mainnet', 'testnet'])
      .default('mainnet')
      .optional(),
    NEXT_PUBLIC_PRIVY_APP_ID: z.string(),
    NEXT_PUBLIC_BACKEND_URL: z
      .enum([
        'https://prod-api.viaprize.org/api',
        'http://localhost:3001/api',
        'https://api-dev.viaprize.org/api',
        'http://127.0.0.1:3001/api',
        'https://prod-api.viaprize.org/api',
      ])
      .default('http://localhost:3001/api'),
    NEXT_PUBLIC_SUPABASE_URL: z.string(),
    NEXT_PUBLIC_SUPABASE_API_KEY: z.string(),
    NEXT_PUBLIC_RPC_URL: z.string(),
    NEXT_PUBLIC_BREVO_NEWSLETTER_URL: z.string().url(),
    NEXT_PUBLIC_GITCOIN_GRAPHQL: z.string().url(),
  },
  /*
   * Due to how Next.js bundles enironment variables on Edge and Client,
   * we need to manually destructure them to make sure all are included in bundle.
   *
   * 💡 You'll get type errors if not all variables from `server` & `client` are included here.
   */
  runtimeEnv: {
    NEXT_PUBLIC_GITCOIN_GRAPHQL: process.env.NEXT_PUBLIC_GITCOIN_GRAPHQL,
    NEXT_PUBLIC_CHAIN: process.env.NEXT_PUBLIC_CHAIN,
    NEXT_PUBLIC_NETWORK_TYPE: process.env.NEXT_PUBLIC_NETWORK_TYPE,
    NEXT_PUBLIC_PRIVY_APP_ID: process.env.NEXT_PUBLIC_PRIVY_APP_ID,
    NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_API_KEY: process.env.NEXT_PUBLIC_SUPABASE_API_KEY,
    NEXT_PUBLIC_RPC_URL: process.env.NEXT_PUBLIC_RPC_URL,
    NEXT_PUBLIC_BREVO_NEWSLETTER_URL: process.env.NEXT_PUBLIC_BREVO_NEWSLETTER_URL,
  },
});
