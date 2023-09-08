import { Column, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDate } from 'class-validator';
import { CreateDateColumn, UpdateDateColumn } from 'typeorm';
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

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;

  /* On Chain Data */
  total_funds: number;
  total_rewards: number;
  platform_reward: number;
  distributed: boolean;
}
