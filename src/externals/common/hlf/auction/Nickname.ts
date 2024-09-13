import { Matches, ValidateIf } from 'class-validator';
import { getUid, IUIDable, UID } from '@ts-core/common';
import { RegExpUtil } from '../../util';
import { Variables } from '../acl';
import * as _ from 'lodash';

export class Nickname implements IUIDable {
    // --------------------------------------------------------------------------
    //
    //  Static Properties
    //
    // --------------------------------------------------------------------------

    public static PREFIX = 'nickname';

    // --------------------------------------------------------------------------
    //
    //  Static Methods
    //
    // --------------------------------------------------------------------------

    public static create(nickname: string, owner: UID, parentUid: UID): Nickname {
        let item = new Nickname();
        item.uid = Nickname.createUid(nickname);
        item.ownerUid = getUid(owner);
        item.parentUid = getUid(parentUid);
        return item;
    }

    public static createUid(nickname: string): string {
        return `${Nickname.PREFIX}/${nickname}`;
    }

    // --------------------------------------------------------------------------
    //
    //  Properties
    //
    // --------------------------------------------------------------------------

    @Matches(RegExpUtil.NICKNAME_UID_REG_EXP)
    public uid: string;

    @Matches(RegExpUtil.USER_UID_REG_EXP)
    public ownerUid: string;

    @ValidateIf(item => item.uid !== Variables.platform.nicknameUid)
    @Matches(RegExpUtil.NICKNAME_UID_REG_EXP)
    public parentUid: string;

    // --------------------------------------------------------------------------
    //
    //  Public Properties
    //
    // --------------------------------------------------------------------------

    @Matches(RegExpUtil.NICKNAME_REG_EXP)
    public get nickname(): string {
        return getNicknameByUid(this.uid);
    }
}

export function getNicknameByUid(item: UID): string {
    return _.last(getUid(item).split('/'));
}
