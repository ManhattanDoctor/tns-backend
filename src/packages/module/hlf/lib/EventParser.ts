import { Logger } from '@ts-core/common';
import { LedgerApiClient } from '@hlf-explorer/common';
import { ActionEntity, AuctionEntity, NicknameEntity, UserEntity, CoinEntity, } from '@project/module/database/entity';
import { ActionType } from '@project/common/platform';
import { DatabaseService } from '@project/module/database/service';
import { LedgerEventParser } from "@hlf-explorer/monitor";
import * as _ from 'lodash';

export abstract class EventParser<T, U, V> extends LedgerEventParser<T, U, V> {

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(logger: Logger, api: LedgerApiClient, protected database: DatabaseService) {
        super(logger, api);
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

    protected actionAdd(type: ActionType, objectUid: string, details?: Partial<ActionEntity>): void {
        this.entityAdd(new ActionEntity(type, objectUid, details, this.transaction, this.uid));
    }

    public destroy(): void {
        if (this.isDestroyed) {
            return;
        }
        super.destroy();
        this.database = null;
    }
}