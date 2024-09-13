import { getUid, UID } from '@ts-core/common';
import { Error as BaseError } from '@hlf-core/common';
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


export class UserNotFoundError extends Error<void> {
    constructor(item: UID) {
        super(ErrorCode.USER_NOT_FOUND, `Unable to find "${getUid(item)}" user`)
    }
}
export class UserAlreadyExistsError extends Error<void> {
    constructor(item: UID) {
        super(ErrorCode.USER_ALREADY_EXISTS, `User "${getUid(item)}" already exists`)
    }
}

export class UserStatusForbiddenError extends Error<IUserStatusForbiddenErrorDetails> {
    constructor(user: UID, details: IUserStatusForbiddenErrorDetails) {
        super(ErrorCode.USER_STATUS_FORBIDDEN, `User "${getUid(user)}" status forbidden`, details)
    }
}
export interface IUserStatusForbiddenErrorDetails {
    has: string;
    required: string;
}

export enum ErrorCode {
    USER_NOT_FOUND = 'USER_NOT_FOUND',
    USER_ALREADY_EXISTS = 'USER_ALREADY_EXISTS',
    USER_STATUS_FORBIDDEN = 'USER_STATUS_FORBIDDEN',
}
