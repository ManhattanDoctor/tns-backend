import { Injectable } from '@nestjs/common';
import { Logger, Transport, TransportCommandHandler } from '@ts-core/common';
import { ICoinUpdateDto, CoinUpdateCommand } from '../CoinUpdateCommand';
import { CoinGetCommand } from '@project/common/hlf/auction/transport';
import { CoinEntity } from '@project/module/database/entity';
import { HlfService } from '@project/module/hlf/service';
import * as _ from 'lodash';

@Injectable()
export class CoinUpdateHandler extends TransportCommandHandler<ICoinUpdateDto, CoinUpdateCommand> {

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(logger: Logger, transport: Transport, private hlf: HlfService) {
        super(logger, transport, CoinUpdateCommand.NAME);
    }

    // --------------------------------------------------------------------------
    //
    //  Protected Methods
    //
    // --------------------------------------------------------------------------

    protected async execute(params: ICoinUpdateDto): Promise<void> {
        let coin = await this.hlf.sendListen(new CoinGetCommand({ uid: params.uid }));
        let item = CoinEntity.updateEntity({}, coin);
        let query = CoinEntity.createQueryBuilder().update(item).where('uid = :uid', { uid: params.uid });
        await query.execute();
    }
}
