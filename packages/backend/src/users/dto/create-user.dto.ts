import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    type: String,
    description: 'The wallet address of the user',
    example: '0x',
  })
  @IsString()
  address: string;

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
  userId: string;

  @ApiProperty({
    type: String,
    description: 'The name gotten from on boarding',
    example: 'johnsmith',
  })
  @IsString()
  name: string;
}
