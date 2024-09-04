import { DynamicModule, Provider } from '@nestjs/common';
import { Logger } from '@ts-core/common';
import { Transport } from '@ts-core/common';
import { LedgerApiClient, LedgerMonitor, LedgerService } from './service';
import { DatabaseModule } from '@project/module/database';
import { INFO_URL, LedgerApiClient as CommonLedgerApiClient } from '@hlf-explorer/common';
import { LedgerDatabase } from '@hlf-explorer/monitor';
import { Connection } from 'typeorm';
import { LedgerBlockParseHandler } from './transport/handler';
import { LedgerObjectDetailsGetController } from './controller';

export class LedgerModule {
    // --------------------------------------------------------------------------
    //
    //  Public Static Methods
    //
    // --------------------------------------------------------------------------

    public static forRoot(settings: ILedgerModuleSettings): DynamicModule {
        let providers: Array<Provider> = [
            {
                provide: LedgerApiClient,
                inject: [Logger, Transport],
                useFactory: async (logger, transport) => {
                    let item = new LedgerApiClient(logger, transport, settings.ledgerEndpoint, settings.ledgerName);
                    item.logCommandFilters.push(item => item.name !== INFO_URL);
                    return item;
                },
            },
            {
                provide: LedgerDatabase,
                inject: [Logger, Connection],
                useFactory: async (logger, connection) => {
                    return new LedgerDatabase(logger, connection, settings.ledgerName);
                },
            },
            {
                provide: CommonLedgerApiClient,
                useExisting: LedgerApiClient
            },
            LedgerService,
            LedgerMonitor,

            LedgerBlockParseHandler
        ];

        return {
            module: LedgerModule,
            imports: [DatabaseModule],
            controllers: [LedgerObjectDetailsGetController],
            exports: [LedgerService, LedgerApiClient, LedgerMonitor],
            global: true,
            providers,
        };
    }
}

export interface ILedgerModuleSettings {
    ledgerName: string;
    ledgerEndpoint: string;
}
