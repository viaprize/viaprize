import { eventBus } from "./events";
import {
  CHAIN_ID,
  DATABASE_URL,
  INDEXER_PRIZE_FACTORY_STARTBLOCK,
  INDEXER_PRIZE_STARTBLOCK,
  INDEXER_RPC_URL,
  RPC_URL,
  WALLET_API_KEY,
  WALLET_PAYMENT_INFRA_API,
} from "./secrets";
import { vpc } from "./vpc";

export const indexerCluster = new sst.aws.Cluster(
  "IndexerSmartContractsCluster",
  {
    vpc: vpc,
  }
);

indexerCluster.addService("IndexerService", {
  image: {
    dockerfile: "Dockerfile.indexer",
  },
  public: {
    ports: [{ listen: "80/http" }],
  },
  environment: {
    PONDER_RPC_URL: INDEXER_RPC_URL.value,
    CHAIN_ID: CHAIN_ID.value,
    INDEXER_PRIZE_FACTORY_STARTBLOCK: INDEXER_PRIZE_FACTORY_STARTBLOCK.value,
    INDEXER_PRIZE_STARTBLOCK: INDEXER_PRIZE_STARTBLOCK.value,
    DATABASE_URL: DATABASE_URL.value,
    WALLET_PAYMENT_INFRA_API: WALLET_PAYMENT_INFRA_API.value,
    WALLET_API_KEY: WALLET_API_KEY.value,
    RPC_URL: RPC_URL.value,
  },
  link: [
    eventBus,
    INDEXER_RPC_URL,
    CHAIN_ID,
    INDEXER_PRIZE_FACTORY_STARTBLOCK,
    INDEXER_PRIZE_STARTBLOCK,
    DATABASE_URL,
    WALLET_PAYMENT_INFRA_API,
    WALLET_API_KEY,
    RPC_URL,
  ],
});
