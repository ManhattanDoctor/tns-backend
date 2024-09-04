

import { ExtendedError } from '@ts-core/common';
import * as _ from 'lodash';
import { ErrorCode } from '@project/common/platform/api';
import { CoreExtendedError } from './CoreExtendedError';
import { UserRoleName, UserStatus, UserType } from '@project/common/platform/user';
import { CompanyStatus } from '@project/common/platform/company';

// --------------------------------------------------------------------------
//
//  Other
//
// --------------------------------------------------------------------------

export class RequestInvalidError<T> extends CoreExtendedError<IInvalidValue<T>> {
    constructor(details: IInvalidValue<T>) {
        super(ErrorCode.INVALID_REQUEST, details, ExtendedError.HTTP_CODE_BAD_REQUEST);
    }
}

export class HeaderUndefinedError extends CoreExtendedError<string> {
    constructor(message: string) {
        super(ErrorCode.HEADER_UNDEFINED, message, ExtendedError.HTTP_CODE_BAD_REQUEST);
    }
}

export class SignatureInvalidError extends CoreExtendedError {
    constructor() {
        super(ErrorCode.SIGNATURE_INVALID, null, ExtendedError.HTTP_CODE_BAD_REQUEST);
    }
}

// --------------------------------------------------------------------------
//
//  User
//
// --------------------------------------------------------------------------

export class UserUndefinedError extends CoreExtendedError {
    constructor() {
        super(ErrorCode.USER_UNDEFINED, null, ExtendedError.HTTP_CODE_UNAUTHORIZED);
    }
}
export class UserNotFoundError extends CoreExtendedError {
    constructor() {
        super(ErrorCode.USER_NOT_FOUND);
    }
}
export class UserUidAlreadyExistsError extends CoreExtendedError {
    constructor() {
        super(ErrorCode.USER_UID_ALREADY_EXISTS);
    }
}
export class UserIsNotSubscribedOnTerminalError extends CoreExtendedError {
    constructor() {
        super(ErrorCode.USER_IS_NOT_SUBSCRIBED_ON_TERMINAL);
    }
}
export class UserLedgerNotFoundError extends CoreExtendedError {
    constructor() {
        super(ErrorCode.USER_LEDGER_NOT_FOUND);
    }
}
export class UserStatusInvalidError extends CoreExtendedError<IInvalidValue<UserStatus>> {
    constructor(details: IInvalidValue<UserStatus>) {
        super(ErrorCode.USER_STATUS_INVALID, details, ExtendedError.HTTP_CODE_UNAUTHORIZED);
    }
}
export class UserTypeInvalidError extends CoreExtendedError<IInvalidValue<UserType>> {
    constructor(details: IInvalidValue<UserType>) {
        super(ErrorCode.USER_TYPE_INVALID, details);
    }
}

// --------------------------------------------------------------------------
//
//  Company
//
// --------------------------------------------------------------------------

export class CompanyUndefinedError extends CoreExtendedError {
    constructor() {
        super(ErrorCode.COMPANY_UNDEFINED);
    }
}
export class CompanyNotFoundError extends CoreExtendedError {
    constructor() {
        super(ErrorCode.COMPANY_NOT_FOUND);
    }
}
export class CompanyNotUndefinedError extends CoreExtendedError {
    constructor() {
        super(ErrorCode.COMPANY_NOT_UNDEFINED);
    }
}
export class CompanyStatusInvalidError extends CoreExtendedError<IInvalidValue<CompanyStatus>> {
    constructor(details: IInvalidValue<CompanyStatus>) {
        super(ErrorCode.COMPANY_STATUS_INVALID, details, ExtendedError.HTTP_CODE_UNAUTHORIZED);
    }
}
export class CompanyLedgerNotFoundError extends CoreExtendedError {
    constructor() {
        super(ErrorCode.COMPANY_LEDGER_NOT_FOUND);
    }
}
export class CompanyRoleUndefinedError extends CoreExtendedError {
    constructor() {
        super(ErrorCode.COMPANY_ROLE_UNDEFINED, null, ExtendedError.HTTP_CODE_FORBIDDEN);
    }
}
export class CompanyRoleInvalidError extends CoreExtendedError<IInvalidValue<UserRoleName>> {
    constructor(details: IInvalidValue<UserRoleName>) {
        super(ErrorCode.COMPANY_ROLE_INVALID, details, ExtendedError.HTTP_CODE_FORBIDDEN);
    }
}

