import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDate } from 'class-validator';
import { CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Submission } from './submission.entity';

@Entity()
export class Prize {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column('text')
  description: string;

  @ApiProperty()
  @IsBoolean()
  isAutomatic: boolean;

  @ApiProperty()
  @IsDate()
  @Column({ nullable: true })
  startVotingDate: Date;

  @ApiProperty()
  @IsDate()
  @Column({ nullable: true })
  startSubmissionDate: Date;

  @ApiProperty()
  @Column()
  proposer_address: string;

  @ApiProperty()
  @Column()
  contract_address: string;

  @ApiProperty({ type: 'string', items: { type: 'string' } })
  @Column('simple-array')
  admins: string[];
  @ApiProperty({ type: 'array', items: { type: 'string' } })
  @Column('simple-array')
  proficiencies: string[];

  @ApiProperty({ type: 'array', items: { type: 'string' } })
  @Column('simple-array')
  priorities: string[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => Submission, (submission) => submission.prize)
  submissions: Submission[];

  /* On Chain Data */
  // total_funds: number;
  // total_rewards: number;
  // platform_reward: number;
  // distributed: boolean;
}
