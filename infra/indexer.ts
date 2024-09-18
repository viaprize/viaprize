import { eventBus } from "./events";
import { CHAIN_ID, INDEXER_RPC_URL } from "./secrets";
import { vpc } from "./vpc";

export const indexerCluster = new sst.aws.Cluster("IndexerCluster", {
  vpc: vpc,
});

indexerCluster.addService("IndexerService", {
  image: {
    dockerfile: "Dockerfile.indexer",
  },
  public: {
    ports: [{ listen: "80/http" }],
  },
  dev: {
    command: "pnpm dev:indexer",
  },
  environment: {
    PONDER_RPC_URL: INDEXER_RPC_URL.value,
    CHAIN_ID: CHAIN_ID.value,
  },
  link: [eventBus, INDEXER_RPC_URL, CHAIN_ID],
});
