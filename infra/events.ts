import { cacheTable } from "./cache";
import { schedulerRole } from "./scheduler";
import { CHAIN_ID, DATABASE_URL } from "./secrets";

export const eventBus = new sst.aws.Bus("EventBus");

eventBus.subscribe({
  handler: "packages/functions/src/events.handler",
  permissions: [
    {
      actions: ["scheduler:CreateSchedule"],
      resources: ["*"],
    },
    {
      actions: ["iam:PassRole"],
      resources: ["*"],
    },
  ],

  environment: {
    DATABASE_URL: DATABASE_URL.value,
    CHAIN_ID: CHAIN_ID.value,
  },
  link: [schedulerRole, DATABASE_URL, CHAIN_ID, eventBus, cacheTable],
});
