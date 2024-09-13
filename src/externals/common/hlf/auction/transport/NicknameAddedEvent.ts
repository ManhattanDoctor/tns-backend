import { TransformUtil, TransportEvent } from '@ts-core/common';
import { Event } from './Event';
import { Nickname } from '../Nickname';

export class NicknameAddedEvent extends TransportEvent<Nickname> {
    // --------------------------------------------------------------------------
    //
    //  Public Static Properties
    //
    // --------------------------------------------------------------------------

    public static readonly NAME = Event.NICKNAME_ADDED;

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(data: Nickname) {
        super(NicknameAddedEvent.NAME, TransformUtil.toClass(Nickname, data));
    }
}