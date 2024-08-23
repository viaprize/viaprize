import {
  CreateScheduleCommandInput,
  Scheduler,
} from '@aws-sdk/client-scheduler';

if (
  !process.env.AWS_REGION ||
  !process.env.AWS_ACCESS_KEY_ID ||
  !process.env.AWS_SECRET_ACCESS_KEY
) {
  throw new Error('Missing AWS credentials');
}

export const scheduler = new Scheduler({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

function formatUTCDate(date: Date): string {
  const pad = (num: number) => num.toString().padStart(2, '0');

  const year = date.getUTCFullYear();
  const month = pad(date.getUTCMonth() + 1); // JavaScript months are zero-indexed
  const day = pad(date.getUTCDate());
  const hours = pad(date.getUTCHours());
  const minutes = pad(date.getUTCMinutes());
  const seconds = pad(date.getUTCSeconds());

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
}

export async function scheduleLambdaEvent({
  time,
  url,
  uniqueId,
}: {
  time: Date;
  url: string;
  uniqueId: string;
}) {
  const eventDetail = {
    detail: {
      url: url, // URL to be requested by the Lambda function
    },
  };

  if (
    !process.env.LAMBDA_HIT_ROUTE_ARN ||
    !process.env.SCHEDULAR_IAM_ROLE_ARN
  ) {
    throw new Error('Missing environment variables');
  }

  console.log('Scheduling event for:', formatUTCDate(time), time);
  console.log('Event detail:', eventDetail);

  const schedularInput = {
    FlexibleTimeWindow: {
      Mode: 'OFF',
    },
    ActionAfterCompletion: 'DELETE',
    Target: {
      Arn: process.env.LAMBDA_HIT_ROUTE_ARN,
      RoleArn: process.env.SCHEDULAR_IAM_ROLE_ARN,
      Input: JSON.stringify(eventDetail),
    },
    ScheduleExpression: `at(${formatUTCDate(time)})`,
    ScheduleExpressionTimezone: 'UTC',
    Name: `scheduleforpost${uniqueId}`,
  } as CreateScheduleCommandInput;

  try {
    const res = await scheduler.createSchedule(schedularInput);
    return res;
  } catch (error) {
    console.error('Failed to schedule event:', error);
    throw error;
  }
}
