import {
  CreateScheduleCommand,
  SchedulerClient,
} from '@aws-sdk/client-scheduler'

export const handler = async () => {
  const client = new SchedulerClient({ region: 'us-east-2' })

  const command = new CreateScheduleCommand({
    FlexibleTimeWindow: {
      Mode: 'OFF',
    },
    Name: 'my-schedule-ysdf',
    ScheduleExpression: 'at(2024-09-17T14:07:00)',
    Target: {
      Arn: 'arn:aws:lambda:us-east-2:361769577580:function:viaprize-dipanshu-TestAPIFunction',
      RoleArn: 'arn:aws:iam::361769577580:role/schedulerRole-46c282c',
    },
    ScheduleExpressionTimezone: 'UTC',
    ActionAfterCompletion: 'DELETE',
  })
  console.log(command)
  const a = await client.send(command)
  console.log(a)
  return {
    statusCode: 200,
    // biome-ignore lint/style/noUnusedTemplateLiteral: <@dipanshuhappy ignoring this for now, I don't know what it denotes though>
    body: `$.`,
  }
}
