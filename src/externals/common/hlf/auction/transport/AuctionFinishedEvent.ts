import { Event } from './Event';
import { AuctionEvent, IAuctionEventDto } from './AuctionEvent';

export class AuctionFinishedEvent extends AuctionEvent<IAuctionFinishedData> {
    // --------------------------------------------------------------------------
    //
    //  Public Static Properties
    //
    // --------------------------------------------------------------------------

    public static readonly NAME = Event.AUCTION_FINISHED;

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(data: IAuctionFinishedData) {
        super(AuctionFinishedEvent.NAME, data);
    }
}

export interface IAuctionAmount {
    uid?: string;
    amount: string;
    percent: string;
}
export interface IAuctionFinishedData extends IAuctionEventDto {
    isSucceed: boolean;
    
    earned?: IAuctionAmount;
    burned?: IAuctionAmount;
    coinUid?: string;
    allocations?: Array<IAuctionAmount>;
}
