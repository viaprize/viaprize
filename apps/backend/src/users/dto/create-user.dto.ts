import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    type: String,
    description: 'The user wallet',
    example: 'sex@gmail.com',
  })
  @IsString()
  email: string;

  @ApiProperty({
    type: String,
    description: 'This is gotten from privy',
    example: 'jsldj3lkj',
  })
  @IsString()
  user_id: string;

  @ApiProperty({
    type: String,
    description: 'The name gotten from on boarding',
    example: 'johnsmith',
  })
  @IsString()
  name: string;
}
