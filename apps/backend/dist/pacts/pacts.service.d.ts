import { CreatePactDto } from './dto/create-pact.dto';
import { PactEntity } from './entities/pact.entity';
import { Repository } from 'typeorm';
import { MailService } from 'src/mail/mail.service';
export declare class PactsService {
    private packRepository;
    private mailService;
    constructor(packRepository: Repository<PactEntity>, mailService: MailService);
    create(createPactDto: CreatePactDto, networkType: string): Promise<{
        networkType: string;
        name: string;
        terms: string;
        address: string;
        transactionHash: string;
        blockHash?: string | undefined;
    } & PactEntity>;
    findAll(networkType: string): Promise<PactEntity[]>;
    findOne(address: string): Promise<PactEntity | null>;
}
