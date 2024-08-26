import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddedProposalRejectionComment1704628842198
  implements MigrationInterface
{
  name = 'AddedProposalRejectionComment1704628842198';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "portal_proposals" ADD "rejectionComment" character varying NOT NULL DEFAULT ''`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "portal_proposals" DROP COLUMN "rejectionComment"`,
    );
  }
}
