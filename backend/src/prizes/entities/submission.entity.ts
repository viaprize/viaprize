import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Prize } from './prize.entity';

@Entity()
export class Submission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'json' })
  submissionDescription: string;

  @Column()
  submissionHash: string;

  @Column()
  submitterAddress: string;

  @ManyToOne(() => User, (user) => user.submissions)
  user: User;

  @ManyToOne(() => Prize, (prize) => prize.submissions)
  prize: Prize;
}
