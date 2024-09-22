import { eventBus } from "./events";

sst.Linkable.wrap(aws.iam.Role, (role) => ({
  properties: { arn: role.arn },
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

export const scheduleReceivingFunction = new sst.aws.Function(
  "ScheduleReceivingLambda",
  {
    handler: "packages/functions/src/schedule-receiver.handler",
    link: [eventBus],
  }
);
