import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUser } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { TypedBody, TypedParam, TypedRoute } from "@nestia/core";
import { CreatePactDto } from 'src/pacts/dto/create-pact.dto';
import { User } from './entities/user.entity';
import { MailService } from 'src/mail/mail.service';
import api from 'src/api';

/**
 * This is the users controller class.
 * it handles the documentation of routes and implementation of services related to the route.
 */
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService,private readonly mailService:MailService
    ) {}

  /**
    * Creates a new user and sends welcome email.
    * @see{ @link MailService } 
    * 
    * @param {CreateUser} createUserType - The user creation Interface.
    * @returns {Promise<User>} The created user object.
  */
  @TypedRoute.Post()
  async create(@TypedBody() createUserDto: CreateUser) : Promise<User>{
    console.log({ ...createUserDto }, 'hi');
    const user = await this.usersService.create(createUserDto);
    await this.mailService.welcome(user.email)
    

   
    return user
  }
  
   /**
   * Get a user by ID.
   * 
   * @param {string} authId - Retrieve user by querying through it's auth id from auth provider.
   * @returns {User} The user object.
   */
  @TypedRoute.Get(":authId")
  findOne(@TypedParam("authId") userId: string) {
    return this.usersService.findOneByAuthId(userId);
  }
}
