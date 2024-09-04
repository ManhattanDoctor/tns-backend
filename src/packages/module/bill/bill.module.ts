import { Module } from '@nestjs/common';
import { DatabaseModule } from '@project/module/database';
import { LedgerModule } from '@project/module/ledger';
import { SharedModule } from '@project/module/shared';
import { BillUpdateHandler } from './transport/handler';
import { BillAddController, BillEditController, BillGetController, BillListController, } from './controller';
import { SocketModule } from '@project/module/socket';

@Module({
    imports: [SharedModule, DatabaseModule, LedgerModule, SocketModule],
    controllers: [
        BillGetController,
        BillAddController,
        BillEditController,
        BillListController,
    ],
    providers: [
        BillUpdateHandler,
    ]
})
export class BillModule { }