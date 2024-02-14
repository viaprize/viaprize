import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Priority, Proficiency } from '../entities/types';

export class CreatePrizeProposalDto {
  @ApiProperty({
    type: Number,
    description: 'The number of seconds for the voting period.',
    example: 604800,
  })
  @IsNumber()
  voting_time: number;

  @ApiProperty({
    type: Number,
    description: 'The number of seconds for the submission period.',
    example: 86400,
  })
  @IsNumber()
  submission_time: number;

  @ApiProperty({
    type: Array,
    description: 'The list of admins for the proposal.',
    example: ['admin1', 'admin2'],
  })
  @IsArray()
  admins: string[];

  @ApiProperty({
    type: String,
    description: 'TItle of the proposal',
    example: 'Hackzuzalu',
  })
  @IsString()
  title: string;

  @ApiProperty({
    type: String,
    description: 'The description of the proposal.',
    example: 'This is a proposal for a new prize.',
  })
  @IsString()
  description: string;

  @ApiProperty({
    type: String,
    description: 'The address of the proposer.',
    example: '0x1234567890abcdef',
  })
  @IsString()
  proposer_address: string;

  @ApiProperty({
    type: Boolean,
    description: 'Whether the proposal is automatic or not.',
    example: true,
  })
  @IsBoolean()
  isAutomatic: boolean;

  @ApiProperty({
    type: Date,
    description: 'The start date of the voting period.',
    example: '2023-09-10T17:20:50.756Z',
    nullable: true,
  })
  @IsDateString()
  @IsOptional()
  startVotingDate?: Date;

  @ApiProperty({
    type: Date,
    description: 'The start date of the submission period.',
    example: '2023-09-10T17:20:50.756Z',
    nullable: true,
  })
  @IsDateString()
  @IsOptional()
  startSubmissionDate?: Date;

  @ApiProperty({ type: [String], example: ['Programming'] })
  @IsArray()
  proficiencies: Proficiency[];

  @ApiProperty({ type: [String], example: ['Climate change'] })
  @IsArray()
  priorities: Priority[];

  @ApiProperty({
    type: [String],
    example: [
      'https://ipfs.io/ipfs/QmZ1X2Y3Z4A5B6C7D8E9F0G1H2I3J4K5L6M7N8O9P0Q1R2S3T4U5V6W7X8Y9Z0',
    ],
  })
  @IsArray()
  images: string[];

  @ApiProperty({
    type: [String],
  })
  @IsArray()
  @IsOptional()
  judges?: string[];

  // @ApiProperty({ type: 'string' })
  // @IsString()
  // user: User;
}
