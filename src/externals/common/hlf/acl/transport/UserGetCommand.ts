import { TransformUtil } from '@ts-core/common';
import { IsOptional, Matches, IsArray } from 'class-validator';
import { HlfTransportCommandAsync, UserUtil } from '@hlf-core/common';
import { CommandName } from './Command';
import { User } from '../User';
import { RegExpUtil } from '../../../util';

export class UserGetCommand extends HlfTransportCommandAsync<IUserGetDto, User> {
    // --------------------------------------------------------------------------
    //
    //  Static Properties
    //
    // --------------------------------------------------------------------------

    public static readonly NAME = CommandName.USER_GET;

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(request: IUserGetDto) {
        super(UserGetCommand.NAME, TransformUtil.toClass(UserGetDto, request), null, true);
    }

    // --------------------------------------------------------------------------
    //
    //  Protected Methods
    //
    // --------------------------------------------------------------------------

    protected checkResponse(item: User): User {
        return TransformUtil.toClass(User, item);
    }
}

export interface IUserGetDto {
    uid: string;
    details?: Array<keyof User>;
}

class UserGetDto implements IUserGetDto {
    @Matches(RegExpUtil.USER_UID_REG_EXP)
    uid: string;

    @IsArray()
    @IsOptional()
    details?: Array<keyof User>;
}
