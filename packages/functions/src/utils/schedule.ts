import {
  CreateScheduleCommand,
  SchedulerClient,
} from "@aws-sdk/client-scheduler";
import { Resource } from "sst";

export const schedule = async ({
  name,
  triggerDate,
  functionArn,
}: {
  name: string;
  triggerDate: Date;
  functionArn: string;
}) => {
  const triggerString = triggerDate.toISOString().split(".")[0];
  const client = new SchedulerClient({ region: "us-east-2" });
  const command = new CreateScheduleCommand({
    FlexibleTimeWindow: {
      Mode: "OFF",
    },
    Name: name,
    ScheduleExpression: `at(${triggerString})`,
    Target: {
      Arn: functionArn,
      RoleArn: Resource.schedulerRole.arn,
    },
    ScheduleExpressionTimezone: "UTC",
    ActionAfterCompletion: "DELETE",
  });

  const res = await client.send(command);
  return {
    statusCode: 200,
    body: res.$metadata.requestId,
  };
};
