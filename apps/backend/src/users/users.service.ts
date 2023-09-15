import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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
    try {
      const user = await this.userRepository.create(createUserDto);
      await this.userRepository.save(user);
      await this.mailService.welcome(user.email);
    } catch (error) {
      throw new HttpException('User Already Exists', HttpStatus.FORBIDDEN);
    }
  }

  findAll() {
    return `This action returns all users`;
  }
  async findOneByUserId(userId: string) {
    const user = await this.userRepository.findOne({
      where: {
        user_id: userId,
      },
    });
    if (!user)
      throw new HttpException(
        `User not found with user id ${userId}`,
        HttpStatus.BAD_REQUEST,
      );
    return user;
  }

  // update(id: number, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} user`;
  // }
}
