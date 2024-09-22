import {
  CONTRACT_CONSTANTS_PER_CHAIN,
  type ValidChainIDs,
} from "@viaprize/core/lib/constants";
import { Events, Viaprize } from "@viaprize/core/viaprize";
import { addDays, addMinutes } from "date-fns";
import { Resource } from "sst";
import { bus } from "sst/aws/bus";
import { Cache } from "./utils/cache";
import { schedule } from "./utils/schedule";

const viaprize = new Viaprize({
  config: {
    databaseUrl: process.env.DATABASE_URL ?? "",
    inMemoryDb: false,
    mode: "development",
    wallet: {
      walletPaymentInfraUrl: process.env.WALLET_PAYMENT_INFRA_API ?? "",
      walletApiKey: process.env.WALLET_API_KEY ?? "",
      rpcUrl: process.env.RPC_URL ?? "",
    },
    chainId: Number.parseInt(process.env.CHAIN_ID ?? "10"),
  },
});
const viaprizeConstants =
  CONTRACT_CONSTANTS_PER_CHAIN[viaprize.config.chainId as ValidChainIDs];

const cache = new Cache();

export const handler = bus.subscriber(
  [
    Events.Wallet.Transaction,
    Events.Prize.Approve,
    Events.Cache.Set,
    Events.Cache.Delete,
    Events.Indexer.ConfirmEvent,
    Events.Prize.ScheduleStartSubmission,
    Events.Prize.ScheduleEndSubmissionAndStartVoting,
    Events.Prize.ScheduleEndVoting,
    Events.Prize.ScheduleEndDispute,
  ],
  async (event) => {
    switch (event.type) {
      case "wallet.transaction":
        console.log("Processing wallet transaction event");
        await viaprize.wallet.sendTransaction(
          {
            data: event.properties.data,
            to: event.properties.to,
            value: event.properties.value,
          },
          event.properties.walletType
        );
        break;
      case "prize.approve":
        console.log("Processing prize approve event");
        await viaprize.prizes.approveDeployedPrize(
          event.properties.prizeId,
          event.properties.contractAddress
        );
        await bus.publish(Resource.EventBus.name, Events.Cache.Delete, {
          key: viaprize.prizes.getCacheTag("PENDING_PRIZES"),
        });
        await bus.publish(Resource.EventBus.name, Events.Cache.Delete, {
          key: viaprize.prizes.getCacheTag("DEPLOYED_PRIZES"),
        });
        await bus.publish(Resource.EventBus.name, Events.Cache.Delete, {
          key: viaprize.prizes.getCacheTag("ACTIVE_PRIZES_COUNT"),
        });
        await bus.publish(
          Resource.EventBus.name,
          Events.Prize.ScheduleStartSubmission,
          {
            contractAddress: event.properties.contractAddress,
          }
        );
        await bus.publish(
          Resource.EventBus.name,
          Events.Prize.ScheduleEndSubmissionAndStartVoting,
          {
            contractAddress: event.properties.contractAddress,
          }
        );
        await bus.publish(
          Resource.EventBus.name,
          Events.Prize.ScheduleEndVoting,
          {
            contractAddress: event.properties.contractAddress,
          }
        );

        break;
      case "cache.set":
        console.log("Processing cache set event");
        switch (event.properties.type) {
          case "dynamodb": {
            await cache.set(
              event.properties.key,
              event.properties.value,
              event.properties.ttl ?? 3600
            );
            break;
          }
        }
        break;
      case "cache.delete":
        console.log("Processing cache delete event");
        await cache.delete(event.properties.key);
        break;
      case "indexer.confirmEvent":
        console.log("Processing indexer confirm event");
        await viaprize.indexerEvents.createEvent(event.properties.eventId);
        break;
      case "prize.scheduleStartSubmission": {
        console.log("Processing prize scheduleStartSubmission event");
        const prize = await viaprize.prizes.getPrizeByContractAddress(
          event.properties.contractAddress
        );
        const data = await viaprize.prizes.getEncodedStartSubmission(
          event.properties.contractAddress,
          prize
        );

        await schedule({
          functionArn: Resource.ScheduleReceivingLambda.arn,
          name: `StartSubmission-${prize.id}`,
          payload: JSON.stringify({
            data,
            to: prize.primaryContractAddress,
            value: "0",
            walletType: "gasless",
          } as typeof Events.Wallet.Transaction.$input),
          triggerDate: new Date(prize.startSubmissionDate),
        });
        break;
      }
      case "prize.scheduleEndSubmissionAndStartVoting": {
        const prize = await viaprize.prizes.getPrizeByContractAddress(
          event.properties.contractAddress
        );
        const data =
          await viaprize.prizes.getEncodedEndSubmissionAndStartVoting(
            event.properties.contractAddress,
            prize
          );

        await schedule({
          functionArn: Resource.ScheduleReceivingLambda.arn,
          name: `ScheduleEndSubmissionAndStartVoting-${prize.id}`,
          payload: JSON.stringify({
            data,
            to: viaprizeConstants.TRANSACTION_BATCH,
            value: "0",
            walletType: "gasless",
          } as typeof Events.Wallet.Transaction.$input),
          triggerDate: addMinutes(
            prize.startSubmissionDate,
            prize.submissionDurationInMinutes
          ),
        });
        break;
      }
      case "prize.scheduleEndVoting": {
        const prize = await viaprize.prizes.getPrizeByContractAddress(
          event.properties.contractAddress
        );
        const data = await viaprize.prizes.getEncodedEndSubmission();

        await schedule({
          functionArn: Resource.ScheduleReceivingLambda.arn,
          name: `EndVoting-${prize.id}`,
          payload: JSON.stringify({
            data,
            to: event.properties.contractAddress,
            value: "0",
            walletType: "gasless",
          } as typeof Events.Wallet.Transaction.$input),
          triggerDate: addMinutes(
            prize.startVotingDate,
            prize.votingDurationInMinutes
          ),
        });
        break;
      }
      case "prize.scheduleEndDispute": {
        const prize = await viaprize.prizes.getPrizeByContractAddress(
          event.properties.contractAddress
        );
        const data = await viaprize.prizes.getEncodedEndDispute();
        await schedule({
          functionArn: Resource.ScheduleReceivingLambda.arn,
          name: `EndDispute-${prize.id}`,
          payload: JSON.stringify({
            data,
            to: event.properties.contractAddress,
            value: "0",
            walletType: "gasless",
          } as typeof Events.Wallet.Transaction.$input),
          triggerDate: addDays(new Date(), 2),
        });
        break;
      }
    }
  }
);
