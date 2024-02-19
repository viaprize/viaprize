import { PortalProposals } from 'src/portals/entities/portal-proposals.entity';
import { Portals } from 'src/portals/entities/portal.entity';
import { PortalsComments } from 'src/portals/entities/portals-comments';
import { PrizeProposals } from 'src/prizes/entities/prize-proposals.entity';
import { Prize } from 'src/prizes/entities/prize.entity';
import { PrizesComments } from 'src/prizes/entities/prizes-comments.entity';
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

  @Column({ default: '' })
  bio: string;

  @Column({ unique: true })
  @Index({ unique: true })
  authId!: string;

  @Column()
  name: string;

  @Column({ default: '' })
  avatar: string;

  @Column({ unique: true })
  username: string;

  @Column({ default: false })
  isAdmin: boolean;

  @Column('simple-array', { default: [] })
  proficiencies: string[];

  @Column('simple-array', { default: [] })
  priorities: string[];

  @Column({ nullable: true })
  walletAddress: string;

  @OneToMany(() => Submission, (submission) => submission.user)
  submissions: Submission[];

  @OneToMany(() => PrizeProposals, (prizeProposals) => prizeProposals.user)
  prizeProposals: PrizeProposals[];

  @OneToMany(() => PrizesComments, (prizeComment) => prizeComment.user)
  prizeComments: PrizesComments[];

  @OneToMany(() => PortalsComments, (portalComment) => portalComment.user)
  portalComments: PortalsComments[];

  @OneToMany(() => Prize, (prize) => prize.user)
  prizes: Prize[];

  @OneToMany(() => Portals, (portal) => portal.user)
  portals: Portals[];

  @OneToMany(() => PortalProposals, (portalProposals) => portalProposals.user)
  portalProposals: PortalProposals[];
}
