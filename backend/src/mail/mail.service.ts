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
  async welcome(email: string, name: string) {
    console.log(email, name, 'emailll');
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
      templateName: 'welcome.hbs',
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
      templateName: 'approved.hbs',
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
      templateName: 'proposalSent.hbs',
    });
  }
}
