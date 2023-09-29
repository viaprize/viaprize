
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity()
export class PrizeProposals {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  voting_time: number;
  @Column()
  submission_time: number;
  @Column('simple-array')
  admins: string[];

  /** The Columns here are not part of the smart contract */

  @Column({ default: false })
  isApproved: boolean;

  @Column({ default: '' })
  title: string;

  //This text is in markdown

  @Column('text')
  description: string;

  @Column({ nullable: true })
  isAutomatic: boolean;

  @Column({ nullable: true })
  startVotingDate: Date;

  @Column({ nullable: true })
  startSubmissionDate: Date;

  @Column('simple-array')
  proficiencies: string[];

  @Column('simple-array')
  priorities: string[];

  @Column('simple-array')
  images: string[];

  @ManyToOne(() => User, (user) => user.prizeProposals)
  @JoinColumn({ name: 'user', referencedColumnName: 'authId' })
  user: User;
}
