import { IAuctionFinishedData } from "@project/common/hlf/auction/transport";
import { EventParser } from "../EventParser";
import { Nickname } from "@project/common/hlf/auction";
import { AuctionEntity } from "@project/module/database/entity";
import { ActionType, AuctionStatus } from "@project/common/platform";
import { AuctionChangedEvent, UserChangedEvent } from "@project/common/platform/transport";
import * as _ from 'lodash';

export class AuctionFinished extends EventParser<IAuctionFinishedData, void, void> {
    // --------------------------------------------------------------------------
    //
    //  Protected Methods
    //
    // --------------------------------------------------------------------------

    protected async execute(): Promise<void> {
        let { isSucceed } = this.data;
        let auction = await this.auctionGet(this.data.auctionUid);
        auction.status = isSucceed ? AuctionStatus.COMPLETED : AuctionStatus.FAILED;
        auction.finished = new Date();
        this.entity(auction);

        let nicknameUid = Nickname.createUid(auction.nickname);

        let details = { auctionUid: auction.uid, nicknameUid };
        this.action(ActionType.AUCTION_FINISHED, auction.uid, details);
        this.action(ActionType.AUCTION_FINISHED, nicknameUid, details);

        if (isSucceed) {
            this.action(ActionType.NICKNAME_ASSIGNED, auction.winnerUid, details);

            let user = await this.userGet(auction.winnerUid);
            user.nicknameUid = nicknameUid;
            this.entity(user);

            this.socketEvent({ event: new UserChangedEvent(user.toObject()) });
        }
        this.socketEvent({ event: new AuctionChangedEvent(auction.toObject()) });
    }
}