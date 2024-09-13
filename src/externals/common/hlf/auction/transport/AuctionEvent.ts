import { TransportEvent } from '@ts-core/common';

export interface IAuctionEventDto {
    auctionUid: string;
}

export class AuctionEvent<T = IAuctionEventDto> extends TransportEvent<T> {
    constructor(name: string, data: T) {
        super(name, data);
    }
}
