import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUser } from './dto/create-user.dto';
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
  ) {}
  async create(createUserDto: CreateUser): Promise<User> {
    try {
      const user = await this.userRepository.create(createUserDto);
      await this.userRepository.insert(user)
      return user
    } catch (error) {
      throw new HttpException('User Already Exists', HttpStatus.FORBIDDEN);
    }
    
  }

  findAll() {
    return `This action returns all users`;
  }
  async findOneByAuthId(authId: string) {
    const user = await this.userRepository.findOne({
      where: {
        authId: authId,
      },
    });
    if (!user)
      throw new HttpException(
        `User not found with authId ${authId}`,
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
