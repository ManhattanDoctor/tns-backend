import { Injectable } from '@nestjs/common';
import { Transport, Logger, PromiseHandler } from '@ts-core/common';
import { LedgerApiClient } from './LedgerApiClient';
import * as _ from 'lodash';
import { LedgerMonitor as CommonLedgerMonitor, LedgerDatabase } from '@hlf-explorer/monitor';

@Injectable()
export class LedgerMonitor extends CommonLedgerMonitor {
    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(logger: Logger, transport: Transport, database: LedgerDatabase, api: LedgerApiClient) {
        super(logger, transport, database, api);
    }

    // --------------------------------------------------------------------------
    //
    //  Protected Methods
    //
    // --------------------------------------------------------------------------

    protected async blocksParse(items: Array<number>): Promise<void> {
        for (let number of items) {
            await super.blocksParse([number]);
            await PromiseHandler.delay(1000);
        }
    }
}

