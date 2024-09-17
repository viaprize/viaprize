import { Events } from '@viaprize/core/viaprize'
import { bus } from 'sst/aws/bus'

export const handler = bus.subscriber(
  [Events.Wallet.ScheduleTransaction],
  async (event) => {
    console.log(event.type, event.properties, event.metadata)
    switch (event.type) {
      case 'wallet.transaction':
        console.log('Processing wallet transaction event')
        break
    }
  },
)
