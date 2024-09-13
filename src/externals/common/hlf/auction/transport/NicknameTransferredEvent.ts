import { NicknameEvent, INicknameEventDto } from './NicknameEvent';
import { Event } from './Event';

export class NicknameTransferredEvent extends NicknameEvent<INicknameTransferredEventDto> {
    // --------------------------------------------------------------------------
    //
    //  Public Static Properties
    //
    // --------------------------------------------------------------------------

    public static readonly NAME = Event.NICKNAME_TRANSFERRED;

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(data: INicknameTransferredEventDto) {
        super(NicknameTransferredEvent.NAME, data);
    }
}

export interface INicknameTransferredEventDto extends INicknameEventDto {
    to: string;
    from: string;
}