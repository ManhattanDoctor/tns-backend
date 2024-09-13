
import { IUIDable, UID, getUid } from '@ts-core/common';
import { RegExpUtil } from "../util";

export interface IHlfObject extends IUIDable { }

export enum HlfObjectType {
    USER = 'USER',
    COIN = 'COIN',
    AUCTION = 'AUCTION',
    NICKNAME = 'NICKNAME',
}

export function IsUser(uid: UID): boolean {
    return RegExpUtil.USER_UID_REG_EXP.test(getUid(uid));
}
export function IsCoin(uid: UID): boolean {
    return RegExpUtil.COIN_UID_REG_EXP.test(getUid(uid));
}
export function IsAuction(uid: UID): boolean {
    return RegExpUtil.AUCTION_UID_REG_EXP.test(getUid(uid));
}
export function IsNickname(uid: UID): boolean {
    return RegExpUtil.NICKNAME_UID_REG_EXP.test(getUid(uid));
}
export function getType(uid: UID): HlfObjectType {
    if (IsUser(uid)) {
        return HlfObjectType.USER;
    }
    if (IsCoin(uid)) {
        return HlfObjectType.COIN;
    }
    if (IsAuction(uid)) {
        return HlfObjectType.AUCTION;
    }
    if (IsNickname(uid)) {
        return HlfObjectType.NICKNAME;
    }
    return null;
}