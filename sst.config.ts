/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "viaprize",
      removal:
        input?.stage === "production" || input.stage === "dev"
          ? "retain"
          : "remove",
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

    const eventBus = await import("./infra/events");

    const storage = await import("./infra/storage");

    const indexer = await import("./infra/indexer");

    const vpc = await import("./infra/vpc");

    const cache = await import("./infra/cache");

    return {
      website: website.website.url,
      imageBucket: storage.imageBucket.name,
      eventBus: eventBus.eventBus.name,

      vpcId: vpc.vpc.id,
      vpcUrn: vpc.vpc.urn,
      indexerClusterId: indexer.indexerCluster.urn,
      indexerUrl: indexer.indexerCluster.nodes.cluster.urn,
      cacheTable: cache.cacheTable.name,
      cacheTableArn: cache.cacheTable.arn,
    };
  },
});
