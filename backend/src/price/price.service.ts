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
    const cache_usd_to_eth = await this.cacheManager.get('usd_to_eth');
    if (cache_usd_to_eth) {
      return JSON.parse(cache_usd_to_eth as string);
    }
    const data = await (
      await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${type}&vs_currencies=usd`,
      )
    ).json();
    await this.cacheManager.set('usd_to_eth', JSON.stringify(data), 120000);
    return data;
  }
}
