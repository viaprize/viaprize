import { ponder } from "@/generated";
import { Events } from "@viaprize/core/viaprize";
import { Resource } from "sst";
import { bus } from "sst/aws/bus";
ponder.on("PrizeV2Factory:NewViaPrizeCreated", async (event) => {
  console.log("NewViaPrizeCreated", event);
  bus.publish(Resource.EventBus.name, Events.Prize.Approve, {
    contractAddress: event.event.args.viaPrizeAddress,
    prizeId: event.event.args.id,
  });
});
