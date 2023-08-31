import { Entity, PrimaryGeneratedColumn, Column, Unique } from 'typeorm';

@Entity('pacts')
@Unique(['address', 'transactionHash'])
export class PactEntity {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text' })
  terms: string;

  @Column({ type: 'varchar', length: 42 })
  address: string;

  @Column({ type: 'varchar', length: 66 })
  transactionHash: string;

  @Column({ type: 'varchar', length: 66, nullable: true })
  blockHash: string;
  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    enum: ['testnet', 'mainnet'],
  })
  networkType: string;
}
