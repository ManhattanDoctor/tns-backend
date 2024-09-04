import { Module } from '@nestjs/common';
import { DatabaseModule } from '@project/module/database';
import { LedgerModule } from '@project/module/ledger';
import { SharedModule } from '@project/module/shared';
import { CoinGetController, CoinBalanceListController, CoinBalanceGetController, CoinListController } from './controller';
import { CoinService } from './service';
import { CoinUpdateHandler, CoinBalanceUpdateHandler } from './transport/handler';

@Module({
    imports: [SharedModule, DatabaseModule, LedgerModule],
    controllers: [
        CoinGetController,
        CoinListController,
        CoinBalanceGetController,
        CoinBalanceListController
    ],
    providers: [
        CoinService,
        CoinUpdateHandler,
        CoinBalanceUpdateHandler,
    ]
})
export class CoinModule { }