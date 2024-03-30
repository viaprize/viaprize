import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ExtraDonationPortalData {
  @PrimaryGeneratedColumn('increment')
  id: string;
  @Column('timestamptz')
  donatedAt: Date;
  @Column()
  donor: string;
  @Column()
  usdValue: number;
  @Column()
  externalId: string;
}
