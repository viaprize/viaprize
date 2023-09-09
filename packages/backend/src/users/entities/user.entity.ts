import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ unique: true })
  address: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  userId!: string;
}
