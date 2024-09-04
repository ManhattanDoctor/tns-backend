import { Injectable } from '@nestjs/common';
import { map, takeUntil } from 'rxjs';
import { Logger, Transport, LoggerWrapper } from '@ts-core/common';
import * as _ from 'lodash';
import { NotifyCommand } from '../transport';
import { BillAddedEvent } from '@project/common/platform/api/transport';
import { Bill } from '@project/common/platform/bill';
import { DatabaseService } from '@project/module/database/service';
import { TerminalSubscriptionEntity } from '../../database/terminal';

@Injectable()
export class BillEventListener extends LoggerWrapper {
    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(logger: Logger, private transport: Transport, private database: DatabaseService) {
        super(logger);
        transport.getDispatcher<BillAddedEvent>(BillAddedEvent.NAME).pipe(map(event => event.data), takeUntil(this.destroyed)).subscribe(this.added);
    }

    // --------------------------------------------------------------------------
    //
    //  Event Handlers
    //
    // --------------------------------------------------------------------------

    private added = async (bill: Bill): Promise<void> => {
        let item = await this.database.billGet(bill.ledgerUid);
        if (await this.database.userIsSubscribed(item.userId, item.terminalId)) {
            this.transport.send(new NotifyCommand({ userId: item.userId, url: `https://cvartel.chainlab.ru/bill/${item.id}`, message: `You received invoice` }));
        }
    }

}