import { EventParser } from "../EventParser";
import { NicknameEntity } from "@project/module/database/entity";
import { NicknameAddedEvent } from "@project//common/platform/transport";
import { ActionType } from "@project/common/platform";
import { TransformUtil } from "@ts-core/common";
import { Nickname } from "@project/common/hlf/auction";
import * as _ from 'lodash';

export class NicknameAdded extends EventParser<Nickname, void, void> {
    // --------------------------------------------------------------------------
    //
    //  Protected Methods
    //
    // --------------------------------------------------------------------------

    protected async execute(): Promise<void> {
        let nickname = TransformUtil.toClass(Nickname, this.data);
        
        let item = NicknameEntity.updateEntity(new NicknameEntity(), nickname);
        this.entityAdd(item);

        let details = { nicknameUid: nickname.uid };
        this.actionAdd(ActionType.NICKNAME_ADDED, nickname.uid, details);
        this.actionAdd(ActionType.NICKNAME_OWNER_CHANGED, nickname.uid, details);
        this.socketEventAdd({ event: new NicknameAddedEvent(item.toObject()) });
    }
}