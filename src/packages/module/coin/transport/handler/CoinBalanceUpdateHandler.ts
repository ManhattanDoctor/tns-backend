import { Injectable } from '@nestjs/common';
import { Logger, Transport, TransportCommandHandler } from '@ts-core/common';
import { DatabaseService } from '@project/module/database/service';
import { ICoinBalanceUpdateDto, CoinBalanceUpdateCommand } from '../CoinBalanceUpdateCommand';
import { TransportSocket } from '@ts-core/socket-server';
import { CoinBalanceEntity, CoinEntity } from '@project/module/database/entity';
import { CoinBalanceGetCommand } from '@project/common/hlf/auction/transport';
import { CoinBalanceChangedEvent } from '@project/common/platform/transport';
import { getCoinBalanceRoom } from '@project/common/platform';
import { HlfService } from '@project/module/hlf/service';
import * as _ from 'lodash';

@Injectable()
export class CoinBalanceUpdateHandler extends TransportCommandHandler<ICoinBalanceUpdateDto, CoinBalanceUpdateCommand> {

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(logger: Logger, transport: Transport, private database: DatabaseService, private hlf: HlfService, private socket: TransportSocket) {
        super(logger, transport, CoinBalanceUpdateCommand.NAME);
    }

    // --------------------------------------------------------------------------
    //
    //  Protected Methods
    //
    // --------------------------------------------------------------------------

    protected async execute(params: ICoinBalanceUpdateDto): Promise<void> {
        let balance = await this.hlf.sendListen(new CoinBalanceGetCommand({ objectUid: params.uid, coinUid: params.coinUid }));

        let item = await this.database.coinBalanceGet(params.uid, params.coinUid);
        if (_.isNil(item)) {
            item = new CoinBalanceEntity();
            item.uid = params.uid;
            
            let { id, uid, decimals } = await CoinEntity.findOneByOrFail({ uid: params.coinUid });
            item.coinId = id;
            item.coinUid = uid;
            item.decimals = decimals;
        }
        item = await CoinBalanceEntity.updateEntity(item, balance).save();
        this.socket.dispatch(new CoinBalanceChangedEvent(item.toObject()), { room: getCoinBalanceRoom(params.uid) });
    }
}
