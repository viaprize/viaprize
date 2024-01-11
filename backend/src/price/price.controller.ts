import { CacheKey, CacheTTL } from '@nestjs/cache-manager';
import { Controller, Get } from '@nestjs/common';

@Controller('price')
export class PriceController {
    @Get('/usd_to_eth')
    @CacheKey('usd_to_eth')
    @CacheTTL(30000)
    async usd_to_eth(): Promise<any> {
        return await (await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd')).json()
    }


}
