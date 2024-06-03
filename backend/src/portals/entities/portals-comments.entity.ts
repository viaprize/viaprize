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
import { Portals } from './portal.entity';

@Entity()
export class PortalsComments {
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

  // Define self-referencing parent-child relationship
  @ManyToOne(
    () => PortalsComments,
    (parentComment) => parentComment.childComments,
    { nullable: true },
  )
  @JoinColumn({ name: 'parent_id' })
  parentComment: PortalsComments;

  @OneToMany(
    () => PortalsComments,
    (childComment) => childComment.parentComment,
  )
  childComments: PortalsComments[];

  @ManyToOne(() => User, (user) => user.portalComments)
  @JoinColumn({ name: 'user', referencedColumnName: 'authId' })
  user: User;

  @ManyToOne(() => Portals, (portals) => portals.comments)
  portal: Portals;
}
