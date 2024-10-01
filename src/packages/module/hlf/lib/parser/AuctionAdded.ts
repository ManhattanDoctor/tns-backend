import { TransformUtil } from "@ts-core/common";
import { Auction, Nickname } from "@project/common/hlf/auction";
import { AuctionEntity } from "@project/module/database/entity";
import { ActionType, AuctionStatus } from "@project/common/platform";
import { AuctionAddedEvent } from "@project//common/platform/transport";
import * as _ from 'lodash';
import { EventParser } from "../EventParser";

export class AuctionAdded extends EventParser<Auction, void, void> {
    // --------------------------------------------------------------------------
    //
    //  Protected Methods
    //
    // --------------------------------------------------------------------------

    protected async execute(): Promise<void> {
        let user = await this.userGet(this.userId);
        let auction = TransformUtil.toClass(Auction, this.data);
        let nicknameUid = Nickname.createUid(Auction.getNicknameByUid(auction));

        let item = new AuctionEntity();
        item.status = AuctionStatus.IN_PROGRESS;
        this.entityAdd(AuctionEntity.updateEntity(item, auction));

        let details = { auctionUid: auction.uid, userUid: user.uid, nicknameUid };
        this.actionAdd(ActionType.AUCTION_ADDED, user.uid, details);
        this.actionAdd(ActionType.AUCTION_ADDED, auction.uid, details);
        this.actionAdd(ActionType.AUCTION_ADDED, nicknameUid, details);

        this.socketEventAdd({ event: new AuctionAddedEvent(item.toObject()) });
    }
}