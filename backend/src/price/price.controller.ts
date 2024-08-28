import { Controller, Get } from '@nestjs/common';
import { PriceService } from './price.service';
interface PriceResponse {
  price: number;
}
@Controller('price')
export class PriceController {
  constructor(private readonly priceService: PriceService) {}

  @Get('/usd_to_eth')
  async usd_to_eth(): Promise<any> {
    return this.priceService.getPrice('ethereum');
  }

  @Get('/usd_to_sol')
  async usd_to_sol(): Promise<any> {
    return this.priceService.getPrice('solana');
  }

  @Get('/usd_to_btc')
  async usd_to_btc(): Promise<any> {
    return this.priceService.getPrice('bitcoin');
  }
}
