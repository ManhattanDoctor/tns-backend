import { TransportCommand } from '@ts-core/common';

export class CoinBalanceUpdateCommand extends TransportCommand<ICoinBalanceUpdateDto> {
    // --------------------------------------------------------------------------
    //
    //  Public Static Properties
    //
    // --------------------------------------------------------------------------

    public static readonly NAME = 'CoinBalanceUpdateCommand';

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(request: ICoinBalanceUpdateDto) {
        super(CoinBalanceUpdateCommand.NAME, request);
    }
}

export interface ICoinBalanceUpdateDto {
    uid: string;
    coinUid: string;
}
