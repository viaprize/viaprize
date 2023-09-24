import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailModule } from 'src/mail/mail.module';
import { PactEntity } from './entities/pact.entity';
import { PactsController } from './pacts.controller';
import { PactsService } from './pacts.service';

@Module({
  imports: [TypeOrmModule.forFeature([PactEntity]), MailModule],
  controllers: [PactsController],
  providers: [PactsService],
  exports: [PactsService],
})
export class PactsModule {}
