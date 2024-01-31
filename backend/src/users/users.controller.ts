import { TypedBody, TypedParam } from '@nestia/core';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Controller, Get, Inject, Post } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { MailService } from 'src/mail/mail.service';
import { Prize } from 'src/prizes/entities/prize.entity';
import { Submission } from 'src/prizes/entities/submission.entity';
import { Http200Response } from 'src/utils/types/http.type';
import { CreateUser } from './dto/create-user.dto';
import { UpdateUser } from './dto/update-user.dto';
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
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) { }

  /**
   * Creates a new user and sends welcome email.
   * @see{ @link MailService }
   *
   * @param {CreateUser} createUserType - The user creation Interface.
   * @returns {Promise<User>} The created user object.
   */
  @Post()
  async create(@TypedBody() createUserDto: CreateUser): Promise<User> {
    const user = await this.usersService.create(createUserDto);

    await this.cacheManager.reset();
    await this.mailService.welcome(user.email, user.name);
    return user;
  }

  @Post('update/:username')
  async updateByUsername(
    @TypedBody() updateDtoUser: UpdateUser,
    @TypedParam('username') username: string,
  ) {
    try {
      const user = await this.usersService.update(username, updateDtoUser);
      await this.cacheManager.reset();
      return user;
    } catch (err) {
      console.log(err);
    }
  }

  @Get('/clear_cache')
  async clearCache(): Promise<Http200Response> {
    await this.cacheManager.reset();
    return {
      message: 'Cache cleared',
    };
  }

  /**
   * Get a user by ID.
   *
   * @returns {Promise<User>} The user object.
   */
  @Get(':authId')
  async findOneByAuthId(@TypedParam('authId') authId: string): Promise<User> {
    const cacheUser = await this.cacheManager.get<User>(authId);
    if (cacheUser) {
      return cacheUser;
    }
    const user = await this.usersService.findOneByAuthId(authId);
    await this.cacheManager.set(authId, user);
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
    const cacheUser = await this.cacheManager.get<User>(username);
    if (cacheUser) {
      return cacheUser;
    }
    const user = await this.usersService.findOneByUsername(username);
    await this.cacheManager.set(username, user);
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
