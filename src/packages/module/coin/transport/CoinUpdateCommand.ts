import { TransportCommand } from '@ts-core/common';

export class CoinUpdateCommand extends TransportCommand<ICoinUpdateDto> {
    // --------------------------------------------------------------------------
    //
    //  Public Static Properties
    //
    // --------------------------------------------------------------------------

    public static readonly NAME = 'CoinUpdateCommand';

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(request: ICoinUpdateDto) {
        super(CoinUpdateCommand.NAME, request);
    }
}

export interface ICoinUpdateDto {
    uid: string;
}
