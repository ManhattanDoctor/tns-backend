"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddNickname1627121250040 = void 0;
class AddNickname1627121250040 {
    async up(queryRunner) {
        const sql = `
            create table if not exists "nickname"
            (
                "id" serial not null 
                    constraint "nickname_id_pkey" primary key,
                "uid" varchar not null
                    constraint "nickname_uid_ukey" unique,
                "type" varchar not null,
                "price" json not null,
                "status" varchar not null,
                "expired" timestamp not null,
                "nickname" varchar not null,
                "bidder_uid" varchar,
                "parent_uid" varchar,
                "initiator_uid" varchar,
                "created" timestamp default now() not null,
                "updated" timestamp default now() not null
            );
        `;
        await queryRunner.query(sql);
    }
    async down(queryRunner) {
        const sql = `
            drop table if exists "nickname" cascade;
            drop index if exists "nickname_uid_ukey";
        `;
        await queryRunner.query(sql);
    }
}
exports.AddNickname1627121250040 = AddNickname1627121250040;
