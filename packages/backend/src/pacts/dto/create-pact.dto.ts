import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, Length } from 'class-validator';

export class CreatePactDto {
  @ApiProperty({
    description: 'Name of the pact i.e the Title',
    type: String,
    example: 'Test',
  })
  @IsNotEmpty()
  @IsString()
  @Length(1, 255)
  name: string;

  @ApiProperty({
    description: 'Terms of the pact i.e the Description',
    type: String,
    example: 'Test',
  })
  @IsNotEmpty()
  @IsString()
  terms: string;

  @ApiProperty({
    description: 'Address of the pact on the blockchain',
    type: String,
    example: '0xe7399b79838acc8caaa567fF84e5EFd0d11BB010',
  })
  @IsNotEmpty()
  @IsString()
  @Length(42, 42)
  address: string;

  @ApiProperty({
    description: 'transaction hash of the pact on the blockchain',
    type: String,
    example:
      '0x2e8937d96e633c82df2f8f5a19aafa132795496cd98d0ca3d3c336a6c79f09e4',
  })
  @IsNotEmpty()
  @IsString()
  @Length(66, 66)
  transactionHash: string;

  @IsOptional()
  @IsString()
  @Length(66, 66)
  blockHash?: string;
}
