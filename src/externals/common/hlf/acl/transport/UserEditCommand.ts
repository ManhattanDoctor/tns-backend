import { TransformUtil } from '@ts-core/common';
import { IsEnum, Matches, IsOptional, IsDefined } from 'class-validator';
import { HlfTransportCommandAsync } from '@hlf-core/common';
import { CommandName } from './Command';
import { User, UserRole } from '../User';
import { RegExpUtil } from '../../../util';

export class UserEditCommand extends HlfTransportCommandAsync<IUserEditDto, User> {
    // --------------------------------------------------------------------------
    //
    //  Public Static Properties
    //
    // --------------------------------------------------------------------------

    public static readonly NAME = CommandName.USER_EDIT;

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(request: IUserEditDto) {
        super(UserEditCommand.NAME, TransformUtil.toClass(UserEditDto, request));
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

export interface IUserEditDto {
    uid: string;
    roles?: Array<UserRole>;
    wallet?: string;
}

export class UserEditDto implements IUserEditDto {
    @Matches(RegExpUtil.USER_UID_REG_EXP)
    uid: string;

    @IsOptional()
    @IsEnum(UserRole, { each: true })
    roles?: Array<UserRole>;

    @Matches(RegExpUtil.ETH_ADDRESS_REG_EXP)
    wallet?: string;
}