import { ApiProperty } from '@nestjs/swagger';

export class CreateSubmissionDto {
  @ApiProperty({ description: 'Description of the submission', type: String })
  submissionDescription: string;

  @ApiProperty({
    description: 'Submission hashh is the hash of address + userId + prizeId',
  })
  submissionHash: string;
  @ApiProperty({ description: 'Wallet Address of submistters' })
  submitterAddress: string;
}
