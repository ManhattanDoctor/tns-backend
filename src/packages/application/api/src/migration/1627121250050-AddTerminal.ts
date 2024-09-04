import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTerminal1627121250050 implements MigrationInterface {
    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    public async up(queryRunner: QueryRunner): Promise<any> {
        const sql = `
            create table if not exists "terminal"
            (
                "id" serial not null 
                    constraint "terminal_id_pkey" primary key,

                "ledger_uid" varchar not null
                    constraint "terminal_ledger_uid_ukey" unique,

                "company_id" integer not null
                    constraint "terminal_company_id_fkey" references "company",
                    
                "status" varchar not null,
                "description" varchar not null,
                "created_date" timestamp default now() not null,
                "updated_date" timestamp default now() not null
            );

            create table if not exists "terminal_crypto_key"
            (                
                "id" serial not null
                    constraint "terminal_crypto_key_id_pkey" primary key,
                "status" varchar not null,
                "algorithm" varchar not null,
                "public_key" varchar not null,
                "private_key" varchar not null,

                "created_date" timestamp default now() not null,
                "updated_date" timestamp default now() not null,

                "terminal_id" integer
                    constraint "terminal_crypto_key_terminal_id_fkey" references "terminal"
            );
        `;
        await queryRunner.query(sql);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        const sql = `
            drop table if exists "terminal" cascade;
        `;
        await queryRunner.query(sql);
    }
}
