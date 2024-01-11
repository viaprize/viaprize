import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Controller, Get, Inject } from '@nestjs/common';
import { Cache } from 'cache-manager';
@Controller('price')
export class PriceController {

    constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) { }

    @Get('/usd_to_eth')
    async usd_to_eth(): Promise<any> {
        const cache_usd_to_eth = await this.cacheManager.get('usd_to_eth')
        if (cache_usd_to_eth) {
            return JSON.parse(cache_usd_to_eth as string)
        }
        const data = await (await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd')).json()
        await this.cacheManager.set('usd_to_eth', JSON.stringify(data), 120000)
        return data
    }


}
