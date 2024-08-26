import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ExtraDonationPrizeData {
  @PrimaryGeneratedColumn('increment')
  id: string;
  @Column('timestamptz')
  donatedAt: Date;
  @Column()
  donor: string;
  @Column()
  value: number;
  @Column()
  valueIn: string;
  @Column()
  externalId: string;
}
