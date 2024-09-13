import { Type } from 'class-transformer';
import * as _ from 'lodash';

export class Action {
    id: number;
    type: ActionType;

    @Type(() => Date)
    date: Date;
    isExecuted: boolean;

    requestId: string;
    objectUid: string;
    initiatorUid: string;

    amount?: string;
    decimals?: number;

    userUid?: string;
    coinUid?: string;
    auctionUid?: string;
    nicknameUid?: string;
}

export enum ActionType {
    USER_ADDED = 'USER_ADDED',
    USER_EDITED = 'USER_EDITED',

    COMPANY_ADDED = 'AUCTION_ADDED',
    COMPANY_BIDED = 'COMPANY_BIDED',
    COMPANY_FINISHED = 'AUCTION_FINISHED',

    COIN_ADDED = 'COIN_ADDED',
    COIN_HOLDED = 'COIN_HOLDED',
    COIN_BURNED = 'COIN_BURNED',
    COIN_EMITTED = 'COIN_EMITTED',
    COIN_UNHOLDED = 'COIN_UNHOLDED',

    AUCTION_ADDED = 'AUCTION_ADDED',
    AUCTION_BIDED = 'AUCTION_BIDED',
    AUCTION_FINISHED = 'AUCTION_FINISHED',




    NICKNAME_ADDED = 'NICKNAME_ADDED',
    NICKNAME_ASSIGNED = 'NICKNAME_ASSIGNED',
    NICKNAME_OWNER_CHANGED = 'NICKNAME_OWNER_CHANGED',

    // Based on NICKNAME_TRANSFERRED
    NICKNAME_TRANSFER_SENT = 'NICKNAME_TRANSFER_SENT',
    NICKNAME_TRANSFER_RECEIVE = 'NICKNAME_TRANSFER_RECEIVE',

    // Based on COIN_TRANSFERRED
    COIN_TRANSFER_SENT = 'COIN_TRANSFER_SENT',
    COIN_TRANSFER_RECEIVE = 'COIN_TRANSFER_RECEIVE',

    // Based on AUCTION_BIDED
    AUCTION_BID_MADE = 'AUCTION_BID_MADE',
    AUCTION_BID_BITTEN = 'AUCTION_BID_BITTEN',
}
