import { PRIZE_V2_ABI } from "@viaprize/core/lib/abi";
import { Events } from "@viaprize/core/viaprize";
import type { ScheduledHandler } from "aws-lambda";
import { Resource } from "sst";
import { bus } from "sst/aws/bus";
import type { ScheduleType } from "./types";
import { deleteSchedule } from "./utils/schedule";
import { viaprize } from "./utils/viaprize";

export const handler: ScheduledHandler<{
  type: ScheduleType;
  body: any;
}> = async (event, context) => {
  // Your code goes here
  const payload = JSON.parse(JSON.stringify(event)) as {
    type: ScheduleType;
    body: any;
  };
  console.log("Hello from Lambda!");

  console.log("Payload type: ", payload.type);

  switch (payload.type) {
    case "wallet.transaction": {
      const txBody = payload.body as typeof Events.Wallet.Transaction.$input;
      bus.publish(Resource.EventBus.name, Events.Wallet.Transaction, {
        transactions: txBody.transactions,
        walletType: txBody.walletType ?? "gasless",
      });
      break;
    }
    case "wallet.endDispute": {
      const txBody = payload.body as typeof Events.Wallet.Transaction.$input;
      await viaprize.wallet.withTransactionEvents(
        PRIZE_V2_ABI,
        txBody.transactions,
        txBody.walletType ?? "gasless",
        "DisputeEnded",
        async (event) => {
          await viaprize.prizes.endDisputePeriodByContractAddress(
            event[0].address
          );
        }
      );

      break;
    }
    case "wallet.startSubmission": {
      console.log("Processing wallet start submission event");
      const txBody = payload.body as typeof Events.Wallet.Transaction.$input;
      await viaprize.wallet.withTransactionEvents(
        PRIZE_V2_ABI,
        txBody.transactions,
        txBody.walletType ?? "gasless",
        "SubmissionStarted",
        async (event) => {
          await viaprize.prizes.startSubmissionPeriodByContractAddress(
            event[0].address
          );
        }
      );
      break;
    }
    case "wallet.endVoting": {
      const txBody = payload.body as typeof Events.Wallet.Transaction.$input;
      await viaprize.wallet.withTransactionEvents(
        PRIZE_V2_ABI,
        txBody.transactions,
        txBody.walletType ?? "gasless",
        "VotingEnded",
        async (event) => {
          await viaprize.prizes.endVotingPeriodByContractAddress(
            event[0].address
          );
        }
      );
      break;
    }
    case "wallet.endSubmissionAndStartVoting": {
      const txBody = payload.body as typeof Events.Wallet.Transaction.$input;
      await viaprize.wallet.withTransactionEvents(
        PRIZE_V2_ABI,
        txBody.transactions,
        "gasless",
        [
          "SubmissionEnded",
          "VotingEnded",
          "CryptoFunderRefunded",
          "FiatFunderRefund",
        ],
        async (event) => {
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
            await viaprize.prizes.startSubmissionPeriodByContractAddress(
              event[0].address
            );
          }
          if (cryptoFunderRefundedEvents || fiatFunderRefundEvents) {
            const totalCryptoFunderRefunded = cryptoFunderRefundedEvents.reduce(
              (acc, e) =>
                acc + Number.parseInt(e.args._amount?.toString() ?? "0"),
              0
            );
            const totalFiatFunderRefunded = fiatFunderRefundEvents.reduce(
              (acc, e) =>
                acc + Number.parseInt(e.args._amount?.toString() ?? "0"),
              0
            );

            await viaprize.prizes.refundByContractAddress(
              event[0].address,
              totalCryptoFunderRefunded + totalFiatFunderRefunded
            );
          }
        }
      );
      break;
    }

    case "prize.endSubmissionAndStartVoting": {
      const body = payload.body as typeof Events.Wallet.Transaction.$input;
      const prize = await viaprize.prizes.getPrizeByContractAddress(
        body.transactions[0].to
      );
      if (prize.numberOfSubmissions > 0) {
        await bus.publish(
          Resource.EventBus.name,
          Events.Wallet.Transaction,
          payload.body as typeof Events.Wallet.Transaction.$input
        );
        await deleteSchedule(`EndVoting-${body.transactions[0].to}`);
      } else {
        await bus.publish(Resource.EventBus.name, Events.Wallet.Transaction, {
          transactions: [
            {
              data: body.transactions[0].data,
              to: body.transactions[0].to,
              value: body.transactions[0].value,
            },
          ],
          walletType: "gasless",
        });
      }
    }
  }
};
