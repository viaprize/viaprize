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
          region: "us-east-2",
        },
      },
    };
  },
  async run() {
    const website = await import("./infra/website");
    const scheduler = await import("./infra/scheduler");
    const eventBus = await import("./infra/events");
    const storage = await import("./infra/storage");

    return {
      website: website.website.url,
      imageBucket: storage.imageBucket.name,
      eventBus: eventBus.eventBus.name,
      schedulerRoleArn: scheduler.schedulerRole.arn,
    };
  },
});
