import { IAuctionFinishedData } from "@project/common/hlf/auction/transport";
import { EventParser } from "../EventParser";
import { Nickname } from "@project/common/hlf/auction";
import { ActionType, AuctionStatus, getAuctionRoom } from "@project/common/platform";
import { AuctionChangedEvent, UserChangedEvent } from "@project/common/platform/transport";
import { getUserRoom } from "@project/common/platform";
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
        this.entityAdd(auction);

        let nicknameUid = Nickname.createUid(auction.nickname);

        let details = { auctionUid: auction.uid, nicknameUid };
        this.actionAdd(ActionType.AUCTION_FINISHED, auction.uid, details);
        this.actionAdd(ActionType.AUCTION_FINISHED, nicknameUid, details);

        if (isSucceed) {
            this.actionAdd(ActionType.NICKNAME_ASSIGNED, auction.winnerUid, details);

            let user = await this.userGet(auction.winnerUid);
            user.nicknameUid = nicknameUid;
            this.entityAdd(user);

            this.socketEventAdd({ event: new UserChangedEvent(user.toObject()),   options: { room: getUserRoom(auction.id) } });
        }
        this.socketEventAdd({ event: new AuctionChangedEvent(auction.toObject()), options: { room: getAuctionRoom(auction.id) } });
    }
}