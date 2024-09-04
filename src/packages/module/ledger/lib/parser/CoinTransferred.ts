import { ActionType } from "@project/common/platform";
import { CoinBalanceUpdateCommand, CoinUpdateCommand } from "@project/module/coin/transport";
import { ICoinTransferEventDto } from "@project/common/transport/event/coin";
import { EventParser } from "../EventParser";

export class CoinTransferred extends EventParser<ICoinTransferEventDto, void, void> {
    // --------------------------------------------------------------------------
    //
    //  Protected Methods
    //
    // --------------------------------------------------------------------------

    protected async execute(): Promise<void> {
        let details = { coinUid: this.data.coinUid, amount: this.data.amount, decimals: this.data.decimals, userUid: this.userId };
        this.action(ActionType.COIN_TRANSFER_SENT, this.data.from, details);
        this.action(ActionType.COIN_TRANSFER_RECEIVE, this.data.to, details);

        this.command(new CoinUpdateCommand({ uid: this.data.coinUid }));
        this.command(new CoinBalanceUpdateCommand({ uid: this.data.to, coinUid: this.data.coinUid }));
        this.command(new CoinBalanceUpdateCommand({ uid: this.data.from, coinUid: this.data.coinUid }));
    }
}