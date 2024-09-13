import { TransportEvent } from "@ts-core/common";
import { Auction } from "../Auction";

export class AuctionAddedEvent extends TransportEvent<Auction> {
    // --------------------------------------------------------------------------
    //
    //  Public Static Properties
    //
    // --------------------------------------------------------------------------

    public static readonly NAME = 'AuctionAddedEvent';

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(data: Auction) {
        super(AuctionAddedEvent.NAME, data);
    }
}
