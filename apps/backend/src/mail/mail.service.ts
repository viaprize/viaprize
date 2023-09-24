import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { AllConfigType } from 'src/config/config.type';

import { MailerService } from 'src/mailer/mailer.service';

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService<AllConfigType>,
  ) {}
  async welcome(email: string) {
    await this.mailerService.sendSimpleMail({
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

  async rejected(to: string, comment: string) {
    await this.mailerService.sendSimpleMail({
      to,
      subject: `Hi your proposal was rejected `,
      text: `${comment} \n This is why your proposal was rejected`,
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
