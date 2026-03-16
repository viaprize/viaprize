import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Prize } from './prize.entity';

@Entity()
export class PrizesComments {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  comment: string;

  @Column({
    type: 'text',
    array: true,
    default: [],
  })
  likes: string[];

  @Column({
    type: 'text',
    array: true,
    default: [],
  })
  dislikes: string[];

  @CreateDateColumn({
    type: 'timestamp with time zone',
  })
  created_at: Date;

  @Column({ default: 0 })
  reply_count: number;

  @ManyToOne(
    () => PrizesComments,
    (parentComment) => parentComment.childComments,
    { nullable: true },
  )
  @JoinColumn({ name: 'parent_id' })
  parentComment: PrizesComments;

  @OneToMany(
    () => PrizesComments,
    (childComment) => childComment.parentComment,
  )
  childComments: PrizesComments[];

  @ManyToOne(() => User, (user) => user.prizeComments)
  @JoinColumn({ name: 'user', referencedColumnName: 'authId' })
  user: User;

  @ManyToOne(() => Prize, (prize) => prize.comments)
  prize: Prize;
}
