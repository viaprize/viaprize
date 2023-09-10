import { Submission } from 'src/prizes/entities/submission.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  userId!: string;

  @Column()
  name: string;

  @OneToMany(() => Submission, (submission) => submission.user)
  submissions: Submission[];
}
