import { Injectable } from '@nestjs/common';
import { Logger, ClassType, Transport } from '@ts-core/common';
import { LedgerApiClient } from '@hlf-explorer/common';
import { LedgerDatabase, LedgerBlockParseHandler, LedgerEventParser, ILedgerBlockParserEffects } from '@hlf-explorer/monitor';
import { DatabaseService } from '@project/module/database/service';
import { TransportSocket } from '@ts-core/socket-server';
import { Event as AclEvent } from '@project/common/hlf/acl/transport';
import { Event as AuctionEvent } from '@project/common/hlf/auction/transport';
import { AuctionAdded, AuctionBided, AuctionFinished, CoinBurned, CoinEmitted, CoinHolded, CoinTransferred, CoinUnholded, NicknameAdded, NicknameTransferred, UserAdded } from '../../lib/parser';
import * as _ from 'lodash';

@Injectable()
export class HlfBlockParseHandler extends LedgerBlockParseHandler {
    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(logger: Logger, transport: Transport, database: LedgerDatabase, api: LedgerApiClient, private databaseService: DatabaseService, private socket: TransportSocket) {
        super(logger, transport, database, api);

        this.parserAdd(AclEvent.USER_ADDED, UserAdded);

        this.parserAdd(AuctionEvent.COIN_HOLDED, CoinHolded);
        this.parserAdd(AuctionEvent.COIN_BURNED, CoinBurned);
        this.parserAdd(AuctionEvent.COIN_EMITTED, CoinEmitted);
        this.parserAdd(AuctionEvent.COIN_UNHOLDED, CoinUnholded);
        this.parserAdd(AuctionEvent.COIN_TRANSFERRED, CoinTransferred);

        this.parserAdd(AuctionEvent.AUCTION_ADDED, AuctionAdded);
        this.parserAdd(AuctionEvent.AUCTION_BIDED, AuctionBided);
        this.parserAdd(AuctionEvent.AUCTION_FINISHED, AuctionFinished);

        this.parserAdd(AuctionEvent.NICKNAME_ADDED, NicknameAdded);
        this.parserAdd(AuctionEvent.NICKNAME_TRANSFERRED, NicknameTransferred);
    }

    // --------------------------------------------------------------------------
    //
    //  Protected Methods
    //
    // --------------------------------------------------------------------------

    protected createParser(Type: ClassType<LedgerEventParser<any, any, any>>): LedgerEventParser<any, any, any> {
        return new Type(this.logger, this.api, this.databaseService);
    }

    protected async effects(data: ILedgerBlockParserEffects): Promise<void> {
        await super.effects(data);
        data.socketEvents.forEach(item => this.socket.dispatch(item.event, item.options));
    }
}