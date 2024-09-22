import { Events } from "@viaprize/core/viaprize";
import type { ScheduledHandler } from "aws-lambda";
import { Resource } from "sst";
import { bus } from "sst/aws/bus";
export type ScheduleType = "wallet.transaction";
export const handler: ScheduledHandler<{
  type: ScheduleType;
  body: string;
}> = async (event, context) => {
  // Your code goes here
  const payload = event as unknown as { type: ScheduleType; body: string };
  console.log("Hello from Lambda!");

  console.log("Event: ", JSON.stringify(event, null, 2));
  console.log("Context: ", JSON.stringify(context, null, 2));
  switch (payload.type) {
    case "wallet.transaction":
      console.log("Processing wallet transaction event");
      await bus.publish(
        Resource.EventBus.name,
        Events.Wallet.Transaction,
        JSON.parse(payload.body) as typeof Events.Wallet.Transaction.$input
      );
      break;
  }
};
