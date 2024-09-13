import { TransportEvent } from "@ts-core/common";
import { Nickname } from "../../hlf/auction";

export class NicknameAddedEvent extends TransportEvent<Nickname> {
    // --------------------------------------------------------------------------
    //
    //  Public Static Properties
    //
    // --------------------------------------------------------------------------

    public static readonly NAME = 'NicknameAddedEvent';

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(data: Nickname) {
        super(NicknameAddedEvent.NAME, data);
    }
}
