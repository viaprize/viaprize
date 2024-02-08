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
export class Portals {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  description: string;

  @Column('varchar', {
    unique: true,
  })
  slug: string;

  @Column()
  sendImmediately: boolean;

  @Column('decimal', { nullable: true })
  fundingGoal?: string;

  @Column('decimal', { nullable: true })
  fundingGoalWithPlatformFee?: string;

  @Column('boolean')
  isMultiSignatureReciever: boolean;

  @Column('timestamptz', { nullable: true })
  deadline: Date;

  @Column('boolean')
  allowDonationAboveThreshold: boolean;

  @Column('text')
  termsAndCondition: string;

  @Column()
  proposer_address: string;

  @Column()
  contract_address: string;

  @Column('simple-array')
  treasurers: string[];

  @Column('simple-array')
  tags: string[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column('simple-array')
  images: string[];

  @Column({ default: '' })
  title: string;

  @Column({
    type: "text",
    array: true,
    nullable: true,
  })
  updates?: string[]

  @ManyToOne(() => User, (user) => user.portals)
  @JoinColumn({ name: 'user', referencedColumnName: 'authId' })
  user: User;
}
