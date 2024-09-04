import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUser1627121250010 implements MigrationInterface {
    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    public async up(queryRunner: QueryRunner): Promise<any> {
        const sql = `
            create table if not exists "user"
            (
                "id" serial not null 
                    constraint "user_id_pkey" primary key,
                "login" varchar not null 
                    constraint "user_login_ukey" unique,
                "ledger_uid" varchar not null
                    constraint "user_ledger_uid_ukey" unique,
                "company_id" integer 
                    constraint "user_company_id_fkey" references "company",
                "resource" varchar not null,
                "type" varchar not null,
                "status" varchar not null,
                "created_date" timestamp default now() not null,
                "updated_date" timestamp default now() not null
            );

            create table if not exists "user_preferences"
            (
                "id" serial not null 
                    constraint "user_preferences_id_pkey" primary key,
                "user_id" integer
                    constraint "user_preferences_user_id_key" unique
                    constraint "user_preferences_user_id_fkey" references "user",
                    
                "name" varchar not null,
                "uid" varchar 
                    constraint "user_preferences_uid_ukey" unique,

                "phone" varchar,
                "email" varchar,
                "locale" varchar,
                "picture" varchar,
                "birthday" timestamp,
                "description" varchar,
                "is_male" boolean,
                "location" varchar
            );

            create table if not exists "user_crypto_key"
            (                
                "id" serial not null
                    constraint "user_crypto_key_id_pkey" primary key,
                "status" varchar not null,
                "algorithm" varchar not null,
                "public_key" varchar not null,
                "private_key" varchar not null,

                "created_date" timestamp default now() not null,
                "updated_date" timestamp default now() not null,

                "user_id" integer
                    constraint "user_crypto_key_user_id_fkey" references "user"
            );
        `;
        await queryRunner.query(sql);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        const sql = `
            drop table if exists "user" cascade;
            drop table if exists "user_preferences" cascade;
            drop table if exists "user_crypto_key" cascade;
        `;
        await queryRunner.query(sql);
    }
}
