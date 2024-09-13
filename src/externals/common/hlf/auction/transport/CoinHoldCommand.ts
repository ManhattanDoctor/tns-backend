import { TransformUtil } from '@ts-core/common';
import { Matches, IsNumberString } from 'class-validator';
import { HlfTransportCommandAsync } from '@hlf-core/common';
import { CommandName } from './Command';
import { RegExpUtil } from '../../../util';

export class CoinHoldCommand extends HlfTransportCommandAsync<ICoinHoldDto, void> {
    // --------------------------------------------------------------------------
    //
    //  Public Static Properties
    //
    // --------------------------------------------------------------------------

    public static readonly NAME = CommandName.COIN_HOLD;

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(request: ICoinHoldDto) {
        super(CoinHoldCommand.NAME, TransformUtil.toClass(CoinHoldDto, request));
    }
}

export interface ICoinHoldDto {
    from: string;
    amount: string;
    coinUid: string;
}

export class CoinHoldDto implements ICoinHoldDto {
    @Matches(RegExpUtil.COIN_OWNER_UID_REG_EXP)
    from: string;

    @IsNumberString()
    amount: string;

    @Matches(RegExpUtil.COIN_UID_REG_EXP)
    coinUid: string;
}
