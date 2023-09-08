import { MigrationInterface, QueryRunner } from "typeorm";

export class First1694194463501 implements MigrationInterface {
    name = 'First1694194463501'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`pacts\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(255) NOT NULL, \`terms\` text NOT NULL, \`address\` varchar(42) NOT NULL, \`transactionHash\` varchar(66) NOT NULL, \`blockHash\` varchar(66) NULL, \`networkType\` enum ('testnet', 'mainnet') NULL, UNIQUE INDEX \`IDX_7433bf5dca67d517581cac9b7c\` (\`address\`, \`transactionHash\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user\` (\`id\` varchar(36) NOT NULL, \`address\` varchar(255) NOT NULL, UNIQUE INDEX \`IDX_3122b4b8709577da50e89b6898\` (\`address\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`prize_proposals\` (\`id\` varchar(36) NOT NULL, \`platform_reward\` int NULL, \`distributed\` tinyint NOT NULL DEFAULT 0, \`voting_time\` int NOT NULL, \`submission_time\` int NOT NULL, \`admins\` text NOT NULL, \`isApproved\` tinyint NOT NULL DEFAULT 0, \`description\` text NOT NULL, \`proposer_address\` varchar(255) NOT NULL, \`proficiencies\` text NOT NULL, \`priorities\` text NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`prize_proposals\``);
        await queryRunner.query(`DROP INDEX \`IDX_3122b4b8709577da50e89b6898\` ON \`user\``);
        await queryRunner.query(`DROP TABLE \`user\``);
        await queryRunner.query(`DROP INDEX \`IDX_7433bf5dca67d517581cac9b7c\` ON \`pacts\``);
        await queryRunner.query(`DROP TABLE \`pacts\``);
    }

}
