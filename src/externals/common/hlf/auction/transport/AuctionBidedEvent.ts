import { CoinAmount, ICoinAmount } from '@hlf-core/common';
import { Type } from 'class-transformer';
import { AuctionEvent, IAuctionEventDto } from './AuctionEvent';
import { Event } from './Event';

export class AuctionBidedEvent extends AuctionEvent<IAuctionBidedData> {
    // --------------------------------------------------------------------------
    //
    //  Public Static Properties
    //
    // --------------------------------------------------------------------------

    public static readonly NAME = Event.AUCTION_BIDED;

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(data: IAuctionBidedData) {
        super(AuctionBidedEvent.NAME, data);
    }
}

export interface IAuctionBidedData extends IAuctionEventDto {
    price: ICoinAmount;
    expired: Date;
    bidderUid: string;
}

export class AuctionBidedData implements IAuctionBidedData {
    @Type(() => CoinAmount)
    price: CoinAmount;
    @Type(() => Date)
    expired: Date;
    bidderUid: string;
    auctionUid: string;
}