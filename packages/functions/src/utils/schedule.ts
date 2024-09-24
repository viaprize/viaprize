import {
  CreateScheduleCommand,
  SchedulerClient,
} from '@aws-sdk/client-scheduler'
import { Resource } from 'sst'

export const schedule = async ({
  name,
  triggerDate,
  functionArn,
  payload,
}: {
  name: string
  triggerDate: Date
  functionArn: string
  payload?: string
}) => {
  const triggerString = triggerDate.toISOString().split('.')[0]
  const client = new SchedulerClient({ region: 'us-east-2' })
  const command = new CreateScheduleCommand({
    FlexibleTimeWindow: {
      Mode: 'OFF',
    },
    Name: name,
    ScheduleExpression: `at(${triggerString})`,
    Target: {
      Arn: functionArn,
      RoleArn: Resource.schedulerRole.arn,
      Input: payload,
    },
    ScheduleExpressionTimezone: 'UTC',
    ActionAfterCompletion: 'DELETE',
    Description: 'Schedule for prize submission',
  })

  const res = await client.send(command)
  return {
    statusCode: 200,
    body: res.$metadata.requestId,
  }
}
