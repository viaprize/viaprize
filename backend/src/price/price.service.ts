import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
export type ConvertUSD = {
  [key: string]: {
    usd: number;
  };
};
@Injectable()
export class PriceService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}
  async getPrice(type: 'ethereum' | 'solana' | 'bitcoin'): Promise<ConvertUSD> {
    const cache_usd_to_type = await this.cacheManager.get(type);
    if (cache_usd_to_type) {
      console.log({ cache_usd_to_type });
      return JSON.parse(cache_usd_to_type as string);
    }
    const data = await (
      await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${type}&vs_currencies=usd`,
      )
    ).json();
    console.log({ data });
    await this.cacheManager.set(type, JSON.stringify(data), 120000);
    return data;
  }
}
