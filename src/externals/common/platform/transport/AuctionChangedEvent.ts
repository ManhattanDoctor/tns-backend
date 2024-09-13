import { TransportEvent } from "@ts-core/common";
import { Auction } from "../Auction";

export class AuctionChangedEvent extends TransportEvent<Auction>{
    // --------------------------------------------------------------------------
    //
    //  Public Static Properties
    //
    // --------------------------------------------------------------------------

    public static readonly NAME = 'AuctionChangedEvent';

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(data: Auction) {
        super(AuctionChangedEvent.NAME, data);
    }
}
