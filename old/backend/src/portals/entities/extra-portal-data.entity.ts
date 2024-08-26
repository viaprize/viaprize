import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ExtraPortal {
  @PrimaryGeneratedColumn('increment')
  id: string;
  @Column()
  funds: number;

  @Column()
  externalId: string;
}
