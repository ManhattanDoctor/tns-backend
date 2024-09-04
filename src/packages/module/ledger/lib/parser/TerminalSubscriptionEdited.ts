import { BillGetCommand, IBillAddDto } from "@project/common/transport/command/bill";
import { EventParser } from "../EventParser";
import { LedgerBill } from "@project/common/ledger/bill";
import { BillEntity } from "@project/module/database/bill";
import { ActionType } from "@project/common/platform";
import { BillAddedEvent } from "@project/common/platform/api/transport";
import { CompanyEntity } from "@project/module/database/company";
import { LedgerCoin } from "@project/common/ledger/coin";
import { ITerminalSubscriptionEditDto } from "@project/common/transport/command/terminal";
import { TerminalSubscriptionEntity } from "../../../database/terminal";

export class TerminalSubscriptionEdited extends EventParser<void, ITerminalSubscriptionEditDto, void> {
    // --------------------------------------------------------------------------
    //
    //  Protected Methods
    //
    // --------------------------------------------------------------------------

    protected async execute(): Promise<void> {
        let user = await this.userGet(this.userId);
        let terminal = await this.terminalGet(this.request.uid);

        let item = await TerminalSubscriptionEntity.findOneByOrFail({ userId: user.id, terminalId: terminal.id });
        item.isSubscribed = this.request.isSubscribed;

        let type = this.request.isSubscribed ? ActionType.TERMINAL_SUBSCRIPTION_ADDED : ActionType.TERMINAL_SUBSCRIPTION_REMOVED;
        let details = { userUid: user.ledgerUid, terminalUid: terminal.ledgerUid };
        this.action(type, terminal.ledgerUid, details);
        this.action(type, user.ledgerUid, details);
    }
}
