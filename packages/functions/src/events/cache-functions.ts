import { Events, type Viaprize } from '@viaprize/core/viaprize'
import { Resource } from 'sst'
import { bus } from 'sst/aws/bus'

export const publishCacheDelete = async (key: string) => {
  await bus.publish(Resource.EventBus.name, Events.Cache.Delete, { key })
}

export const publishPrizeCacheDeletes = async (viaprize: Viaprize) => {
  const keys = [
    viaprize.prizes.getCacheTag('PENDING_PRIZES'),
    viaprize.prizes.getCacheTag('DEPLOYED_PRIZES'),
    viaprize.prizes.getCacheTag('ACTIVE_PRIZES_COUNT'),
  ]
  await Promise.all(keys.map((key) => publishCacheDelete(key)))
}
