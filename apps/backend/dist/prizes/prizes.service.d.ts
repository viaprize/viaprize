import { CreatePrizeProposalDto } from './dto/create-prize-proposal.dto';
import { UpdatePrizeDto } from './dto/update-prize-proposal.dto';
import { PaginateQuery, Paginated } from 'nestjs-paginate';
import { Prize } from './entities/prize.entity';
import { Repository } from 'typeorm';
import { MailService } from 'src/mail/mail.service';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { PrizeContract } from './contracts/prize.contract';
export declare class PrizesService {
    private prizeRepository;
    private mailService;
    private prizeContract;
    constructor(prizeRepository: Repository<Prize>, mailService: MailService, prizeContract: PrizeContract);
    create(createPrizeDto: CreatePrizeProposalDto): string;
    findAll(query: PaginateQuery): Promise<Paginated<Prize>>;
    getSmartContractDetails(): Promise<{
        admins: any;
        funders: any;
    }>;
    findOne(id: string): Promise<Prize | null>;
    update(id: number, updatePrizeDto: UpdatePrizeDto): string;
    addSummission(id: string, createSubmissionDto: CreateSubmissionDto): Promise<void>;
    remove(id: number): string;
}
