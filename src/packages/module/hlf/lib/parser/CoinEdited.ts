import { ActionType } from "@project/common/platform";
import { CoinBalanceUpdateCommand, CoinUpdateCommand } from "@project/module/coin/transport";
import { ICoinEditedEventDto } from "@project/common/hlf/auction/transport";
import { EventParser } from "../EventParser";

export class CoinEdited extends EventParser<ICoinEditedEventDto, void, void> {
    // --------------------------------------------------------------------------
    //
    //  Properties
    //
    // --------------------------------------------------------------------------

    protected type: ActionType;

    // --------------------------------------------------------------------------
    //
    //  Protected Methods
    //
    // --------------------------------------------------------------------------

    protected async execute(): Promise<void> {
        let coin = await this.coinGet(this.data.coinUid);

        let details = { amount: this.data.amount, decimals: coin.decimals, coinUid: this.data.coinUid };
        this.action(this.type, this.data.coinUid, details);
        this.action(this.type, this.data.objectUid, details);

        this.command(new CoinUpdateCommand({ uid: this.data.coinUid }));
        this.command(new CoinBalanceUpdateCommand({ uid: this.data.objectUid, coinUid: this.data.coinUid }));
    }
}