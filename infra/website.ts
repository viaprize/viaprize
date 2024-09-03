import {
  AUTH_GITHUB_ID,
  AUTH_GITHUB_SECRET,
  AUTH_GOOGLE_ID,
  AUTH_GOOGLE_SECRET,
  AUTH_RESEND_KEY,
  AUTH_SECRET,
  DATABASE_URL,
} from './secrets'

export const website = new sst.aws.Nextjs('website', {
  path: './packages/website',
  link: [
    AUTH_SECRET,
    DATABASE_URL,
    AUTH_GITHUB_ID,
    AUTH_GITHUB_SECRET,
    AUTH_GOOGLE_ID,
    AUTH_GOOGLE_SECRET,
    AUTH_RESEND_KEY,
  ],
  environment: {
    AUTH_SECRET: AUTH_SECRET.value,
    DATABASE_URL: DATABASE_URL.value,
    AUTH_GITHUB_ID: AUTH_GITHUB_ID.value,
    AUTH_GITHUB_SECRET: AUTH_GITHUB_SECRET.value,
    AUTH_GOOGLE_ID: AUTH_GOOGLE_ID.value,
    AUTH_GOOGLE_SECRET: AUTH_GOOGLE_SECRET.value,
    AUTH_RESEND_KEY: AUTH_RESEND_KEY.value,
  },
})
