type CacheTagType = {
  [key: string]: { value: string; requiresSuffix: boolean };
};

type CacheTagKey = keyof CacheTagType;

type CacheTagWithSuffix = {
  [K in CacheTagKey]: CacheTagType[K]["requiresSuffix"] extends true
    ? K
    : never;
}[CacheTagKey];
export class CacheTag {
  CACHE_TAGS: CacheTagType;
  constructor(cacheTags: CacheTagType) {
    this.CACHE_TAGS = cacheTags;
  }
  getCacheTag(tag: CacheTagWithSuffix, suffix: string): string;
  // Overload: If the tag doesn't require a suffix, the suffix is optional.
  getCacheTag(
    tag: Exclude<CacheTagKey, CacheTagWithSuffix>,
    suffix?: string
  ): string;

  getCacheTag(tag: CacheTagKey, suffix?: string): string {
    const cacheTag = this.CACHE_TAGS[tag];

    if (cacheTag.requiresSuffix && !suffix) {
      throw new Error(`Suffix is required for '${tag}' tag`);
    }

    return `${cacheTag.value}${suffix ? `:${suffix}` : ""}`;
  }
}
