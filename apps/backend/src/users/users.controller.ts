import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';

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
