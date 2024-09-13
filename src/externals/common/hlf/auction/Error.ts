import { Error as BaseError } from '@hlf-core/common';
import { getUid, UID } from '@ts-core/common';
import * as _ from 'lodash';

export class Error<D = any> extends BaseError<ErrorCode, D> {
    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(code: ErrorCode, message: string = '', details?: D) {
        super(code, message, details);
    }
}


export class CoinNotFoundError extends Error<void> {
    constructor(item: UID) {
        super(ErrorCode.COIN_NOT_FOUND, `Unable to find "${getUid(item)}" coin`);
    }
}
export class CoinObjectNotFoundError extends Error<void> {
    constructor(item: UID) {
        super(ErrorCode.COIN_OBJECT_NOT_FOUND, `Unable to find "${getUid(item)}" coin object`);
    }
}
export class CoinAlreadyExistsError extends Error<void> {
    constructor(item: UID) {
        super(ErrorCode.COIN_ALREADY_EXISTS, `Coin "${getUid(item)}" already exists`);
    }
}
export class CoinTransferForbiddenError extends Error<void> {
    constructor(item: UID) {
        super(ErrorCode.COIN_TRANSFER_FORBIDDEN, `Coin tranfser for "${getUid(item)}" forbidden`);
    }
}
export class NicknameNotFoundError extends Error<void> {
    constructor(item: UID) {
        super(ErrorCode.NICKNAME_NOT_FOUND, `Unable to find "${getUid(item)}" nickname`);
    }
}
export class NicknameAlreadyExistsError extends Error<void> {
    constructor(item: UID) {
        super(ErrorCode.NICKNAME_ALREADY_EXISTS, `Nickname "${getUid(item)}" already exists`);
    }
}
export class AuctionNotFoundError extends Error<void> {
    constructor(item: UID) {
        super(ErrorCode.AUCTION_NOT_FOUND, `Auction to find "${getUid(item)}" nickname`);
    }
}
export class AuctionAlreadyExistsError extends Error<void> {
    constructor(item: UID) {
        super(ErrorCode.AUCTION_ALREADY_EXISTS, `Auction "${getUid(item)}" already exists`);
    }
}
export class AuctionNotFinishedYetError extends Error<void> {
    constructor(item: UID) {
        super(ErrorCode.AUCTION_NOT_FINISHED_YET, `Auction "${getUid(item)}" not finished yet`);
    }
}
export class AuctionAlreadyBidedError extends Error<void> {
    constructor(item: UID) {
        super(ErrorCode.AUCTION_ALREADY_BIDED, `You already bided auction "${getUid(item)}"`);
    }
}
export class UserNicknameNotFoundError extends Error<void> {
    constructor(item: UID) {
        super(ErrorCode.USER_NICKNAME_NOT_FOUND, `Unable to find "${getUid(item)}" user nickname`);
    }
}
export class UserAlreadyHasNicknameExistsError extends Error<void> {
    constructor(item: UID) {
        super(ErrorCode.USER_ALREADY_HAS_NICKNAME, `User "${getUid(item)}" already has nickname`);
    }
}

export enum ErrorCode {
    COIN_NOT_FOUND = 'COIN_NOT_FOUND',
    COIN_ALREADY_EXISTS = 'COIN_ALREADY_EXISTS',
    COIN_OBJECT_NOT_FOUND = 'COIN_OBJECT_NOT_FOUND',
    COIN_TRANSFER_FORBIDDEN = 'COIN_TRANSFER_FORBIDDEN',
    //
    NICKNAME_NOT_FOUND = 'NICKNAME_NOT_FOUND',
    NICKNAME_ALREADY_EXISTS = 'NICKNAME_ALREADY_EXISTS',
    //
    AUCTION_NOT_FOUND = 'AUCTION_NOT_FOUND',
    AUCTION_ALREADY_BIDED = 'AUCTION_ALREADY_BIDED',
    AUCTION_ALREADY_EXISTS = 'AUCTION_ALREADY_EXISTS',
    AUCTION_NOT_FINISHED_YET = 'AUCTION_NOT_FINISHED_YET',
    //
    USER_NICKNAME_NOT_FOUND = 'USER_NICKNAME_NOT_FOUND',
    USER_ALREADY_HAS_NICKNAME = 'USER_ALREADY_HAS_NICKNAME',
}