import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1706534204356 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const [result] = await queryRunner.query(
      'SELECT count(id) FROM scooter_type',
    );

    if (result.count === '0') {
      await queryRunner.query(`
        INSERT INTO scooter_type (describe, code) VALUES
          ('大型重型機車(紅牌)', 'R-LH'),
          ('大型重型機車(黃牌)', 'Y-LH'),
          ('普通重型機車', 'OH'),
          ('普通輕型機車', 'OL');
      `);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DELETE FROM scooter_type
      WHERE code IN ('R-LH', 'Y-LH', 'OH', 'OL');
    `);
  }
}