// --------------------------------------------------------------------------
//
//  Bill
//
// --------------------------------------------------------------------------

export class BillUndefinedError extends CoreExtendedError {
    constructor() {
        super(ErrorCode.BILL_UNDEFINED);
    }
}
export class BillNotFoundError extends CoreExtendedError {
    constructor() {
        super(ErrorCode.BILL_NOT_FOUND);
    }
}
export class BillForbiddenError extends CoreExtendedError {
    constructor() {
        super(ErrorCode.BILL_FORBIDDEN);
    }
}

// --------------------------------------------------------------------------
//
//  Terminal
//
// --------------------------------------------------------------------------

export class TerminalUndefinedError extends CoreExtendedError {
    constructor() {
        super(ErrorCode.TERMINAL_UNDEFINED);
    }
}
export class TerminalNotFoundError extends CoreExtendedError {
    constructor() {
        super(ErrorCode.TERMINAL_NOT_FOUND);
    }
}
export class TerminalForbiddenError extends CoreExtendedError {
    constructor() {
        super(ErrorCode.TERMINAL_FORBIDDEN);
    }
}

// --------------------------------------------------------------------------
//
//  Coin
//
// --------------------------------------------------------------------------

export class CoinUndefinedError extends CoreExtendedError {
    constructor() {
        super(ErrorCode.COIN_UNDEFINED);
    }
}
export class CoinNotFoundError extends CoreExtendedError {
    constructor() {
        super(ErrorCode.COIN_NOT_FOUND);
    }
}
export class CoinBalanceNotFoundError extends CoreExtendedError {
    constructor() {
        super(ErrorCode.COIN_BALANCE_NOT_FOUND);
    }
}
export class CoinBalanceInsufficentFoundError extends CoreExtendedError<IInvalidValue<string>> {
    constructor(request: IInvalidValue<string>) {
        super(ErrorCode.COIN_BALANCE_INSUFFICIENT, request);
    }
}

// --------------------------------------------------------------------------
//
//  Login
//
// --------------------------------------------------------------------------

export class LoginIdInvalidError extends CoreExtendedError<IInvalidValue<string | number>> {
    constructor(value: string | number) {
        super(ErrorCode.LOGIN_ID_INVALID, { name: 'id', value, expected: 'NOT_NULL' }, ExtendedError.HTTP_CODE_UNAUTHORIZED);
    }
}

export class LoginSignatureInvalidError extends CoreExtendedError<string>{
    constructor(message: string) {
        super(ErrorCode.LOGIN_SIGNATURE_INVALID, message, ExtendedError.HTTP_CODE_UNAUTHORIZED);
    }
}

export class LoginTokenInvalidError extends CoreExtendedError<string> {
    constructor(message: string) {
        super(ErrorCode.LOGIN_TOKEN_INVALID, message, ExtendedError.HTTP_CODE_UNAUTHORIZED);
    }
}

export class LoginTokenExpiredError extends CoreExtendedError<IInvalidValue<number>> {
    constructor(value: number, expected: number) {
        super(ErrorCode.LOGIN_TOKEN_EXPIRED, { name: 'token', value, expected }, ExtendedError.HTTP_CODE_UNAUTHORIZED);
    }
}

// --------------------------------------------------------------------------
//
//  Interfaces
//
// --------------------------------------------------------------------------

interface IInvalidValue<T = any> {
    name?: string;
    value: T | Array<T>;
    expected?: T | Array<T>;
}


