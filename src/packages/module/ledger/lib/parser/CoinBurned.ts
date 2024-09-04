import { ActionType } from "@project/common/platform";
import { ICoinEmitDto } from "@project/common/transport/command/coin";
import { CoinBalanceUpdateCommand, CoinUpdateCommand } from "@project/module/coin/transport";
import { EventParser } from "../EventParser";

export class CoinBurned extends EventParser<ICoinEmitDto, void, void> {
    // --------------------------------------------------------------------------
    //
    //  Protected Methods
    //
    // --------------------------------------------------------------------------

    protected async execute(): Promise<void> {
        let coin = await this.coinGet(this.data.coinUid);

        let details = { amount: this.data.amount, decimals: coin.decimals, coinUid: this.data.coinUid };
        this.action(ActionType.COIN_BURNED, this.data.coinUid, details);
        this.action(ActionType.COIN_BURNED, this.data.objectUid, details);

        this.command(new CoinUpdateCommand({ uid: this.data.coinUid }));
        this.command(new CoinBalanceUpdateCommand({ uid: this.data.objectUid, coinUid: this.data.coinUid }));
    }
}