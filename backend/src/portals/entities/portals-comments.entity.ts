import { User } from 'src/users/entities/user.entity';
import {
  Column,
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
    default: '',
  })
  likes: string[];

  @Column({
    type: 'text',
    array: true,
    default: '',
  })
  dislikes: string[];

  // Define self-referencing parent-child relationship
  @ManyToOne(
    () => PortalsComments,
    (parentComment) => parentComment.childComments,
    { nullable: true },
  )
  @JoinColumn({ name: 'parent_comment_id' })
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
