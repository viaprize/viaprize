import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { MailService } from 'src/mail/mail.service';
export declare class UsersService {
    private userRepository;
    private mailService;
    constructor(userRepository: Repository<User>, mailService: MailService);
    create(createUserDto: CreateUserDto): Promise<void>;
    findAll(): string;
    findOneByUserId(userId: string): Promise<User>;
}
