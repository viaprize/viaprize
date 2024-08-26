import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ExtraPrize {
  @PrimaryGeneratedColumn('increment')
  id: string;
  @Column()
  fundsUsd: number;

  @Column()
  fundsInBtc: number;

  @Column()
  fundsInEth: number;

  @Column()
  fundsInSol: number;

  @Column()
  externalId: string;
}
