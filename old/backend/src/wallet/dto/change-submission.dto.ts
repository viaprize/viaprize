import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class ChangeSubmissionDto {
  @ApiProperty({
    type: Number,
    description:
      'The number of minutes to change the submission by minutes from current time ',
    example: 3,
  })
  @IsNumber()
  minutes: number;
}
