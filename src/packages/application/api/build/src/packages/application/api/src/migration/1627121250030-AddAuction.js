"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddAuction1627121250030 = void 0;
class AddAuction1627121250030 {
    async up(queryRunner) {
        const sql = `
            create table if not exists "auction"
            (
                "id" serial not null 
                    constraint "auction_id_pkey" primary key,
                "uid" varchar not null
                    constraint "auction_uid_ukey" unique,
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
            drop table if exists "auction" cascade;
            drop index if exists "auction_uid_ukey";
        `;
        await queryRunner.query(sql);
    }
}
exports.AddAuction1627121250030 = AddAuction1627121250030;
