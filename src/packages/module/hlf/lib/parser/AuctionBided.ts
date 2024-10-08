import { IAuctionBidedData, AuctionBidedData } from "@project/common/hlf/auction/transport";
import { EventParser } from "../EventParser";
import { TransformUtil } from "@ts-core/common";
import { Nickname } from "@project/common/hlf/auction";
import { ActionType, getAuctionRoom } from "@project/common/platform";
import { AuctionChangedEvent } from "@project/common/platform/transport";
import * as _ from 'lodash';

export class AuctionBided extends EventParser<IAuctionBidedData, void, void> {
    // --------------------------------------------------------------------------
    //
    //  Protected Methods
    //
    // --------------------------------------------------------------------------

    protected async execute(): Promise<void> {
        let data = TransformUtil.toClass(AuctionBidedData, this.data);

        let auction = await this.auctionGet(this.data.auctionUid);

        let newWinnerUid = data.bidderUid;
        let oldWinnerUid = auction.winnerUid;

        auction.price = data.price;
        auction.expired = data.expired;
        auction.bidderUid = data.bidderUid;
        this.entityAdd(auction);

        let nicknameUid = Nickname.createUid(auction.nickname);

        let details = { auctionUid: auction.uid, nicknameUid };
        this.actionAdd(ActionType.AUCTION_BIDED, auction.uid, details);
        this.actionAdd(ActionType.AUCTION_BID_MADE, newWinnerUid, details);
        this.actionAdd(ActionType.AUCTION_BID_BITTEN, oldWinnerUid, details);

        this.socketEventAdd({ event: new AuctionChangedEvent(auction.toObject()), options: { room: getAuctionRoom(auction.id) } });
    }
}