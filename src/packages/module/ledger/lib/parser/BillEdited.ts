import { BillGetCommand, IBillEditDto } from "@project/common/transport/command/bill";
import { EventParser } from "../EventParser";
import { BillUpdateCommand } from "@project/module/bill/transport";
import { ActionType } from "@project/common/platform";
import { LedgerBillStatus } from "@project/common/ledger/bill";
import { CompanyEntity } from "@project/module/database/company";
import { TerminalEntity } from "@project/module/database/terminal";
import { CoinEntity } from "@project/module/database/coin";

export class BillEdited extends EventParser<void, IBillEditDto, void> {
    // --------------------------------------------------------------------------
    //
    //  Protected Methods
    //
    // --------------------------------------------------------------------------

    protected async execute(): Promise<void> {
        let item = await this.api.ledgerRequestSendListen(new BillGetCommand({ uid: this.request.uid }));
        let user = await this.userGet(item.userUid);

        let bill = await this.billGet(item.uid);
        let coin = await CoinEntity.findOneByOrFail({ id: bill.coinId });
        let company = await CompanyEntity.findOneByOrFail({ id: bill.companyId });
        let terminal = await TerminalEntity.findOneByOrFail({ id: bill.terminalId });

        let details = { userUid: user.ledgerUid, coinUid: coin.ledgerUid, companyUid: company.ledgerUid, billUid: bill.ledgerUid, terminalUid: terminal.ledgerUid, amount: item.amount, decimals: coin.decimals };
        let type = this.request.status === LedgerBillStatus.APPROVED ? ActionType.BILL_APPROVED : ActionType.BILL_REJECTED;
        this.action(type, bill.ledgerUid, details);
        this.action(type, user.ledgerUid, details);
        this.action(type, company.ledgerUid, details);
        this.action(type, terminal.ledgerUid, details);

        this.command(new BillUpdateCommand({ uid: this.request.uid }));
    }
}
