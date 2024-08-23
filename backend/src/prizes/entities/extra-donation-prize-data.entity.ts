import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class ExtraDonationPrizeData {
  @PrimaryGeneratedColumn('increment')
  id: string;
  @CreateDateColumn()
  donationTime: Date;
  @Column()
  donor: string;
  @Column({ type: 'decimal' })
  value: number;
  @Column()
  valueIn: string;
  @Column()
  externalId: string;
}
