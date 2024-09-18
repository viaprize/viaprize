import "dotenv/config";
export const AUTH_SECRET = new sst.Secret(
  "AuthSecret",
  process.env.AUTH_SECRET
);

export const DATABASE_URL = new sst.Secret(
  "DatabaseUrl",
  process.env.DATABASE_URL
);
export const AUTH_GITHUB_ID = new sst.Secret(
  "AuthGithubId",
  process.env.AUTH_GITHUB_ID
);
export const AUTH_GITHUB_SECRET = new sst.Secret(
  "AuthGithubSecret",
  process.env.AUTH_GITHUB_SECRET
);
export const AUTH_GOOGLE_ID = new sst.Secret(
  "AuthGoogleId",
  process.env.AUTH_GOOGLE_ID
);
export const AUTH_GOOGLE_SECRET = new sst.Secret(
  "AuthGoogleSecret",
  process.env.AUTH_GOOGLE_SECRET
);
export const AUTH_RESEND_KEY = new sst.Secret(
  "AuthResendKey",
  process.env.AUTH_RESEND_KEY
);

export const WALLET_PAYMENT_INFRA_API = new sst.Secret(
  "WalletPaymentInfraApi",
  process.env.WALLET_PAYMENT_INFRA_API
);

export const AUTH_TRUST_HOST = new sst.Secret(
  "AuthTrustHost",
  process.env.AUTH_TRUST_HOST
);

export const NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID = new sst.Secret(
  "NextPublicWalletConnectProjectId",
  process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID
);

export const CHAIN_ID = new sst.Secret("ChainId", process.env.CHAIN_ID);

export const RPC_URL = new sst.Secret("RpcUrl", process.env.RPC_URL);

export const WALLET_API_KEY = new sst.Secret(
  "WalletApiKey",
  process.env.WALLET_API_KEY
);

export const INDEXER_RPC_URL = new sst.Secret(
  "IndexerRpcUrl",
  process.env.INDEXER_RPC_URL
);
