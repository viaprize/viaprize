import { PartialType } from '@nestjs/swagger';
import { CreateUser } from './create-user.dto';

export interface UpdateUserDto extends Partial<CreateUser> {}
