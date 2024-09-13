import { ActionType } from "@project/common/platform";
import { CoinEdited } from "./CoinEdited";

export class CoinUnholded extends CoinEdited {
    // --------------------------------------------------------------------------
    //
    //  Protected Methods
    //
    // --------------------------------------------------------------------------

    protected async execute(): Promise<void> {
        this.type = ActionType.COIN_UNHOLDED;
        await super.execute();
    }
}