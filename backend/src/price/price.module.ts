import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { PriceController } from './price.controller';
import { PriceService } from './price.service';

@Module({
  controllers: [PriceController],
  imports: [CacheModule.register()],
  providers: [PriceService],
})
export class PriceModule {}
