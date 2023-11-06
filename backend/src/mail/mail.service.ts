import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from 'src/config/config.type';
import { MailerService } from 'src/mailer/mailer.service';

@Injectable()
export class MailService {
  telegramLink: string;
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService<AllConfigType>,
  ) {
    this.telegramLink = this.configService.getOrThrow<AllConfigType>(
      'TELEGRAM_LINK',
      {
        infer: true,
      },
    );
  }
  async submission(email: string) {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Submission was deployed',
      text: 'Viaprize',
      templateName: 'submission.hbs',
      context: {
        telegramLink: this.telegramLink,
      },
    });
  }

  async prizeDeployed(email: string, name: string, proposalTitle: string) {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Your prize was deployed',
      text: `Viaprize`,
      templateName: 'prizeDeployed.hbs',
      context: {
        name,
        proposalTitle,
        telegramLink: this.telegramLink,
      },
    });
  }
  async welcome(email: string, name: string) {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Welcome to the Viaprize',
      text: `Viaprize`,
      templateName: 'welcome.hbs',
      context: {
        name,
        telegramLink: this.telegramLink,
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
    await this.mailerService.sendMail({
      to: to,
      subject: 'Hi your proposal was approved',

      templateName: 'approved.hbs',
      context: {
        name,
        proposalTitle,
        proposalDescription,
        proposalLink,
        telegramLink: this.telegramLink,
      },
    });
  }

  async rejected(to: string, name: string, comment: string) {
    await this.mailerService.sendMail({
      to: to,
      subject: 'Your Proposal was Rejected',
      templateName: 'rejected.hbs',
      context: {
        name,
        comment,
        telegramLink: this.telegramLink,
      },
    });
  }
  async proposalSent(
    to: string,
    name: string,
    proposalTitle: string,
    proposalDescription: string,
    submissionDate: string,
  ) {
    await this.mailerService.sendMail({
      to: to,
      subject: 'Hi your proposal is sent',
      context: {
        name,
        proposalTitle,
        proposalDescription,
        submissionDate,
        telegramLink: this.telegramLink,
      },
      templateName: 'proposalSent.hbs',
    });
  }
}
