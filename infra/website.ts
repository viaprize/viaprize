import { AUTH_SECRET } from "./secrets";

const website = new sst.aws.Nextjs("website", {
  path: "../packages/website",
  link: [AUTH_SECRET],
  environment: {
    AUTH_SECRET: AUTH_SECRET.value,
  },
  domain: {
    name: "v3-dev.viaprize.org",
    dns: sst.aws.dns({
      zone: "Z073535817P80GK72VHJB",
    }),
  },
});
