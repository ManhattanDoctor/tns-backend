import { TransformUtil } from '@ts-core/common';
import { HlfTransportCommandAsync } from '@hlf-core/common';
import { CommandName } from './Command';
import { Auction } from '../Auction';
import { AuctionBidConditionsGetDto, IAuctionBidConditionsGetDto } from './AuctionBidConditionsGetCommand';

export class AuctionBidCommand extends HlfTransportCommandAsync<IAuctionBidDto, Auction> {
    // --------------------------------------------------------------------------
    //
    //  Public Static Properties
    //
    // --------------------------------------------------------------------------

    public static readonly NAME = CommandName.AUCTION_BID;

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(request: IAuctionBidDto) {
        super(AuctionBidCommand.NAME, TransformUtil.toClass(AuctionBidDto, request));
    }
}

export interface IAuctionBidDto extends IAuctionBidConditionsGetDto { }

export class AuctionBidDto extends AuctionBidConditionsGetDto { }
