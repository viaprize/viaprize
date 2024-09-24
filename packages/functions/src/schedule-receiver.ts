import { Events } from '@viaprize/core/viaprize'
import type { ScheduledHandler } from 'aws-lambda'
import { Resource } from 'sst'
import { bus } from 'sst/aws/bus'
import { viaprize } from './utils/viaprize'
export type ScheduleType =
  | 'wallet.transaction'
  | 'prize.endSubmissionAndStartVoting'
export const handler: ScheduledHandler<{
  type: ScheduleType
  body: any
}> = async (event, context) => {
  // Your code goes here
  const payload = JSON.parse(JSON.stringify(event)) as {
    type: ScheduleType
    body: any
  }
  console.log('Hello from Lambda!')

  console.log('Event: ', JSON.stringify(event, null, 2))
  console.log('Context: ', JSON.stringify(context, null, 2))
  console.log('Payload: ', { payload })
  console.log('Payload type: ', payload.type)

  switch (payload.type) {
    case 'wallet.transaction':
      console.log('Processing wallet transaction event')
      await bus.publish(
        Resource.EventBus.name,
        Events.Wallet.Transaction,
        payload.body as typeof Events.Wallet.Transaction.$input,
      )
      break
    case 'prize.endSubmissionAndStartVoting': {
      const body = payload.body as typeof Events.Wallet.Transaction.$input
      const prize = await viaprize.prizes.getPrizeByContractAddress(
        body.transactions[0].to,
      )
      if (prize.numberOfSubmissions > 0) {
        await bus.publish(
          Resource.EventBus.name,
          Events.Wallet.Transaction,
          payload.body as typeof Events.Wallet.Transaction.$input,
        )
      } else {
        await bus.publish(Resource.EventBus.name, Events.Wallet.Transaction, {
          transactions: [
            {
              data: body.transactions[0].data,
              to: body.transactions[0].to,
              value: body.transactions[0].value,
            },
          ],
          walletType: 'gasless',
        })
      }
    }
  }
}
