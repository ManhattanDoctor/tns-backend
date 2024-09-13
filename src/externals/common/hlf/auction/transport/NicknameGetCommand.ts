import { TransformUtil } from '@ts-core/common';
import { HlfTransportCommandAsync } from '@hlf-core/common';
import { IsOptional, Matches, IsArray } from 'class-validator';
import { CommandName } from './Command';
import { Nickname } from '../Nickname';
import { RegExpUtil } from '../../../util';
import * as _ from 'lodash';

export class NicknameGetCommand extends HlfTransportCommandAsync<INicknameGetDto, Nickname> {
    // --------------------------------------------------------------------------
    //
    //  Static Properties
    //
    // --------------------------------------------------------------------------

    public static readonly NAME = CommandName.NICKNAME_GET;

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(request: INicknameGetDto) {
        super(NicknameGetCommand.NAME, TransformUtil.toClass(NicknameGetDto, request), null, true);
    }

    // --------------------------------------------------------------------------
    //
    //  Protected Methods
    //
    // --------------------------------------------------------------------------

    protected checkResponse(item: Nickname): Nickname {
        return TransformUtil.toClass(Nickname, item);
    }
}

export interface INicknameGetDto {
    uid: string;
    details?: Array<keyof Nickname>;
}

class NicknameGetDto implements INicknameGetDto {
    @Matches(RegExpUtil.NICKNAME_UID_REG_EXP)
    uid: string;

    @IsArray()
    @IsOptional()
    details?: Array<keyof Nickname>;
}
