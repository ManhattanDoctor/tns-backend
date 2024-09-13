import { EventParser } from "../EventParser";
import { TransformUtil } from "@ts-core/common";
import { Auction, Nickname } from "@project/common/hlf/auction";
import { AuctionEntity } from "@project/module/database/entity";
import { ActionType, AuctionStatus } from "@project/common/platform";
import { AuctionAddedEvent } from "@project//common/platform/transport";
import * as _ from 'lodash';

export class AuctionAdded extends EventParser<Auction, void, void> {
    // --------------------------------------------------------------------------
    //
    //  Protected Methods
    //
    // --------------------------------------------------------------------------

    protected async execute(): Promise<void> {
        let user = await this.userGet(this.userId);
        let auction = TransformUtil.toClass(Auction, this.data);
        let nicknameUid = Nickname.createUid(auction.nickname);

        let item = new AuctionEntity();
        item.status = AuctionStatus.IN_PROGRESS;
        this.entity(AuctionEntity.updateEntity(item, auction));

        let details = { auctionUid: auction.uid, userUid: user.uid, nicknameUid };
        this.action(ActionType.AUCTION_ADDED, user.uid, details);
        this.action(ActionType.AUCTION_ADDED, auction.uid, details);
        this.action(ActionType.AUCTION_ADDED, nicknameUid, details);

        this.socketEvent({ event: new AuctionAddedEvent(item.toObject()) });
    }
}