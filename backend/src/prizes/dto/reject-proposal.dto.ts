import { ApiProperty } from '@nestjs/swagger';

export class RejectProposalDto {
  @ApiProperty({ description: 'Title of the submission', type: String })
  comment: string;
}
