type CacheTagType = {
  [key: string]: { value: string; requiresSuffix: boolean }
}

type CacheTagKey = keyof CacheTagType

type CacheTagWithSuffix<T extends CacheTagType> = {
  [K in keyof T]: T[K]['requiresSuffix'] extends true ? K : never
}[keyof T]
export class CacheTag<T extends CacheTagType> {
  CACHE_TAGS: T

  constructor(cacheTags: T) {
    this.CACHE_TAGS = cacheTags
  }
  getCacheTag(tag: keyof T, suffix: string): string
  // Overload: If the tag doesn't require a suffix, the suffix is optional.
  getCacheTag(
    tag: Exclude<keyof T, CacheTagWithSuffix<T>>,
    suffix?: string,
  ): string

  getCacheTag(tag: keyof T, suffix?: string): string {
    const cacheTag = this.CACHE_TAGS[tag]
    if (!cacheTag) {
      throw new Error(`Invalid cache tag: ${tag.toString()}`)
    }
    if (cacheTag.requiresSuffix && !suffix) {
      throw new Error(`Suffix is required for '${tag.toString()}' tag`)
    }

    return `${cacheTag.value}${suffix ? `:${suffix}` : ''}`
  }
}
