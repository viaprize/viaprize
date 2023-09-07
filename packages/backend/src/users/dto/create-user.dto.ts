import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    type: String,
    description: 'The wallet address of the user',
    example: '0x',
  })
  address: string;
}
