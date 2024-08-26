import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class SendUsdcTransactionDto {
  @ApiProperty({
    type: Number,
    description: 'The amount in USDC 6 digits',
    example: 1000000,
  })
  @IsNumber()
  amount: number;

  @ApiProperty({
    type: String,
    description: 'The receiver address',
    example: '0x1234567890123456789012345678901234567890',
  })
  @IsString()
  receiver: string;

  @IsNumber()
  deadline: number;

  @IsNumber()
  v: number;

  @IsString()
  r: string;

  @IsString()
  s: string;

  @IsString()
  ethSignedMessageHash: string;
}
