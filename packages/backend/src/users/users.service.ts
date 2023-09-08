import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private mailService: MailService,
  ) {}
  async create(createUserDto: CreateUserDto) {
    const user = await this.userRepository.create(createUserDto);
    await this.userRepository.save(user);
    await this.mailService.welcome(user.email);

    return;
  }

  findAll() {
    return `This action returns all users`;
  }
  findOneByUserId(userId: string) {
    return this.userRepository.findOne({
      where: {
        userId,
      },
    });
  }

  findOneByAddress(address: string) {
    const user = this.userRepository.findOne({
      where: {
        address,
      },
    });
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  // update(id: number, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} user`;
  // }
}
