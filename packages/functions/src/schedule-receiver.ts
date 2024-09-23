import { Events } from "@viaprize/core/viaprize";
import type { ScheduledHandler } from "aws-lambda";
import { Resource } from "sst";
import { bus } from "sst/aws/bus";
export type ScheduleType = "wallet.transaction";
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

  console.log("Event: ", JSON.stringify(event, null, 2));
  console.log("Context: ", JSON.stringify(context, null, 2));
  console.log("Payload: ", { payload });
  console.log("Payload type: ", payload.type);

  switch (payload.type) {
    case "wallet.transaction":
      console.log("Processing wallet transaction event");
      await bus.publish(
        Resource.EventBus.name,
        Events.Wallet.Transaction,
        payload.body as typeof Events.Wallet.Transaction.$input
      );
      break;
  }
};
