import { Module } from '@nestjs/common';
import { DatabaseModule } from '@project/module/database';
import { CoinGetController, CoinBalanceListController, CoinBalanceGetController, CoinListController } from './controller';
import { CoinUpdateHandler, CoinBalanceUpdateHandler } from './transport/handler';
import { HlfModule } from '@project/module/hlf';

@Module({
    imports: [DatabaseModule, HlfModule],
    controllers: [
        CoinGetController,
        CoinListController,
        CoinBalanceGetController,
        CoinBalanceListController
    ],
    providers: [
        CoinUpdateHandler,
        CoinBalanceUpdateHandler,
    ]
})
export class CoinModule { }