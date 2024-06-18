import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class AddUsdcFundsDto {
  @ApiProperty({
    type: Number,
    description: 'The amount associated with the submission',
    example: 100,
  })
  @IsNumber()
  amount: number;

  @ApiProperty({
    type: Number,
    description: 'The deadline timestamp for the submission',
    example: 1653945600,
  })
  @IsNumber()
  deadline: number;

  @ApiProperty({
    type: Number,
    description: 'The version number of the signature',
    example: 1,
  })
  @IsNumber()
  v: number;

  @ApiProperty({
    type: String,
    description: 'The signature component s',
    example: 'signature_s_value',
  })
  @IsString()
  s: string;

  @ApiProperty({
    type: String,
    description: 'The signature component r',
    example: 'signature_r_value',
  })
  @IsString()
  r: string;

  @ApiProperty({
    type: String,
    description: 'The unique hash of the submission',
    example: 'abcdef1234567890',
  })
  @IsString()
  hash: string;
}
