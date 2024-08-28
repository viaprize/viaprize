import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ExtraPrize {
  @PrimaryGeneratedColumn('increment')
  id: string;
  @Column({ type: 'decimal' })
  fundsUsd: number;

  @Column({ type: 'decimal' })
  fundsInBtc: number;

  @Column({ type: 'decimal' })
  fundsInEth: number;

  @Column({ type: 'decimal' })
  fundsInSol: number;

  @Column()
  externalId: string;
}
