import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCompany1627121250000 implements MigrationInterface {
    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    public async up(queryRunner: QueryRunner): Promise<any> {
        const sql = `
            create table if not exists "company"
            (
                "id" serial not null 
                    constraint "company_id_pkey" primary key,
                "ledger_uid" varchar not null
                    constraint "company_ledger_uid_ukey" unique,
                
                "status" varchar not null,
                "roles_total" json not null,
                "created_date" timestamp default now() not null,
                "updated_date" timestamp default now() not null
            );

            create table if not exists "company_preferences"
            (
                "id" serial not null 
                    constraint "company_preferences_id_pkey" primary key,
                "company_id" integer
                    constraint "company_preferences_company_id_key" unique
                    constraint "company_preferences_company_id_fkey" references "company",

                "title" varchar not null,
                "picture" varchar not null,
                "description" varchar not null
            );
        `;
        await queryRunner.query(sql);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        const sql = `
            drop table if exists "company" cascade;
            drop table if exists "company_roles" cascade;
            drop table if exists "company_preferences" cascade;
        `;
        await queryRunner.query(sql);
    }
}
