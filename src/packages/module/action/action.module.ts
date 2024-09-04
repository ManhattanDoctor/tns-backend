import { Module } from '@nestjs/common';
import { DatabaseModule } from '@project/module/database';
import { LedgerModule } from '@project/module/ledger';
import { SharedModule } from '@project/module/shared';
import { ActionListController } from './controller';

@Module({
    imports: [SharedModule, DatabaseModule, LedgerModule],
    controllers: [
        ActionListController,
    ],
})
export class ActionModule { }