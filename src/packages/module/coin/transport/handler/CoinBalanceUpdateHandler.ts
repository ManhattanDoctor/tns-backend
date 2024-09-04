import { Logger } from '@ts-core/common';
import { Injectable } from '@nestjs/common';
import { Transport, TransportCommandHandler } from '@ts-core/common';
import { DatabaseService } from '@project/module/database/service';
import { ICoinBalanceUpdateDto, CoinBalanceUpdateCommand } from '../CoinBalanceUpdateCommand';
import * as _ from 'lodash';
import { CoinObjectBalanceGetCommand } from '@project/common/transport/command/coin';
import { LedgerApiClient } from '@project/module/ledger/service';
import { CoinBalanceEntity, CoinEntity } from '@project/module/database/coin';
import { TransportSocket } from '@ts-core/socket-server';
import { CoinBalanceEditedEvent } from '@project/common/platform/api/transport';
import { CoinUtil } from '@project/common/platform/coin';

@Injectable()
export class CoinBalanceUpdateHandler extends TransportCommandHandler<ICoinBalanceUpdateDto, CoinBalanceUpdateCommand> {

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(logger: Logger, transport: Transport, private database: DatabaseService, private api: LedgerApiClient, private socket: TransportSocket) {
        super(logger, transport, CoinBalanceUpdateCommand.NAME);
    }

    // --------------------------------------------------------------------------
    //
    //  Protected Methods
    //
    // --------------------------------------------------------------------------

    protected async execute(params: ICoinBalanceUpdateDto): Promise<void> {
        let balance = await this.api.ledgerRequestSendListen(new CoinObjectBalanceGetCommand({ objectUid: params.uid, coinUid: params.coinUid }));

        let item = await this.database.coinBalanceGet(params.coinUid, params.uid);
        if (_.isNil(item)) {
            item = new CoinBalanceEntity();
            item.coin = await CoinEntity.findOneByOrFail({ ledgerUid: params.coinUid });
            item.ledgerUid = params.uid;
        }
        CoinBalanceEntity.updateEntity(item, balance);
        item = await item.save();

        this.socket.dispatch(new CoinBalanceEditedEvent(item.toObject()), { room: CoinUtil.getCoinBalanceRoom(params.uid) });
    }
}
