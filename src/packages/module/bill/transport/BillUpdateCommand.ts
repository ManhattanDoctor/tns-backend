import { TransportCommand } from '@ts-core/common';

export class BillUpdateCommand extends TransportCommand<IBillUpdateDto> {
    // --------------------------------------------------------------------------
    //
    //  Public Static Properties
    //
    // --------------------------------------------------------------------------

    public static readonly NAME = 'BillUpdateCommand';

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(request: IBillUpdateDto) {
        super(BillUpdateCommand.NAME, request);
    }
}

export interface IBillUpdateDto {
    uid: string;
}
