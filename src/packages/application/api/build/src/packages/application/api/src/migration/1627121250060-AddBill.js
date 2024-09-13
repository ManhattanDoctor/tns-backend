"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddBill1627121250060 = void 0;
class AddBill1627121250060 {
    async up(queryRunner) {
        const sql = `
            create table if not exists "bill"
            (
                "id" serial not null 
                    constraint "bill_id_pkey" primary key,

                "ledger_uid" varchar not null
                    constraint "bill_ledger_uid_ukey" unique,

                "company_id" integer not null
                    constraint "bill_company_id_fkey" references "company",
                    
                "user_id" integer not null
                    constraint "bill_user_id_fkey" references "user",
                    
                "coin_id" integer not null
                    constraint "bill_coin_id_fkey" references "coin",
                    
                "terminal_id" integer not null
                    constraint "bill_terminal_id_fkey" references "terminal",

                "amount" numeric not null,
                "status" varchar not null,
                "description" varchar not null,
                "created_date" timestamp default now() not null,
                "updated_date" timestamp default now() not null
            );
        `;
        await queryRunner.query(sql);
    }
    async down(queryRunner) {
        const sql = `
            drop table if exists "bill" cascade;
        `;
        await queryRunner.query(sql);
    }
}
exports.AddBill1627121250060 = AddBill1627121250060;
