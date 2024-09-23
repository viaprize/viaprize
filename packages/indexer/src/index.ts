import { ponder } from "@/generated";
import { Events, Viaprize } from "@viaprize/core/viaprize";
import { Resource } from "sst";
import { bus } from "sst/aws/bus";
import { env } from "./env";
const viaprize = new Viaprize({
  config: {
    chainId: Number.parseInt(env.CHAIN_ID),
    databaseUrl: env.DATABASE_URL,
    inMemoryDb: false,
    mode: "development",
    wallet: {
      rpcUrl: env.RPC_URL,
      walletApiKey: env.WALLET_API_KEY,
      walletPaymentInfraUrl: env.WALLET_PAYMENT_INFRA_API,
    },
  },
});
ponder.on("PrizeV2:SubmissionStarted", async ({ event }) => {
  console.log(
    `================================================= Submission Start ============================================= ${event.log.address}`
  );
});
ponder.on("PrizeV2:SubmissionEnded", async ({ event }) => {
  console.log(
    `================================================= Submission End ============================================= ${event.log.address}`
  );
});
ponder.on("PrizeV2:VotingStarted", async ({ event }) => {
  console.log(
    `================================================= Voting Start ============================================= ${event.log.address}`
  );
});
ponder.on("PrizeV2:VotingEnded", async ({ event }) => {
  console.log(
    `================================================= Voting End ============================================= ${event.log.address}`
  );
});
ponder.on("PrizeV2Factory:NewViaPrizeCreated", async ({ event }) => {
  console.log("NewViaPrizeCreated", event);
  const eventId = `${event.transaction.hash}-${event.name}-${event.log.id}`;
  console.log("Event ID", eventId);
  const hasIndexed = await viaprize.indexerEvents.getEventById(eventId);
  console.log("Has indexed", hasIndexed);
  if (!hasIndexed) {
    bus.publish(Resource.EventBus.name, Events.Prize.Approve, {
      contractAddress: event.args.viaPrizeAddress.toLowerCase(),
      prizeId: event.args.id,
    });
    await bus.publish(Resource.EventBus.name, Events.Indexer.ConfirmEvent, {
      eventId,
    });
  }
});

ponder.on("PrizeV2:CampaignCreated", async ({ event }) => {
  console.log("CampaignCreated", event);
  const eventId = `${event.transaction.hash}-${event.name}-${event.log.id}`;
  console.log("Event ID", eventId);
  const hasIndexed = await viaprize.indexerEvents.getEventById(eventId);
  console.log("Has indexed", hasIndexed);
});
