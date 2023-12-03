import { TypedBody, TypedParam } from '@nestia/core';
import { Controller, Get, Post } from '@nestjs/common';
import { MailService } from 'src/mail/mail.service';
import { Prize } from 'src/prizes/entities/prize.entity';
import { Submission } from 'src/prizes/entities/submission.entity';
import { CreateUser } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

/**
 * The Users controller is responsible for handling requests from the client related to user data.
 * This includes creating a new user, getting a user by ID, and getting a user by username.
 */
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly mailService: MailService,
  ) {}

  /**
   * Creates a new user and sends welcome email.
   * @see{ @link MailService }
   *
   * @param {CreateUser} createUserType - The user creation Interface.
   * @returns {Promise<User>} The created user object.
   */
  @Post()
  async create(@TypedBody() createUserDto: CreateUser): Promise<User> {
    console.log({ ...createUserDto }, 'hi');
    const user = await this.usersService.create(createUserDto);
    console.log({ ...user }, 'user');
    await this.mailService.welcome(user.email, user.name);
    return user;
  }

  /**
   * Get a user by ID.
   *
   * @returns {Promise<User>} The user object.
   */
  @Get(':authId')
  async findOneByAuthId(@TypedParam('authId') userId: string): Promise<User> {
    const user = await this.usersService.findOneByAuthId(userId);

    return user;
  }

  /**
   * Get a user by username.
   *
   * @returns {Promise<User>} The user object.
   */
  @Get('username/:username')
  async findOneByUsername(
    @TypedParam('username') username: string,
  ): Promise<User> {
    console.log('here is the user: ', username);
    const user = await this.usersService.findOneByUsername(username);

    return user;
  }
  /**
   * Endpoint for checking if a user with the specified username exists.
   * @param username The username to check.
   * @returns A boolean indicating if the user exists.
   */
  @Get('exists/:username')
  async exists(@TypedParam('username') username: string): Promise<boolean> {
    return this.usersService.exists(username);
  }
  /**
   * Endpoint for getting submission of a specified username.
   * @param username The username to check.
   * @returns {Promise<Submission[]>} The submission object.
   */
  @Get('username/:username/submissions')
  async getSubmissions(
    @TypedParam('username') username: string,
  ): Promise<Submission[]> {
    const submissions = await this.usersService.findUserSubmissionsByUsername(
      username,
    );
    return submissions;
  }

  /**
   * Endpoint for getting prizes of a specified username.
   * @param username The username to check.
   * @returns {Promise<Prize[]>} The prize object.
   */
  @Get('username/:username/prizes')
  async getPrizes(@TypedParam('username') username: string): Promise<Prize[]> {
    const prizes = await this.usersService.findUserPrizesByUsername(username);
    return prizes;
  }
}
