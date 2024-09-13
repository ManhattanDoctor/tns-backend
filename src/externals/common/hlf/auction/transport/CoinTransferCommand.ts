import { TransformUtil } from '@ts-core/common';
import { Matches, IsNumberString } from 'class-validator';
import { HlfTransportCommandAsync } from '@hlf-core/common';
import { CommandName } from './Command';
import { RegExpUtil } from '../../../util';

export class CoinTransferCommand extends HlfTransportCommandAsync<ICoinTransferDto, void> {
    // --------------------------------------------------------------------------
    //
    //  Public Static Properties
    //
    // --------------------------------------------------------------------------

    public static readonly NAME = CommandName.COIN_TRANSFER;

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(request: ICoinTransferDto) {
        super(CoinTransferCommand.NAME, TransformUtil.toClass(CoinTransferDto, request));
    }
}

export interface ICoinTransferDto {
    to: string;
    amount: string;
    coinUid: string;
}

class CoinTransferDto implements ICoinTransferDto {
    @Matches(RegExpUtil.COIN_OWNER_UID_REG_EXP)
    to: string;

    @IsNumberString()
    amount: string;

    @Matches(RegExpUtil.COIN_UID_REG_EXP)
    coinUid: string;
}
