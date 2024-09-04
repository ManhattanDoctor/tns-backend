import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAction1627121250070 implements MigrationInterface {
    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    public async up(queryRunner: QueryRunner): Promise<any> {
        const sql = `
            create table if not exists "action"
            (                
                "id" serial not null
                    constraint "action_id_pkey" primary key,
                "date" timestamp not null,
                "uid" varchar not null,
                "type" varchar not null,
                "request_id" varchar not null,
                "object_uid" varchar not null,
                "initiator_uid" varchar not null,
                "is_executed" boolean not null,

                "bill_uid" varchar,
                "user_uid" varchar,
                "coin_uid" varchar,
                "company_uid" varchar,
                "terminal_uid" varchar,
                "decimals" integer,

                "amount" varchar
            );

            create unique index "action_ukey_uid" on "action" (uid);
        `;
        await queryRunner.query(sql);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        const sql = `
            drop table if exists "action" cascade;
            drop index if exists "action_ukey_uid";
        `;
        await queryRunner.query(sql);
    }
}
