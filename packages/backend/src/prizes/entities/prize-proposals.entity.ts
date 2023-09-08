import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDate } from 'class-validator';
import { Entity, Column, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { Priority, Proficiency } from './types';

@Entity()
export class PrizeProposals {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ nullable: true })
  @Column({ nullable: true })
  platform_reward: number;

  @ApiProperty()
  @Column({ default: false })
  distributed: boolean;

  @ApiProperty()
  @Column()
  voting_time: number;

  @ApiProperty()
  @Column()
  submission_time: number;

  @ApiProperty({ type: 'array', items: { type: 'string' } })
  @Column('simple-array')
  admins: string[];

  /** The Columns here are not part of the smart contract */
  @ApiProperty()
  @Column({ default: false })
  isApproved: boolean;

  //This text is in markdown

  @ApiProperty()
  @Column('text')
  description: string;

  @ApiProperty()
  @IsBoolean()
  isAutomatic: boolean;

  @ApiProperty()
  @IsDate()
  @Column({ nullable: true })
  startVotingDate: Date;

  @ApiProperty()
  @IsDate()
  @Column({ nullable: true })
  startSubmissionDate: Date;

  @ApiProperty()
  @Column()
  proposer_address: string;

  @ApiProperty({ type: 'array', items: { type: 'string' } })
  @Column('simple-array')
  proficiencies: string[];

  @ApiProperty({ type: 'array', items: { type: 'string' } })
  @Column('simple-array')
  priorities: string[];
}
