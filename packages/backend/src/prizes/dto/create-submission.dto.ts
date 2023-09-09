import { ApiProperty } from '@nestjs/swagger';

export class CreateSubmissionDto {
  @ApiProperty({ description: 'Title of the submission', type: String })
  submissionTitle: string;

  @ApiProperty({ description: 'Description of the submission', type: String })
  submissionDescription: string;
}
