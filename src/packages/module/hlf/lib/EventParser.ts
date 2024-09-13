import { LoggerWrapper, Logger, ITransportCommand, ITransportEvent } from '@ts-core/common';
import { LedgerApiClient, LedgerBlockEvent, LedgerBlockTransaction } from '@hlf-explorer/common';
import { ActionEntity, AuctionEntity, NicknameEntity, UserEntity, CoinEntity, } from '@project/module/database/entity';
import { ActionType } from '@project/common/platform';
import { DatabaseService } from '@project/module/database/service';
import { ITransportSocketEventOptions } from '@ts-core/socket-common';
import * as _ from 'lodash';

export abstract class EventParser<T, U, V> extends LoggerWrapper {
    // --------------------------------------------------------------------------
    //
    //  Properties
    //
    // --------------------------------------------------------------------------

    protected entities: Array<any>;

    protected events: Array<ITransportEvent<any>>;
    protected commands: Array<ITransportCommand<any>>;
    protected socketEvents: Array<IEventSocketEvent<any>>;

    protected event: LedgerBlockEvent<T>;
    protected transaction: LedgerBlockTransaction;

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(logger: Logger, protected database: DatabaseService, protected api: LedgerApiClient) {
        super(logger);
    }

    // --------------------------------------------------------------------------
    //
    //  Protected Methods
    //
    // --------------------------------------------------------------------------

    protected abstract execute(): Promise<void>;

    // --------------------------------------------------------------------------
    //
    //  Help Methods
    //
    // --------------------------------------------------------------------------

    protected userGet(uid: string): Promise<UserEntity> {
        return UserEntity.findOneByOrFail({ uid });
    }

    protected coinGet(uid: string): Promise<CoinEntity> {
        return CoinEntity.findOneByOrFail({ uid });
    }

    protected auctionGet(uid: string): Promise<AuctionEntity> {
        return AuctionEntity.findOneByOrFail({ uid });
    }

    protected nicknameGet(uid: string): Promise<NicknameEntity> {
        return NicknameEntity.findOneByOrFail({ uid });
    }

    protected action(type: ActionType, objectUid: string, details?: Partial<ActionEntity>): void {
        this.entity(new ActionEntity(type, objectUid, details, this.transaction, this.uid));
    }

    protected entity<E>(item: E): E {
        this.entities.push(item);
        return item;
    }

    protected eventAdd<T>(item: ITransportEvent<T>): void {
        this.events.push(item);
    }

    protected command<C = any>(item: ITransportCommand<C>): void {
        this.commands.push(item);
    }

    protected socketEvent<T>(item: IEventSocketEvent<T>): void {
        this.socketEvents.push(item);
    }

    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    public async parse(event: LedgerBlockEvent): Promise<IEventParsingResult> {
        this.event = event;

        this.events = new Array();
        this.commands = new Array();
        this.entities = new Array();
        this.socketEvents = new Array();

        this.transaction = await this.api.getTransaction(this.requestId);
        if (this.transaction.validationCode === 0) {
            await this.execute();
        }
        return this.result;
    }

    public destroy(): void {
        if (this.isDestroyed) {
            return;
        }
        super.destroy();

        this.api = null;
        this.event = null;
        this.database = null;
        this.transaction = null;
    }

    // --------------------------------------------------------------------------
    //
    //  Protected Properties
    //
    // --------------------------------------------------------------------------

    protected get uid(): string {
        return this.event.uid;
    }

    protected get data(): T {
        return this.event.data;
    }

    protected get date(): Date {
        return this.event.date;
    }

    protected get userId(): string {
        return this.transaction.requestUserId;
    }

    protected get requestId(): string {
        return this.event.requestId;
    }

    protected get request(): U {
        return this.transaction.request.request as U;
    }

    protected get response(): V {
        return this.transaction.response.response as V;
    }

    protected get result(): IEventParsingResult {
        return { entities: this.entities, commands: this.commands, events: this.events, socketEvents: this.socketEvents }
    }
}

export interface IEventParsingResult {
    events: Array<ITransportEvent<any>>;
    entities: Array<any>;
    commands: Array<ITransportCommand<any>>;
    socketEvents: Array<IEventSocketEvent<any>>;
}

export interface IEventSocketEvent<T> {
    event: ITransportEvent<T>;
    options?: ITransportSocketEventOptions;
}
