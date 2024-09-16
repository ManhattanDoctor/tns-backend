import { DynamicModule, Provider } from '@nestjs/common';
import { Logger } from '@ts-core/common';
import { Transport } from '@ts-core/common';
import { Connection } from 'typeorm';
import { HlfApiClient, HlfMonitor, HlfService } from './service';
import { DatabaseModule } from '@project/module/database';
import { INFO_URL, LedgerApiClient } from '@hlf-explorer/common';
import { LedgerDatabase, LedgerMonitor } from '@hlf-explorer/monitor';
import { HlfBlockParseHandler } from './transport/handler';
import { HlfObjectDetailsGetController } from './controller';

export class HlfModule {
    // --------------------------------------------------------------------------
    //
    //  Public Static Methods
    //
    // --------------------------------------------------------------------------

    public static forRoot(settings: IHlfModuleSettings): DynamicModule {
        let providers: Array<Provider> = [
            {
                provide: HlfApiClient,
                inject: [Logger, Transport],
                useFactory: async (logger) => {
                    let item = new HlfApiClient(logger, settings.endpoint, settings.name);
                    item.logCommandFilters.push(item => item.name !== INFO_URL);
                    return item;
                },
            },
            {
                provide: LedgerDatabase,
                inject: [Logger, Connection],
                useFactory: async (logger, connection) => {
                    return new LedgerDatabase(logger, connection, settings.name);
                },
            },
            {
                provide: LedgerApiClient,
                useExisting: HlfApiClient
            },
            {
                provide: LedgerMonitor,
                useExisting: HlfMonitor
            },
            HlfMonitor,
            HlfService,
            HlfBlockParseHandler
        ];

        return {
            module: HlfModule,
            imports: [DatabaseModule],
            controllers: [HlfObjectDetailsGetController],
            exports: [HlfService],
            global: true,
            providers,
        };
    }
}

export interface IHlfModuleSettings {
    name: string;
    endpoint: string;
}
