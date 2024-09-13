import { TransportEvent } from "@ts-core/common";
import { Nickname } from "../Nickname";

export class NicknameChangedEvent extends TransportEvent<Nickname>{
    // --------------------------------------------------------------------------
    //
    //  Public Static Properties
    //
    // --------------------------------------------------------------------------

    public static readonly NAME = 'NicknameChangedEvent';

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(data: Nickname) {
        super(NicknameChangedEvent.NAME, data);
    }
}
