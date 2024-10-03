import { Resource } from "sst";
import { bus } from "sst/aws/bus";
import { PRIZE_V2_ABI } from "./lib/abi";
import { Events, type Viaprize } from "./viaprize";

export * as ViaprizeUtils from "./viaprize-utils";

export async function publishDeployedPrizeCacheDelete(
  viaprize: Viaprize,
  slug?: string | null
) {
  await bus.publish(Resource.EventBus.name, Events.Cache.Delete, {
    key: viaprize.prizes.getCacheTag("DEPLOYED_PRIZES"),
  });
  if (slug) {
    await bus.publish(Resource.EventBus.name, Events.Cache.Delete, {
      key: viaprize.prizes.getCacheTag("SLUG_PRIZE", slug ?? ""),
    });
  }
}

export async function startSubmission(
  viaprize: Viaprize,
  contractAddress: string
) {
  const prize = await viaprize.prizes.getPrizeByContractAddress(
    contractAddress
  );
  const txData = await viaprize.prizes.blockchain.getEncodedStartSubmission(
    prize.submissionDurationInMinutes
  );
  const txReceipt = await viaprize.wallet.withTransactionEvents(
    PRIZE_V2_ABI,
    [
      {
        data: txData,
        to: contractAddress,
        value: "0",
      },
    ],
    "gasless",
    "SubmissionStarted",
    async (events) => {
      await viaprize.prizes.startSubmissionPeriodByContractAddress(
        contractAddress
      );
    }
  );
  await publishDeployedPrizeCacheDelete(viaprize, prize.slug);
  return txReceipt;
}
