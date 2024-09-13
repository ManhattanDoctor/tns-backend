"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddAction1627121250070 = void 0;
class AddAction1627121250070 {
    async up(queryRunner) {
        const sql = `
            create table if not exists "action"
            (                
                "id" serial not null
                    constraint "action_id_pkey" primary key,
                "uid" varchar not null
                    constraint "action_uid_ukey" unique,
                "date" timestamp not null,
                "type" varchar not null,
                "request_id" varchar not null,
                "object_uid" varchar not null,
                "is_executed" boolean not null,
                "initiator_uid" varchar not null,

                "user_uid" varchar,
                "coin_uid" varchar,
                "auction_uid" varchar,
                "nickname_uid" varchar,

                "amount" varchar,
                "decimals" integer
            );
        `;
        await queryRunner.query(sql);
    }
    async down(queryRunner) {
        const sql = `
            drop table if exists "action" cascade;
            drop index if exists "action_uid_ukey";
        `;
        await queryRunner.query(sql);
    }
}
exports.AddAction1627121250070 = AddAction1627121250070;
