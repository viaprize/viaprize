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
    NEXT_PUBLIC_WEB3_STORAGE: z.string(),
    NEXT_PUBLIC_PRIVY_APP_ID: z.string(),
    NEXT_PUBLIC_BACKEND_URL: z
      .enum(['https://api-prod.pactsmith.com/api', 'https://api.pactsmith.com/api'])
      .default('https://api.pactsmith.com/api'),
  },
  /*
   * Due to how Next.js bundles environment variables on Edge and Client,
   * we need to manually destructure them to make sure all are included in bundle.
   *
   * 💡 You'll get type errors if not all variables from `server` & `client` are included here.
   */
  runtimeEnv: {
    NEXT_PUBLIC_CHAIN: process.env.NEXT_PUBLIC_CHAIN,
    NEXT_PUBLIC_NETWORK_TYPE: process.env.NEXT_PUBLIC_NETWORK_TYPE,
    NEXT_PUBLIC_WEB3_STORAGE: process.env.NEXT_PUBLIC_WEB3_STORAGE,
    NEXT_PUBLIC_PRIVY_APP_ID: process.env.NEXT_PUBLIC_PRIVY_APP_ID,
    NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL,
  },
});
