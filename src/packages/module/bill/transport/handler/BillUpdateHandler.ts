import { Logger } from '@ts-core/common';
import { Injectable } from '@nestjs/common';
import { Transport, TransportCommandHandler } from '@ts-core/common';
import { DatabaseService } from '@project/module/database/service';
import { IBillUpdateDto, BillUpdateCommand } from '../BillUpdateCommand';
import * as _ from 'lodash';
import { BillGetCommand } from '@project/common/transport/command/bill';
import { LedgerApiClient } from '@project/module/ledger/service';
import { TransportSocket } from '@ts-core/socket-server';
import { BillEntity } from '@project/module/database/bill';
import { BillEditedEvent } from '@project/common/platform/api/transport';
import { TransformGroup } from '@project/module/database';
import { BillUtil } from '@project/common/platform/bill';

@Injectable()
export class BillUpdateHandler extends TransportCommandHandler<IBillUpdateDto, BillUpdateCommand> {

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(logger: Logger, transport: Transport, private database: DatabaseService, private api: LedgerApiClient, private socket: TransportSocket) {
        super(logger, transport, BillUpdateCommand.NAME);
    }

    // --------------------------------------------------------------------------
    //
    //  Protected Methods
    //
    // --------------------------------------------------------------------------

    protected async execute(params: IBillUpdateDto): Promise<void> {
        let item = await this.api.ledgerRequestSendListen(new BillGetCommand({ uid: params.uid }));
        await BillEntity.createQueryBuilder()
            .update(BillEntity.updateEntity({}, item))
            .where('ledgerUid = :ledgerUid', { ledgerUid: params.uid })
            .execute();

        let bill = await this.database.billGet(params.uid);
        this.socket.dispatch(new BillEditedEvent(bill.toObject({ groups: [TransformGroup.PUBLIC_DETAILS] })), { room: BillUtil.getRoom(bill.id) });
    }
}
