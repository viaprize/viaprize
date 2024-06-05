import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class PrizeIdentifierDto {
  @ApiProperty({
    type: String,
    description:
      'The address of the  prize contract. It must exist in the viaprize database',
    example: '0x1234567890abcdef',
  })
  @IsString()
  contract_address: string;
}
