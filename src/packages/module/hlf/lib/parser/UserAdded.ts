import { EventParser } from "../EventParser";
import { UserEntity } from "@project/module/database/entity";
import { ActionType } from "@project/common/platform";
import { User } from "@project/common/hlf/acl";
import { TransformUtil } from "@ts-core/common";
import { UserAddedEvent } from "@project/common/platform/transport";
import * as _ from 'lodash';

export class UserAdded extends EventParser<User, void, void> {
    // --------------------------------------------------------------------------
    //
    //  Protected Methods
    //
    // --------------------------------------------------------------------------

    protected async execute(): Promise<void> {
        let user = TransformUtil.toClass(User, this.data);

        let item = UserEntity.updateEntity(new UserEntity(), user)
        this.entity(item);

        let details = { userUid: user.uid };
        this.action(ActionType.USER_ADDED, user.uid, details);
        this.socketEvent({ event: new UserAddedEvent(item.toObject()) });
    }
}