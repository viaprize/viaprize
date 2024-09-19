import { Events, Viaprize } from '@viaprize/core/viaprize'
import { Resource } from 'sst'
import { bus } from 'sst/aws/bus'
import { Cache } from './utils/cache'

const viaprize = new Viaprize({
  config: {
    databaseUrl: process.env.DATABASE_URL ?? '',
    inMemoryDb: false,
    mode: 'development',
    wallet: {
      walletPaymentInfraUrl: 'https://null.com',
      walletApiKey: 'some-key',
      rpcUrl: 'https://null.com',
    },
    chainId: Number.parseInt(process.env.CHAIN_ID ?? '10'),
  },
})

const cache = new Cache()

export const handler = bus.subscriber(
  [
    Events.Wallet.ScheduleTransaction,
    Events.Prize.Approve,
    Events.Cache.Set,
    Events.Cache.Delete,
  ],
  async (event) => {
    switch (event.type) {
      case 'wallet.transaction':
        console.log('Processing wallet transaction event')
        break
      case 'prize.approve':
        console.log('Processing prize approve event')
        await viaprize.prizes.approveDeployedPrize(
          event.properties.prizeId,
          event.properties.contractAddress,
        )
        await bus.publish(Resource.EventBus.name, Events.Cache.Delete, {
          key: viaprize.prizes.getCacheTag('PENDING_PRIZES'),
        })
        await bus.publish(Resource.EventBus.name, Events.Cache.Delete, {
          key: viaprize.prizes.getCacheTag('DEPLOYED_PRIZES'),
        })
        await bus.publish(Resource.EventBus.name, Events.Cache.Delete, {
          key: viaprize.prizes.getCacheTag('ACTIVE_PRIZES_COUNT'),
        })
        break
      case 'cache.set':
        console.log('Processing cache set event')
        switch (event.properties.type) {
          case 'dynamodb': {
            await cache.set(
              event.properties.key,
              event.properties.value,
              event.properties.ttl ?? 3600,
            )
            break
          }
        }
        break
      case 'cache.delete':
        console.log('Processing cache delete event')
        await cache.delete(event.properties.key)
        break
    }
  },
)
