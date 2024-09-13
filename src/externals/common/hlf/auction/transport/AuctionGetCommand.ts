import { TransformUtil } from '@ts-core/common';
import { HlfTransportCommandAsync } from '@hlf-core/common';
import { IsOptional, Matches, IsArray } from 'class-validator';
import { CommandName } from './Command';
import { Auction } from '../Auction';
import { RegExpUtil } from '../../../util';
import * as _ from 'lodash';

export class AuctionGetCommand extends HlfTransportCommandAsync<IAuctionGetDto, Auction> {
    // --------------------------------------------------------------------------
    //
    //  Static Properties
    //
    // --------------------------------------------------------------------------

    public static readonly NAME = CommandName.AUCTION_GET;

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(request: IAuctionGetDto) {
        super(AuctionGetCommand.NAME, TransformUtil.toClass(AuctionGetDto, request), null, true);
    }

    // --------------------------------------------------------------------------
    //
    //  Protected Methods
    //
    // --------------------------------------------------------------------------

    protected checkResponse(item: Auction): Auction {
        return TransformUtil.toClass(Auction, item);
    }
}

export interface IAuctionGetDto {
    uid: string;
    details?: Array<keyof Auction>;
}

class AuctionGetDto implements IAuctionGetDto {
    @Matches(RegExpUtil.AUCTION_UID_REG_EXP)
    uid: string;

    @IsArray()
    @IsOptional()
    details?: Array<keyof Auction>;
}
