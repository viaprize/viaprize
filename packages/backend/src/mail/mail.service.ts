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
  async welcome(email: string, name: string) {
    // this.mailerService.sendSimpleMail({
    //   to: email,
    //   subject: 'Welcome to the app',
    //   text: 'Welcome to the app',
    // });
    const telegramLink = this.configService.getOrThrow<AllConfigType>(
      'TELEGRAM_LINK',
      {
        infer: true,
      },
    );
    await this.mailerService.sendMail({
      to: email,
      subject: 'Welcome to the Viaprize',
      text: `Viaprize`,
      templatePath: path.join(__dirname, './templates/welcome.hbs'),
      context: {
        name,
        telegramLink,
      },
    });
  }

  async test() {
    await this.mailerService.sendSimpleMail({
      to: 'dipanshuhappy@gmail.com',
      subject: 'Hi',
      text: 'testing',
    });
  }
  async approved(
    to: string,
    name: string,
    proposalTitle: string,
    proposalDescription: string,
    proposalLink: string,
  ) {
    const telegramLink = this.configService.getOrThrow<AllConfigType>(
      'TELEGRAM_LINK',
      {
        infer: true,
      },
    );
    await this.mailerService.sendMail({
      to: to,
      subject: 'Hi your proposal was approved',
      text: `Viaprize `,
      templatePath: path.join(__dirname, '../../templates/approved.hbs'),
      context: {
        name,
        proposalTitle,
        proposalDescription,
        proposalLink,
        telegramLink,
      },
    });
  }

  async rejected(to: string, comment: string) {
    // await this.mailerService.sendSimpleMail({
    //   to,
    //   subject: `Hi your proposal was rejected `,
    //   text: `${comment} \n This is why your proposal was rejected`,
    // });
  }
  async proposalSent(
    to: string,
    name: string,
    proposalTitle: string,
    proposalDescription: string,
    submissionDate: string,
  ) {
    const telegramLink = this.configService.getOrThrow<AllConfigType>(
      'TELEGRAM_LINK',
      {
        infer: true,
      },
    );
    // await this.mailerService.sendSimpleMail({
    //   to,
    //   subject: 'Hi your proposal is sent',
    //   text: 'Hi your proposal is sent , you will be notified once approved or rejected',
    // });
    await this.mailerService.sendMail({
      to: to,
      subject: 'Hi your proposal is sent',
      context: {
        name,
        proposalTitle,
        proposalDescription,
        submissionDate,

        telegramLink,
      },
      templatePath: path.join(__dirname, '../../templates/proposalSent.hbs'),
    });
  }
}
