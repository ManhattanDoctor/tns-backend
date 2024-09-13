import { TransformUtil } from '@ts-core/common';
import { HlfTransportCommandAsync } from '@hlf-core/common';
import { Matches } from 'class-validator';
import { CoinBalance } from '../CoinBalance';
import { CommandName } from './Command';
import { RegExpUtil } from '../../../util';
import * as _ from 'lodash';

export class CoinBalanceGetCommand extends HlfTransportCommandAsync<ICoinBalanceGetDto, CoinBalance> {
    // --------------------------------------------------------------------------
    //
    //  Static Properties
    //
    // --------------------------------------------------------------------------

    public static readonly NAME = CommandName.COIN_BALANCE_GET;

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(request: ICoinBalanceGetDto) {
        super(CoinBalanceGetCommand.NAME, TransformUtil.toClass(CoinBalanceGetDto, request), null, true);
    }

    // --------------------------------------------------------------------------
    //
    //  Protected Methods
    //
    // --------------------------------------------------------------------------

    protected checkResponse(item: CoinBalance): CoinBalance {
        return TransformUtil.toClass(CoinBalance, item);
    }
}

export interface ICoinBalanceGetDto {
    coinUid: string;
    objectUid: string;
}

class CoinBalanceGetDto implements ICoinBalanceGetDto {
    @Matches(RegExpUtil.COIN_UID_REG_EXP)
    coinUid: string;

    @Matches(RegExpUtil.COIN_OBJECT_UID_REG_EXP)
    objectUid: string;
}
