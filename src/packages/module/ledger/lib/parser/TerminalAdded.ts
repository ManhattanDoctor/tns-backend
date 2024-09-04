import { EventParser } from "../EventParser";
import { ActionType } from "@project/common/platform";
import { ITerminalAddDto, TerminalGetCommand } from "@project/common/transport/command/terminal";
import { LedgerTerminal } from "@project/common/ledger/terminal";

export class TerminalAdded extends EventParser<void, ITerminalAddDto, LedgerTerminal> {
    // --------------------------------------------------------------------------
    //
    //  Protected Methods
    //
    // --------------------------------------------------------------------------

    protected async execute(): Promise<void> {
        let item = await this.api.ledgerRequestSendListen(new TerminalGetCommand({ uid: this.response.uid }));

        let details = { userUid: this.userId, companyUid: this.request.companyUid, terminalUid: item.uid };
        this.action(ActionType.TERMINAL_ADDED, item.uid, details);
        this.action(ActionType.TERMINAL_ADDED, this.userId, details);
        this.action(ActionType.TERMINAL_ADDED, this.request.companyUid, details);
    }
}
