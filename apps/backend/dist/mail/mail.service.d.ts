import { ConfigService } from '@nestjs/config';
import { AllConfigType } from 'src/config/config.type';
import { MailerService } from 'src/mailer/mailer.service';
export declare class MailService {
    private readonly mailerService;
    private readonly configService;
    constructor(mailerService: MailerService, configService: ConfigService<AllConfigType>);
    welcome(email: string): void;
    test(): Promise<void>;
    approved(to: string): Promise<void>;
    proposalSent(to: string): Promise<void>;
}
