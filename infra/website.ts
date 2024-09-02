import { AUTH_SECRET } from './secrets'

export const website = new sst.aws.Nextjs('website', {
  path: './packages/website',
  link: [AUTH_SECRET],
  environment: {
    AUTH_SECRET: AUTH_SECRET.value,
  },
})
