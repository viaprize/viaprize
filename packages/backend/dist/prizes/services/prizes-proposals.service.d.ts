import { CreatePrizeProposalDto } from '../dto/create-prize-proposal.dto';
import { UpdatePrizeDto } from '../dto/update-prize-proposal.dto';
import { PrizeProposals } from '../entities/prize-proposals.entity';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from 'src/config/config.type';
import { IPaginationOptions } from 'src/utils/types/pagination-options';
import { MailService } from 'src/mail/mail.service';
import { UsersService } from 'src/users/users.service';
export declare class PrizeProposalsService {
    private prizeProposalsRepository;
    private configService;
    private mailService;
    private userService;
    constructor(prizeProposalsRepository: Repository<PrizeProposals>, configService: ConfigService<AppConfig>, mailService: MailService, userService: UsersService);
    create(createPrizeDto: CreatePrizeProposalDto, userId: string): Promise<void>;
    findAll(): Promise<PrizeProposals[]>;
    findByUserWithPagination(paginationOptions: IPaginationOptions, userId: string): Promise<PrizeProposals[]>;
    findByUser(userId: string): Promise<PrizeProposals[]>;
    findOne(id: string): Promise<PrizeProposals | null>;
    approve(id: string): Promise<void>;
    update(id: string, updatePrizeDto: UpdatePrizeDto): Promise<PrizeProposals | null>;
    remove(id: string): Promise<void>;
}
