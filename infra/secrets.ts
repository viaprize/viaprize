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
