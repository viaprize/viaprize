import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from 'src/config/config.type';
import { MailerService } from 'src/mailer/mailer.service';

@Injectable()
export class MailService {
  telegramLink: string;
  linkedinLink: string;
  twitterLink: string;
  facebookLink: string;
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
    this.linkedinLink = this.configService.getOrThrow<AllConfigType>(
      'LINKEDIN_LINK',
      {
        infer: true,
      },
    );
    this.twitterLink = this.configService.getOrThrow<AllConfigType>(
      'TWITTER_LINK',
      {
        infer: true,
      },
    );
    this.facebookLink = this.configService.getOrThrow<AllConfigType>(
      'FACEBOOK_LINK',
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
        twitterLink: this.twitterLink,
        linkedinLink: this.linkedinLink,
        facebookLink: this.facebookLink,
      },
    });
  }

  async portalDeployed(email: string, name: string, title: string) {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Your portal was deployed',
      text: `Viaprize`,
      templateName: 'portalDeployed.hbs',
      context: {
        name,
        proposalTitle: title,
        telegramLink: this.telegramLink,
        twitterLink: this.twitterLink,
        linkedinLink: this.linkedinLink,
        facebookLink: this.facebookLink,
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
        twitterLink: this.twitterLink,
        linkedinLink: this.linkedinLink,
        facebookLink: this.facebookLink,
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
        twitterLink: this.twitterLink,
        linkedinLink: this.linkedinLink,
        facebookLink: this.facebookLink,
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
  async approved(to: string, name: string, proposalTitle: string) {
    await this.mailerService.sendMail({
      to: to,
      subject: 'Hi your proposal was approved',

      templateName: 'approved.hbs',
      context: {
        name,
        proposalTitle,

        telegramLink: this.telegramLink,
        twitterLink: this.twitterLink,
        linkedinLink: this.linkedinLink,
        facebookLink: this.facebookLink,
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
  async proposalSent(to: string, name: string, proposalTitle: string) {
    await this.mailerService.sendMail({
      to: [to, 'support@viaprize.org'],
      subject: 'Hi your proposal is sent',
      context: {
        name,
        proposalTitle,

        telegramLink: this.telegramLink,
      },
      templateName: 'proposalSent.hbs',
    });
  }
}
