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

        let details = { amount: this.data.amount, coinUid: this.data.coinUid };
        this.actionAdd(this.type, this.data.coinUid, details);
        this.actionAdd(this.type, this.data.objectUid, details);

        this.commandAdd(new CoinUpdateCommand({ uid: this.data.coinUid }));
        this.commandAdd(new CoinBalanceUpdateCommand({ uid: this.data.objectUid, coinUid: this.data.coinUid }));
    }
}