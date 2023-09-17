import { Module } from '@nestjs/common';
import { PactsService } from './pacts.service';
import { PactsController } from './pacts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PactEntity } from './entities/pact.entity';
import { MailService } from 'src/mail/mail.service';
import { MailModule } from 'src/mail/mail.module';

@Module({
  imports: [TypeOrmModule.forFeature([PactEntity]), MailModule],
  controllers: [PactsController],
  providers: [PactsService],
  exports: [PactsService],
})
export class PactsModule {}
