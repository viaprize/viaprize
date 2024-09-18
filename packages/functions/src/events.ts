import { Events, Viaprize } from "@viaprize/core/viaprize";
import { bus } from "sst/aws/bus";

const viaprize = new Viaprize({
  config: {
    databaseUrl: process.env.DATABASE_URL ?? "",
    inMemoryDb: false,
    mode: "development",
    wallet: {
      walletPaymentInfraUrl: "https://null.com",
      walletApiKey: "some-key",
      rpcUrl: "https://null.com",
    },
    chainId: Number.parseInt(process.env.CHAIN_ID ?? "10"),
  },
});
export const handler = bus.subscriber(
  [Events.Wallet.ScheduleTransaction, Events.Prize.Approve],
  async (event) => {
    switch (event.type) {
      case "wallet.transaction":
        console.log("Processing wallet transaction event");
        break;
      case "prize.approve":
        console.log("Processing prize approve event");
        await viaprize.prizes.approveDeployedPrize(
          event.properties.prizeId,
          event.properties.contractAddress
        );

        break;
    }
  }
);
