import { ConfigService } from '@nestjs/config';
import nodemailer from 'nodemailer';
import { AllConfigType } from 'src/config/config.type';
export declare class MailerService {
    private readonly configService;
    private readonly transporter;
    constructor(configService: ConfigService<AllConfigType>);
    sendMail({ templatePath, context, ...mailOptions }: nodemailer.SendMailOptions & {
        templatePath: string;
        context: Record<string, unknown>;
    }): Promise<void>;
    sendSimpleMail(options: nodemailer.SendMailOptions): Promise<void>;
}
