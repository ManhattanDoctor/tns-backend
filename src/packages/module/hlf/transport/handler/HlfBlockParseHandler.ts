import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { Logger, ClassType, TransportEvent, DateUtil, Transport, ITransportCommand, ITransportEvent } from '@ts-core/common';
import { LedgerApiClient, LedgerBlock } from '@hlf-explorer/common';
import { ILedgerInfo, LedgerBlockParseHandlerBase, LedgerDatabase } from '@hlf-explorer/monitor';
import { DatabaseService } from '@project/module/database/service';
import { EventParser, IEventSocketEvent } from '../../lib';
import { TransportSocket } from '@ts-core/socket-server';
import { Event as AclEvent } from '@project/common/hlf/acl/transport';
import { Event as AuctionEvent } from '@project/common/hlf/auction/transport';
import { AuctionAdded, AuctionBided, AuctionFinished, CoinBurned, CoinEmitted, CoinHolded, CoinTransferred, CoinUnholded, NicknameAdded, NicknameTransferred, UserAdded } from '../../lib/parser';
import * as _ from 'lodash';

@Injectable()
export class HlfBlockParseHandler extends LedgerBlockParseHandlerBase<IEffects> {
    // --------------------------------------------------------------------------
    //
    //  Properties
    //
    // --------------------------------------------------------------------------

    private parsers: Map<string, ClassType<EventParser<any, any, any>>>;

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(logger: Logger, transport: Transport, database: LedgerDatabase, api: LedgerApiClient, private databaseService: DatabaseService, private socket: TransportSocket) {
        super(logger, transport, database, api);

        this.parsers = new Map();

        this.parsers.set(AclEvent.USER_ADDED, UserAdded);

        this.parsers.set(AuctionEvent.COIN_HOLDED, CoinHolded);
        this.parsers.set(AuctionEvent.COIN_BURNED, CoinBurned);
        this.parsers.set(AuctionEvent.COIN_EMITTED, CoinEmitted);
        this.parsers.set(AuctionEvent.COIN_UNHOLDED, CoinUnholded);
        this.parsers.set(AuctionEvent.COIN_TRANSFERRED, CoinTransferred);

        this.parsers.set(AuctionEvent.AUCTION_ADDED, AuctionAdded);
        this.parsers.set(AuctionEvent.AUCTION_BIDED, AuctionBided);
        this.parsers.set(AuctionEvent.AUCTION_FINISHED, AuctionFinished);

        this.parsers.set(AuctionEvent.NICKNAME_ADDED, NicknameAdded);
        this.parsers.set(AuctionEvent.NICKNAME_TRANSFERRED, NicknameTransferred);
    }

    // --------------------------------------------------------------------------
    //
    //  Protected Methods
    //
    // --------------------------------------------------------------------------

    protected async parse(manager: EntityManager, item: LedgerBlock, info: ILedgerInfo): Promise<IEffects> {
        let events = new Array();
        let commands = new Array();
        let socketEvents = new Array();

        let entities = new Array();
        console.log(item.events);
        for (let event of item.events) {
            let ClassParser = this.parsers.get(event.name);
            if (_.isNil(ClassParser)) {
                this.warn(`Unable to find parser for "${event.name}" event`);
                continue;
            }
            this.log(`Parsing "${event.name}" event`);
            try {
                let parser = new ClassParser(this.logger, this.databaseService, this.api, this.socket);
                let result = await parser.parse(event);

                events.push(...result.events);
                entities.push(...result.entities);
                commands.push(...result.commands);
                socketEvents.push(...result.socketEvents);
                parser.destroy();
            }
            catch (error) {
                this.error(error);
                throw error;
            }
        }
        try {
            await manager.save(entities);
        }
        catch (error) {
            console.log(error);
            throw error;
        }
        return { commands, events, socketEvents };
    }

    protected async effects(data: IEffects): Promise<void> {
        data.events.forEach(item => this.transport.dispatch(item));
        data.commands.forEach(item => this.transport.send(item));
        data.socketEvents.forEach(item => this.socket.dispatch(item.event, item.options));
    }
}

interface IEffects {
    events: Array<ITransportEvent<any>>;
    commands: Array<ITransportCommand<any>>;
    socketEvents: Array<IEventSocketEvent<any>>;
}
