import { User } from "src/users/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Prize } from "./prize.entity";

@Entity()
export class PrizesComments {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    comment: string;

    @ManyToOne(() => User, (user) => user.prizeProposals)
    @JoinColumn({ name: 'user', referencedColumnName: 'authId' })
    user: User;

    @ManyToOne(() => Prize, (prize) => prize.comments)
    prize: Prize;
}