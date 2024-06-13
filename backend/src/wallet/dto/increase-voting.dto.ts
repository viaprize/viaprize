import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class IncreaseVotingDto {
  @ApiProperty({
    type: Number,
    description: 'The number of minutes to increase the voting by',
    example: 3,
  })
  @IsNumber()
  minutes: number;
}
