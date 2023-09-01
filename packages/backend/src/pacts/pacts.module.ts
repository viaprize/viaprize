import { Module } from '@nestjs/common';
import { PactsService } from './pacts.service';
import { PactsController } from './pacts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PactEntity } from './entities/pact.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PactEntity])],
  controllers: [PactsController],
  providers: [PactsService],
  exports: [PactsService],
})
export class PactsModule {}
