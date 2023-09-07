import { ApiProperty } from '@nestjs/swagger';

export class CreatePrizeProposalDto {
  @ApiProperty({
    type: Number,
    description: 'The number of seconds for the voting period.',
    example: 604800,
  })
  voting_time: number;

  @ApiProperty({
    type: Number,
    description: 'The number of seconds for the submission period.',
    example: 86400,
  })
  submission_time: number;

  @ApiProperty({
    type: Array,
    description: 'The list of admins for the proposal.',
    example: ['admin1', 'admin2'],
  })
  admins: string[];

  @ApiProperty({
    type: String,
    description: 'The description of the proposal.',
    example: 'This is a proposal for a new prize.',
  })
  description: string;

  @ApiProperty({
    type: String,
    description: 'The address of the proposer.',
    example: '0x1234567890abcdef',
  })
  proposer_address: string;

  @ApiProperty({
    type: Boolean,
    description: 'Whether the proposal is automatic or not.',
    example: true,
  })
  isAutomatic: boolean;

  @ApiProperty({
    type: Date,
    description: 'The start date of the voting period.',
    example: '2023-09-08',
  })
  startVotingDate: Date;

  @ApiProperty({
    type: Date,
    description: 'The start date of the submission period.',
    example: '2023-09-07',
  })
  startSubmissionDate: Date;
}
