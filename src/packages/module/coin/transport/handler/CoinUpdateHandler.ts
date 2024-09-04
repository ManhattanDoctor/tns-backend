import { Logger } from '@ts-core/common';
import { Injectable } from '@nestjs/common';
import { Transport, TransportCommandHandler } from '@ts-core/common';
import { ICoinUpdateDto, CoinUpdateCommand } from '../CoinUpdateCommand';
import * as _ from 'lodash';
import { LedgerApiClient } from '@project/module/ledger/service';
import { CoinGetCommand } from '@project/common/transport/command/coin';
import { CoinEntity } from '@project/module/database/coin';

@Injectable()
export class CoinUpdateHandler extends TransportCommandHandler<ICoinUpdateDto, CoinUpdateCommand> {

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(logger: Logger, transport: Transport, private api: LedgerApiClient) {
        super(logger, transport, CoinUpdateCommand.NAME);
    }

    // --------------------------------------------------------------------------
    //
    //  Protected Methods
    //
    // --------------------------------------------------------------------------

    protected async execute(params: ICoinUpdateDto): Promise<void> {
        let coin = await this.api.ledgerRequestSendListen(new CoinGetCommand({ uid: params.uid }));
        let item = CoinEntity.updateEntity({}, coin);

        let query = CoinEntity.createQueryBuilder().update(item).where('ledgerUid = :ledgerUid', { ledgerUid: params.uid });
        await query.execute();
    }
}
