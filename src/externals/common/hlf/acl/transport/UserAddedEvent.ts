import { TransformUtil, TransportEvent } from '@ts-core/common';
import { Event } from './Event';
import { User } from '../User';

export class UserAddedEvent extends TransportEvent<User> {
    // --------------------------------------------------------------------------
    //
    //  Public Static Properties
    //
    // --------------------------------------------------------------------------

    public static readonly NAME = Event.USER_ADDED;

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(data: User) {
        super(UserAddedEvent.NAME, TransformUtil.toClass(User, data));
    }
}
