import { IsDate } from 'class-validator';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PrizesComments } from './prizes-comments.entity';
import { Submission } from './submission.entity';

/* The Prize class represents a prize in a TypeScript application, with various properties such as
description, start dates, addresses, and arrays of admins, proficiencies, and priorities. */

export enum PrizeStages {
  NOT_STARTED = 'not started',
  SUMISSION_STARTED = 'submission started',
  SUBMISSION_ENDED = 'submission ended',
  VOTING_STARTED = 'voting started',
  VOTING_ENDED = 'voting ended',
  PRIZE_DISTRIBUTED = 'prize distributed',
  PRIZE_ENDED = 'prize ended',
}

@Entity()
export class Prize {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  description: string;

  @Column('boolean')
  isAutomatic: boolean;

  @Column()
  submissionTime: number;

  @Column()
  votingTime: number;

  @IsDate()
  @Column({ nullable: true })
  startVotingDate: Date;

  @IsDate()
  @Column({ nullable: true })
  startSubmissionDate: Date;

  @Column()
  proposer_address: string;

  @Column()
  contract_address: string;

  @Column('simple-array')
  admins: string[];

  @Column({
    type: 'text',
    array: true,
    nullable: true,
  })
  judges?: string[];

  @Column('simple-array')
  proficiencies: string[];

  @Column('simple-array')
  priorities: string[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column('simple-array')
  images: string[];

  @Column({ default: '' })
  title: string;

  @Column({ default: PrizeStages.NOT_STARTED, type: 'enum', enum: PrizeStages })
  stage: PrizeStages;

  @ManyToMany(() => User, (user) => user.id)
  @JoinTable()
  contestants: User[];

  @OneToMany(() => Submission, (submission) => submission.prize)
  submissions: Submission[];

  @OneToMany(() => PrizesComments, (prizeComment) => prizeComment.prize)
  comments?: PrizesComments[];

  @Column({
    unique: true,
    default: null,
    nullable: true,
  })
  @Index()
  slug: string;

  @ManyToOne(() => User, (user) => user.prizeProposals)
  @JoinColumn({ name: 'user', referencedColumnName: 'authId' })
  user: User;

  /* On Chain Data */
  // total_funds: number;
  // total_rewards: number;
  // platform_reward: number;
  // distributed: boolean;
}
