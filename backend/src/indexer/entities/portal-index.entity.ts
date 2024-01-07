import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class PortalIndex {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    jobId: number;

    @Column()
    contract_address: string;

    @Column('bigint')
    totalFunds: number;

    @Column('bigint')
    balance: number;

    @Column('bigint')
    totalRewards: number;

    @Column()
    isActive: boolean;
}

