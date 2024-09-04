import { MigrationInterface, QueryRunner } from 'typeorm';

export class TerminalSubscription1627121250090 implements MigrationInterface {
    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    public async up(queryRunner: QueryRunner): Promise<any> {
        const sql = `
            create table if not exists "terminal_subscription"
            (                
                "id" serial not null
                    constraint "terminal_subscription_id_pkey" primary key,

                "user_id" integer not null
                    constraint "terminal_subscription_user_id_fkey" references "user",

                "terminal_id" integer not null
                    constraint "terminal_subscription_terminal_id_fkey" references "terminal",

                "is_subscribed" boolean not null,

                "created_date" timestamp default now() not null,
                "updated_date" timestamp default now() not null
            );
        `;
        await queryRunner.query(sql);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        const sql = `
            drop table if exists "terminal_subscription" cascade;
        `;
        await queryRunner.query(sql);
    }
}
