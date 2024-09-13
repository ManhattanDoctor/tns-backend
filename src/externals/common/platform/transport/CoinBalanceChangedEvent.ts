import { TransportEvent } from "@ts-core/common";
import { CoinBalance } from "../CoinBalance";

export class CoinBalanceChangedEvent extends TransportEvent<CoinBalance> {
    // --------------------------------------------------------------------------
    //
    //  Public Static Properties
    //
    // --------------------------------------------------------------------------

    public static readonly NAME = 'CoinBalanceChangedEvent';

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(data: CoinBalance) {
        super(CoinBalanceChangedEvent.NAME, data);
    }
}
