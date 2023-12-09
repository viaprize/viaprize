import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

/* The Prize class represents a prize in a TypeScript application, with various properties such as
description, start dates, addresses, and arrays of admins, proficiencies, and priorities. */
@Entity()
export class PortalProposals {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  description: string;

  @Column('varchar', {
    unique: true,
  })
  slug: string;

  @Column('decimal', { nullable: true })
  fundingGoal: number;

  @Column('boolean')
  isMultiSignatureReciever: boolean;

  @Column({ nullable: true })
  deadline: Date;

  @Column({ default: false })
  sendImmediately: boolean;

  @Column('boolean')
  allowDonationAboveThreshold: boolean;

  @Column('text')
  termsAndCondition: string;

  @Column()
  proposerAddress: string;

  @Column('simple-array')
  treasurers: string[];

  @Column('simple-array')
  tags: string[];

  @Column({ default: false })
  isApproved: boolean;

  @Column({ default: false })
  isRejected: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column('simple-array')
  images: string[];

  @Column({ default: '' })
  title: string;

  @ManyToOne(() => User, (user) => user.portals)
  @JoinColumn({ name: 'user', referencedColumnName: 'authId' })
  user: User;
}
