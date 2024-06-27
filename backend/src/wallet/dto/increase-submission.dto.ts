import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class IncreaseSubmissionDto {
  @ApiProperty({
    type: Number,
    description: 'The number of minutes to increase the submission by',
    example: 3,
  })
  @IsNumber()
  minutes: number;
}
