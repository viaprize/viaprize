/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "viaprize",
      removal: input?.stage === "production" ? "retain" : "remove",
      home: "aws",
      providers: {
        aws: {
          profile:
            input.stage === "production"
              ? "viaprize-production"
              : "viaprize-dev",
        },
      },
    };
  },
  async run() {
    const api = await import("./infra/api");
    // const web = new sst.aws.Nextjs("website-application", {
    //   path: "packages/web",
    // });

    return {
      api: api.myApi.url,
    };
  },
});
