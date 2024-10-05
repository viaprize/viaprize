import { Resource } from "sst";
import { bus } from "sst/aws/bus";
import { hashTypedData } from "viem";
import { ERC20_PERMIT_SIGN_TYPE, PRIZE_V2_ABI } from "./lib/abi";
import type { ValidChainIDs } from "./lib/constants";
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

export async function handleEndSubmissionTransaction(
  viaprize: Viaprize,
  txBody: typeof Events.Wallet.Transaction.$input,
  prizeContractAddress: string
) {
  const prize = await viaprize.prizes.getPrizeByContractAddress(
    prizeContractAddress
  );
  if (!txBody.transactions[0]) {
    throw new Error("No transaction data found");
  }
  const finalTxData =
    prize.numberOfSubmissions > 0
      ? txBody.transactions
      : [txBody.transactions[0]];

  await viaprize.wallet.withTransactionEvents(
    PRIZE_V2_ABI,
    finalTxData,
    "gasless",
    [
      "SubmissionEnded",
      "VotingEnded",
      "CryptoFunderRefunded",
      "FiatFunderRefund",
    ],
    async (event) => {
      console.log(`${event} event received`);
      const submissionEndedEvents = event.filter(
        (e) => e.eventName === "SubmissionEnded"
      );
      const votingEndedEvents = event.filter(
        (e) => e.eventName === "VotingEnded"
      );
      const cryptoFunderRefundedEvents = event.filter(
        (e) => e.eventName === "CryptoFunderRefunded"
      );
      const fiatFunderRefundEvents = event.filter(
        (e) => e.eventName === "FiatFunderRefund"
      );

      if (submissionEndedEvents && votingEndedEvents) {
        await viaprize.prizes.startVotingPeriodByContractAddress(
          prizeContractAddress
        );
      }
      if (submissionEndedEvents) {
        await viaprize.prizes.refundByContractAddress({
          primaryContractAddress: prizeContractAddress,
          totalRefunded: 0,
        });
      }
      if (cryptoFunderRefundedEvents || fiatFunderRefundEvents) {
        const totalCryptoFunderRefunded = cryptoFunderRefundedEvents.reduce(
          (acc, e) => acc + Number.parseInt(e.args._amount?.toString() ?? "0"),
          0
        );
        const totalFiatFunderRefunded = fiatFunderRefundEvents.reduce(
          (acc, e) => acc + Number.parseInt(e.args._amount?.toString() ?? "0"),
          0
        );

        await viaprize.prizes.refundByContractAddress({
          primaryContractAddress: prizeContractAddress,
          totalRefunded: totalCryptoFunderRefunded + totalFiatFunderRefunded,
        });
      }
    }
  );
  await publishDeployedPrizeCacheDelete(viaprize, prize.slug);
}
