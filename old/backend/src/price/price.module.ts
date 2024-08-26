import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { PriceController } from './price.controller';

@Module({
  controllers: [PriceController],
  imports: [CacheModule.register()],
})
export class PriceModule {}
