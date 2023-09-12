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
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { CreatePactDto } from 'src/pacts/dto/create-pact.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiBody({
    description: 'Request body to create user',
    type: CreateUserDto,
  })
  create(@Body() createUserDto: CreateUserDto) {
    console.log({ ...createUserDto }, 'hi');
    return this.usersService.create(createUserDto);
  }
  @Get(':userId')
  findOne(@Param('userId') userId: string) {
    return this.usersService.findOneByUserId(userId);
  }
}
