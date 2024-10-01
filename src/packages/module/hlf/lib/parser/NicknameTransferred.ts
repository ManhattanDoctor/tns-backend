import { ActionType } from "@project/common/platform";
import { INicknameTransferredEventDto } from "@project/common/hlf/auction/transport";
import { EventParser } from "../EventParser";

export class NicknameTransferred extends EventParser<INicknameTransferredEventDto, void, void> {
    // --------------------------------------------------------------------------
    //
    //  Protected Methods
    //
    // --------------------------------------------------------------------------

    protected async execute(): Promise<void> {
        let to = await this.userGet(this.data.to);
        let from = await this.userGet(this.data.from);
        let nickname = await this.nicknameGet(this.data.nicknameUid);

        let details = { nicknameUid: nickname.uid };

        this.actionAdd(ActionType.NICKNAME_TRANSFER_RECEIVE, to.uid, details);
        to.nicknameUid = nickname.uid;
        this.entityAdd(to);

        this.actionAdd(ActionType.NICKNAME_TRANSFER_SENT, from.uid, details);
        from.nicknameUid = null;
        this.entityAdd(from);

        this.actionAdd(ActionType.NICKNAME_OWNER_CHANGED, nickname.uid, details);
        nickname.ownerUid = to.uid;
        this.entityAdd(nickname);
    }
}