import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDate } from 'class-validator';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class PrizeProposals {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

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

  @ApiProperty({ type: 'string' })
  @Column({ default: '' })
  title: string;

  //This text is in markdown

  @ApiProperty()
  @Column('text')
  description: string;

  @ApiProperty()
  @IsBoolean()
  @Column({ nullable: true })
  isAutomatic: boolean;

  @ApiProperty()
  @IsDate()
  @Column({ nullable: true })
  startVotingDate: Date;

  @ApiProperty()
  @IsDate()
  @Column({ nullable: true })
  startSubmissionDate: Date;

  @ApiProperty({ type: 'array', items: { type: 'string' } })
  @Column('simple-array')
  proficiencies: string[];

  @ApiProperty({ type: 'array', items: { type: 'string' } })
  @Column('simple-array')
  priorities: string[];

  @ApiProperty({ type: 'array', items: { type: 'string' } })
  @Column('simple-array')
  images: string[];

  @ApiProperty({ type: 'string' })
  @ManyToOne(() => User, (user) => user.prizeProposals)
  @JoinColumn({ name: 'user', referencedColumnName: 'user_id' })
  user: User;
}
