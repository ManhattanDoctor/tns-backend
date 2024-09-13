"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddUserRole1627121250030 = void 0;
class AddUserRole1627121250030 {
    async up(queryRunner) {
        const sql = `
            create table if not exists "user_role"
            (                
                "id" serial not null
                    constraint "user_role_id_pkey" primary key,
                "name" varchar not null,

                "created_date" timestamp default now() not null,
                "updated_date" timestamp default now() not null,

                "user_id" integer
                    constraint "user_role_user_id_fkey" references "user",
                "company_id" integer
                    constraint "user_role_company_id_fkey" references "company"
            );

            create unique index "user_role_ukey_name_user_id_company_id" on "user_role" (name, user_id, company_id);
        `;
        await queryRunner.query(sql);
    }
    async down(queryRunner) {
        const sql = `
            drop table if exists "user_role" cascade;
            drop index if exists "user_role_ukey_name_user_id_company_id";
        `;
        await queryRunner.query(sql);
    }
}
exports.AddUserRole1627121250030 = AddUserRole1627121250030;
