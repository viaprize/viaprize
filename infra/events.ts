import { cacheTable } from "./cache";

// import { scheduleReceivingFunction, schedulerRole } from "./scheduler";
import {
  CHAIN_ID,
  DATABASE_URL,
  RPC_URL,
  WALLET_API_KEY,
  WALLET_PAYMENT_INFRA_API,
} from "./secrets";
sst.Linkable.wrap(aws.iam.Role, (fn) => ({
  properties: {
    arn: fn.arn,
  },
}));

export const schedulerRole = new aws.iam.Role("schedulerRole", {
  assumeRolePolicy: {
    Version: "2012-10-17",
    Statement: [
      {
        Action: "sts:AssumeRole",
        Effect: "Allow",
        Sid: "",
        Principal: {
          Service: "scheduler.amazonaws.com",
        },
      },
    ],
  },
  inlinePolicies: [
    {
      name: "schedulerLambdaPolicy",
      policy: JSON.stringify({
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Action: "lambda:InvokeFunction",
            Resource: "*",
          },
        ],
      }),
    },
  ],
});

sst.Linkable.wrap(sst.aws.Function, (fn) => ({
  properties: {
    arn: fn.arn,
  },
}));

export const eventBus = new sst.aws.Bus("EventBus");

export const scheduleReceivingFunction = new sst.aws.Function(
  "ScheduleReceivingLambda",
  {
    handler: "packages/functions/src/schedule-receiver.handler",
    link: [eventBus],
  }
);

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
    DATABASE_URL,
    CHAIN_ID,
    eventBus,
    cacheTable,
    WALLET_PAYMENT_INFRA_API,
    RPC_URL,
    WALLET_API_KEY,
    scheduleReceivingFunction,
    schedulerRole,
  ],
});
