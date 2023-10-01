import { PrizeProposals } from 'src/prizes/entities/prize-proposals.entity';
import { Submission } from 'src/prizes/entities/submission.entity';
import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  @Index({ unique: true })
  authId!: string;

  @Column()
  name: string;

  @Column({ unique: true })
  username: string;

  @Column({ default: false })
  isAdmin: boolean;

  @OneToMany(() => Submission, (submission) => submission.user)
  submissions: Submission[];

  @OneToMany(() => PrizeProposals, (prizeProposals) => prizeProposals.user)
  prizeProposals: PrizeProposals[];
}