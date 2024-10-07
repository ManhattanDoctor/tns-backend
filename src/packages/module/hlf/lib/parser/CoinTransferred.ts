import { ActionType } from "@project/common/platform";
import { CoinBalanceUpdateCommand, CoinUpdateCommand } from "@project/module/coin/transport";
import { ICoinTransferEventDto } from "@project/common/hlf/auction/transport";
import { EventParser } from "../EventParser";

export class CoinTransferred extends EventParser<ICoinTransferEventDto, void, void> {
    // --------------------------------------------------------------------------
    //
    //  Protected Methods
    //
    // --------------------------------------------------------------------------

    protected async execute(): Promise<void> {
        let coin = await this.coinGet(this.data.coinUid);

        let details = { coinUid: this.data.coinUid, amount: this.data.amount, userUid: this.userId };
        this.actionAdd(ActionType.COIN_TRANSFER_SENT, this.data.from, details);
        this.actionAdd(ActionType.COIN_TRANSFER_RECEIVE, this.data.to, details);

        this.commandAdd(new CoinUpdateCommand({ uid: this.data.coinUid }));
        this.commandAdd(new CoinBalanceUpdateCommand({ uid: this.data.to, coinUid: this.data.coinUid }));
        this.commandAdd(new CoinBalanceUpdateCommand({ uid: this.data.from, coinUid: this.data.coinUid }));
    }
}