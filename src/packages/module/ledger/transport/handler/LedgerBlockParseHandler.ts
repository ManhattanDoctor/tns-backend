import { Injectable } from '@nestjs/common';
import { Logger, ClassType, PromiseHandler, DateUtil } from '@ts-core/common';
import { EntityManager } from 'typeorm';
import { Transport, ITransportCommand, ITransportEvent } from '@ts-core/common';
import * as _ from 'lodash';
import { LedgerApiClient, LedgerBlock } from '@hlf-explorer/common';
import { ILedgerInfo, LedgerBlockParseHandlerBase, LedgerDatabase } from '@hlf-explorer/monitor';
import { DatabaseService } from '@project/module/database/service';
import { LedgerEvent } from '@project/common/transport/event';
import { EventParser, IEventSocketEvent } from '../../lib';
import { CoinBurned, CoinEmitted, BillAdded, TerminalSubscriptionEdited, BillEdited, CoinTransferred, CompanyUserEdited, TerminalAdded } from '../../lib/parser';
import { TransportSocket } from '@ts-core/socket-server';

@Injectable()
export class LedgerBlockParseHandler extends LedgerBlockParseHandlerBase<IEffects> {
    // --------------------------------------------------------------------------
    //
    //  Properties
    //
    // --------------------------------------------------------------------------

    private parsers: Map<LedgerEvent, ClassType<EventParser<any, any, any>>>;

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(logger: Logger, transport: Transport, database: LedgerDatabase, api: LedgerApiClient, private databaseService: DatabaseService, private socket: TransportSocket) {
        super(logger, transport, database, api);

        this.parsers = new Map();
        this.parsers.set(LedgerEvent.COIN_BURNED, CoinBurned);
        this.parsers.set(LedgerEvent.COIN_EMITTED, CoinEmitted);
        this.parsers.set(LedgerEvent.COIN_TRANSFERRED, CoinTransferred);

        this.parsers.set(LedgerEvent.COMPANY_USER_ADDED, CompanyUserEdited);
        this.parsers.set(LedgerEvent.COMPANY_USER_EDITED, this.parsers.get(LedgerEvent.COMPANY_USER_ADDED));
        this.parsers.set(LedgerEvent.COMPANY_USER_REMOVED, this.parsers.get(LedgerEvent.COMPANY_USER_ADDED));

        this.parsers.set(LedgerEvent.BILL_ADDED, BillAdded);
        this.parsers.set(LedgerEvent.BILL_EDITED, BillEdited);

        this.parsers.set(LedgerEvent.TERMINAL_ADDED, TerminalAdded);
        this.parsers.set(LedgerEvent.TERMINAL_SUBSCRIPTION_EDITED, TerminalSubscriptionEdited);
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
        for (let event of item.events) {
            let ClassParser = this.parsers.get(event.name as LedgerEvent);
            if (_.isNil(ClassParser)) {
                this.warn(`Unable to find parser for "${event.name}" event`);
                continue;
            }
            this.log(`Parsing "${event.name}" event`);
            try {
                let parser = new ClassParser(this.logger, this.databaseService, this.api, this.socket);
                let result = await parser.parse(event);
                entities.push(...result.entities);

                events.push(...result.events);
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
