import { MigrationInterface, QueryRunner } from "typeorm";
export declare class Backend1694514918829 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
