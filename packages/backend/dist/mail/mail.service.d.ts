import { ConfigService } from '@nestjs/config';
import { AllConfigType } from 'src/config/config.type';
import { MailerService } from 'src/mailer/mailer.service';
export declare class MailService {
    private readonly mailerService;
    private readonly configService;
    constructor(mailerService: MailerService, configService: ConfigService<AllConfigType>);
    welcome(email: string, name: string): Promise<void>;
    test(): Promise<void>;
    approved(to: string, name: string, proposalTitle: string, proposalDescription: string, proposalLink: string): Promise<void>;
    rejected(to: string, comment: string): Promise<void>;
    proposalSent(to: string, name: string, proposalTitle: string, proposalDescription: string, submissionDate: string): Promise<void>;
}
