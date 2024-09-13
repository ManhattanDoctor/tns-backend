import { Module } from '@nestjs/common';
import { DatabaseModule } from '@project/module/database';
import { HlfModule } from '@project/module/hlf';
import { ActionListController } from './controller';

@Module({
    imports: [DatabaseModule, HlfModule],
    controllers: [
        ActionListController,
    ],
})
export class ActionModule { }