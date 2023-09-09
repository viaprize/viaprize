import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { I18nContext } from 'nestjs-i18n';
import { MailData } from './interfaces/mail-data.interface';
import { AllConfigType } from 'src/config/config.type';
import { MaybeType } from '../utils/types/maybe.type';
import { MailerService } from 'src/mailer/mailer.service';
import path from 'path';

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService<AllConfigType>,
  ) {}
  welcome(email: string) {
    this.mailerService.sendSimpleMail({
      to: email,
      subject: 'Welcome to the app',
      text: 'Welcome to the app',
    });
  }

  async test() {
    await this.mailerService.sendSimpleMail({
      to: 'dipanshuhappy@gmail.com',
      subject: 'Hi',
      text: 'testing',
    });
  }
  async approved(to: string) {
    await this.mailerService.sendSimpleMail({
      to,
      subject: 'Hi your proposal is approved',
      text: 'Hi your proposal is approved',
    });
  }
  async proposalSent(to: string) {
    await this.mailerService.sendSimpleMail({
      to,
      subject: 'Hi your proposal is sent',
      text: 'Hi your proposal is sent , you will be notified once approved or rejected',
    });
  }
}
