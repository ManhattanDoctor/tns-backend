import { TransformUtil, ISignature, Signature } from '@ts-core/common';
import { IsEnum, Matches, IsOptional, IsDefined } from 'class-validator';
import { Type } from 'class-transformer';
import { HlfTransportCommandAsync } from '@hlf-core/common';
import { CommandName } from './Command';
import { User, UserRole } from '../User';
import { RegExpUtil } from '../../../util';

export class UserAddCommand extends HlfTransportCommandAsync<IUserAddDto, User> {
    // --------------------------------------------------------------------------
    //
    //  Public Static Properties
    //
    // --------------------------------------------------------------------------

    public static readonly NAME = CommandName.USER_ADD;

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(request: IUserAddDto) {
        super(UserAddCommand.NAME, TransformUtil.toClass(UserAddDto, request));
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

export interface IUserAddDto {
    signature: ISignature;
    inviterUid: string;
    roles?: Array<UserRole>;
    wallet?: string;
}

export class UserAddDto implements IUserAddDto {
    @IsDefined()
    @Type(() => Signature)
    signature: Signature;

    @Matches(RegExpUtil.USER_UID_REG_EXP)
    inviterUid: string;

    @IsOptional()
    @IsEnum(UserRole, { each: true })
    roles?: Array<UserRole>;

    @IsOptional()
    @Matches(RegExpUtil.ETH_ADDRESS_REG_EXP)
    wallet?: string;
}
