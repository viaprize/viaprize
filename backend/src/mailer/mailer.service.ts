import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Handlebars from 'handlebars';
import fs from 'node:fs/promises';
import nodemailer from 'nodemailer';
import path from 'path';
import { AllConfigType } from 'src/config/config.type';

@Injectable()
export class MailerService {
  private readonly transporter: nodemailer.Transporter;
  constructor(private readonly configService: ConfigService<AllConfigType>) {
    this.transporter = nodemailer.createTransport({
      host: configService.get('mail.host', { infer: true }),
      port: configService.get('mail.port', { infer: true }),

      auth: {
        user: configService.get('mail.user', { infer: true }),
        pass: configService.get('mail.password', { infer: true }),
      },
    });
  }

  async sendMail({
    templateName,
    context,
    ...mailOptions
  }: nodemailer.SendMailOptions & {
    templateName: string;
    context: Record<string, unknown>;
  }): Promise<void> {
    let html: string | undefined;
    console.log(templateName, 'templateName');
    const templatePath = path.join(
      __dirname,
      `../../mail/templates/${templateName}`,
    );
    console.log(templatePath, 'templatePath');
    if (templatePath) {
      const template = await fs.readFile(templatePath, 'utf-8');
      html = Handlebars.compile(template, {
        strict: true,
      })(context);
    }

    await this.transporter.sendMail({
      ...mailOptions,
      from: mailOptions.from
        ? mailOptions.from
        : `"${this.configService.get('mail.user', {
            infer: true,
          })}"`,
      html: mailOptions.html ? mailOptions.html : html,
    });
  }
  async sendSimpleMail(options: nodemailer.SendMailOptions): Promise<void> {
    await this.transporter.sendMail({
      ...options,
      from: 'noahcremean@gmail.com',
    });
  }
}
