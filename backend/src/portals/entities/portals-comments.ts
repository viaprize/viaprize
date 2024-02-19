import { User } from "src/users/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Portals } from "./portal.entity";

@Entity()
export class PortalsComments {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    comment: string;

    @ManyToOne(() => User, (user) => user.portalComments)
    @JoinColumn({ name: 'user', referencedColumnName: 'authId' })
    user: User;

    @ManyToOne(() => Portals, (portals) => portals.comments)
    portal: Portals;
}