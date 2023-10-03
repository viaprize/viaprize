import { TypedBody, TypedParam } from '@nestia/core';
import { Controller, Get, Post } from '@nestjs/common';
import { MailService } from 'src/mail/mail.service';
import typia from 'typia';
import { CreateUser } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

/**
 * This is the users controller class.
 * it handles the documentation of routes and implementation of services related to the route.
 * @tag {users}
 */
const assertSubmission = typia.json.createAssertStringify<User>();

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
    await this.mailService.welcome(user.email);

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
    user.submissions = user.submissions.filter(
      (submission) => submission !== null && submission !== undefined,
    );
    assertSubmission(user);
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
    user.submissions = user.submissions.filter(
      (submission) => submission !== null && submission !== undefined,
    );

    assertSubmission(user);
    return user;
  }
}
