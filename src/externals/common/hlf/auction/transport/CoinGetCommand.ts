import { TransformUtil } from '@ts-core/common';
import { Coin, HlfTransportCommandAsync } from '@hlf-core/common';
import { IsOptional, Matches, IsArray } from 'class-validator';
import { CommandName } from './Command';
import { RegExpUtil } from '../../../util';
import * as _ from 'lodash';

export class CoinGetCommand extends HlfTransportCommandAsync<ICoinGetDto, Coin> {
    // --------------------------------------------------------------------------
    //
    //  Static Properties
    //
    // --------------------------------------------------------------------------

    public static readonly NAME = CommandName.COIN_GET;

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(request: ICoinGetDto) {
        super(CoinGetCommand.NAME, TransformUtil.toClass(CoinGetDto, request), null, true);
    }

    // --------------------------------------------------------------------------
    //
    //  Protected Methods
    //
    // --------------------------------------------------------------------------

    protected checkResponse(item: Coin): Coin {
        return TransformUtil.toClass(Coin, item);
    }
}

export interface ICoinGetDto {
    uid: string;
    details?: Array<keyof Coin>;
}

class CoinGetDto implements ICoinGetDto {
    @Matches(RegExpUtil.COIN_UID_REG_EXP)
    uid: string;

    @IsArray()
    @IsOptional()
    details?: Array<keyof Coin>;
}
