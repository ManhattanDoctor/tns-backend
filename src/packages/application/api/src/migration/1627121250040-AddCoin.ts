import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCoin1627121250040 implements MigrationInterface {
    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    public async up(queryRunner: QueryRunner): Promise<any> {
        const sql = `
            create table if not exists "coin"
            (                
                "id" serial not null
                    constraint "coin_id_pkey" primary key,
                "coin_id" varchar not null,
                "decimals" integer not null,

                "held" varchar not null,
                "total" varchar not null,
                "in_use" varchar not null,
                "burned" varchar not null,
                "emitted" varchar not null,
                
                "company_id" integer
                    constraint "coin_company_id_fkey" references "company",

                "ledger_uid" varchar not null
                    constraint "coin_ledger_uid_ukey" unique,

                "created_date" timestamp default now() not null,
                "updated_date" timestamp default now() not null
            );

            create table if not exists "coin_balance"
            (                
                "id" serial not null
                    constraint "coin_balance_id_pkey" primary key,
    
                "coin_id" integer
                    constraint "coin_balance_coin_id_fkey" references "coin",

                "ledger_uid" varchar not null,

                "held" varchar not null,
                "total" varchar not null,
                "in_use" varchar not null,

                "created_date" timestamp default now() not null,
                "updated_date" timestamp default now() not null
            );

            create unique index "coin_balance_ukey_coin_id_ledger_uid" on "coin_balance" (coin_id, ledger_uid);
        `;
        await queryRunner.query(sql);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        const sql = `
            drop table if exists "coin" cascade;
            drop table if exists "coin_balance" cascade;
            drop index if exists "coin_balance_ukey_coin_id_ledger_uid";
        `;
        await queryRunner.query(sql);
    }
}
