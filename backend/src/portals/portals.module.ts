import { Module } from '@nestjs/common';
import { PortalsService } from './portals.service';
import { PortalsController } from './portals.controller';

@Module({
  controllers: [PortalsController],
  providers: [PortalsService],
})
export class PortalsModule {}
