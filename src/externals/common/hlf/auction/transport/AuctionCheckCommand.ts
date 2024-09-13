import { TransformUtil } from '@ts-core/common';
import { HlfTransportCommand } from '@hlf-core/common';
import { Matches } from 'class-validator';
import { CommandName } from './Command';
import { RegExpUtil } from '../../../util';

export class AuctionCheckCommand extends HlfTransportCommand<IAuctionCheckDto> {
    // --------------------------------------------------------------------------
    //
    //  Public Static Properties
    //
    // --------------------------------------------------------------------------

    public static readonly NAME = CommandName.AUCTION_CHECK;

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(request: IAuctionCheckDto) {
        super(AuctionCheckCommand.NAME, TransformUtil.toClass(AuctionCheckDto, request));
    }
}

export interface IAuctionCheckDto {
    uid: string;
}

export class AuctionCheckDto implements IAuctionCheckDto {
    @Matches(RegExpUtil.AUCTION_UID_REG_EXP)
    uid: string;
}
