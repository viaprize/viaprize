import { Portals } from "src/portals/entities/portal.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class PortalIndex {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    jobId: number;

    @Column()
    contract_address: string;

    @Column()
    totalFunds: number;

    @Column()
    balance: number;

    @Column()
    totalRewards: number;

    @Column()
    isActive: boolean;

    @OneToOne(() => Portals)
    @JoinColumn()
    portal: number;
}

