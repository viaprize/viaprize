import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    type: String,
    description: 'The wallet address of the user',
    example: '0x',
  })
  address: string;

  @ApiProperty({
    type: String,
    description: 'The user wallet',
    example: 'sex@gmail.com',
  })
  email: string;

  @ApiProperty({
    type: String,
    description: 'This is gotten from privy',
    example: 'jsldj3lkj',
  })
  userId: string;
}
