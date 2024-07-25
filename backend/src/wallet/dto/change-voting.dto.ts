import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class ChangeVotingDto {
  @ApiProperty({
    type: Number,
    description:
      'The number of minutes to Change the voting by minutes from current time',
    example: 3,
  })
  @IsNumber()
  minutes: number;
}
