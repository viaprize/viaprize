import { cacheTable } from "./cache";
import { scheduleReceivingFunction, schedulerRole } from "./scheduler";
import {
  CHAIN_ID,
  DATABASE_URL,
  RPC_URL,
  WALLET_API_KEY,
  WALLET_PAYMENT_INFRA_API,
} from "./secrets";

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
    WALLET_PAYMENT_INFRA_API: WALLET_PAYMENT_INFRA_API.value,
    RPC_URL: RPC_URL.value,
    WALLET_API_KEY: WALLET_API_KEY.value,
  },
  link: [
    schedulerRole,
    DATABASE_URL,
    CHAIN_ID,
    eventBus,
    cacheTable,
    scheduleReceivingFunction,
    WALLET_PAYMENT_INFRA_API,
    RPC_URL,
    WALLET_API_KEY,
  ],
});
