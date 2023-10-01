import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUser } from './dto/create-user.dto';
import { User } from './entities/user.entity';

/* The UsersService class is responsible for creating and retrieving user data from a repository. */
@Injectable()

export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) { }

  /**
   * The function creates a new user by inserting the provided user data into the user repository, and
   * returns the created user.
   * @param {CreateUser} createUserDto - The `createUserDto` parameter is an object that contains the
   * data needed to create a new user. It likely includes properties such as `name`, `email`,
   * `password`, etc.
   * @returns a Promise that resolves to a User object.
   */
  async create(createUserDto: CreateUser): Promise<User> {
    try {
      const user = await this.userRepository.create(createUserDto);
      await this.userRepository.insert(user);
      return user;
    } catch (error) {
      throw new HttpException('User Already Exists', HttpStatus.FORBIDDEN);
    }
  }

  /**
   * The function finds a user by their authentication ID and throws an error if the user is not found.
   * @param {string} authId - The `authId` parameter is a string that represents the authentication ID
   * of a user which is gotten from auth provider . It is used to find a user in the database based on their authentication ID.
   *
   * @returns {Promise<User> } the user object that is found in the database based on the provided authId.
   * @see {@link User}
   */
  async findOneByAuthId(authId: string): Promise<User> {
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

  /**
   * The function finds a user by their username and throws an error if the user is not found.
   * @param {string} username - The `username` parameter is a string that represents the username
   * of a user which is gotten from auth provider . It is used to find a user in the database based on their username.
   *
   * @returns {Promise<User> } the user object that is found in the database based on the provided username.
   * @see {@link User}
   */

  async findOneByUsername(username: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: {
        username: username,
      },
      relations: ['submissions', 'prizeProposals'],


    });
    if (!user)
      throw new HttpException(
        `User not found with username ${username}`,
        HttpStatus.BAD_REQUEST,
      );
    return user;
  }
}
