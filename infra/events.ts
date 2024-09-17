import { schedulerRole } from './scheduler'

export const eventBus = new sst.aws.Bus('EventBus')
eventBus.subscribe({
  handler: 'packages/functions/src/events.handler',
  permissions: [
    {
      actions: ['scheduler:CreateSchedule'],
      resources: ['*'],
    },
    {
      actions: ['iam:PassRole'],
      resources: ['*'],
    },
  ],
  link: [schedulerRole],
})
