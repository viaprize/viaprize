import { Events, Viaprize } from "@viaprize/core/viaprize";
import { bus } from "sst/aws/bus";
console.log(process.env.DATABASE_URL, "db url");
console.log(process.env.CHAIN_ID, "chain id");

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
        viaprize.prizes.approveDeployedPrize(
          event.properties.prizeId,
          event.properties.contractAddress
        );
        break;
    }
  }
);
