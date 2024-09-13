import { TransformUtil } from '@ts-core/common';
import { HlfTransportCommandAsync } from '@hlf-core/common';
import { IsOptional, Matches } from 'class-validator';
import { CommandName } from './Command';
import { RegExpUtil } from '../../../util';
import { Nickname } from '../Nickname';
import * as _ from 'lodash';

export class NicknameTransferCommand extends HlfTransportCommandAsync<INicknameTransferDto, Nickname> {
    // --------------------------------------------------------------------------
    //
    //  Static Properties
    //
    // --------------------------------------------------------------------------

    public static readonly NAME = CommandName.NICKNAME_TRANSFER;

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(request: INicknameTransferDto) {
        super(NicknameTransferCommand.NAME, TransformUtil.toClass(NicknameTransferDto, request));
    }
}

export interface INicknameTransferDto {
    to: string;
    from?: string;
}

class NicknameTransferDto implements INicknameTransferDto {
    @Matches(RegExpUtil.USER_UID_REG_EXP)
    to: string;

    @IsOptional()
    @Matches(RegExpUtil.USER_UID_REG_EXP)
    from?: string;
}
