import { TransformUtil, TransportEvent } from '@ts-core/common';
import { Event } from './Event';
import { Auction } from '../Auction';

export class AuctionAddedEvent extends TransportEvent<Auction> {
    // --------------------------------------------------------------------------
    //
    //  Public Static Properties
    //
    // --------------------------------------------------------------------------

    public static readonly NAME = Event.AUCTION_ADDED;

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(data: Auction) {
        super(AuctionAddedEvent.NAME, TransformUtil.toClass(Auction, data));
    }
}