import { BillGetCommand, IBillAddDto } from "@project/common/transport/command/bill";
import { EventParser } from "../EventParser";
import { LedgerBill } from "@project/common/ledger/bill";
import { BillEntity } from "@project/module/database/bill";
import { ActionType } from "@project/common/platform";
import { BillAddedEvent } from "@project/common/platform/api/transport";
import { CompanyEntity } from "@project/module/database/company";
import { LedgerCoin } from "@project/common/ledger/coin";
import * as _ from 'lodash';
import { TerminalSubscriptionEntity } from "@project/module/database/terminal";

export class BillAdded extends EventParser<void, IBillAddDto, LedgerBill> {
    // --------------------------------------------------------------------------
    //
    //  Protected Methods
    //
    // --------------------------------------------------------------------------

    protected async execute(): Promise<void> {
        let item = await this.api.ledgerRequestSendListen(new BillGetCommand({ uid: this.response.uid }));
        let user = await this.userGet(this.request.userUid);
        let terminal = await this.terminalGet(this.request.terminalUid);

        let company = await CompanyEntity.findOneByOrFail({ id: terminal.companyId });
        let coin = await this.coinGet(LedgerCoin.createUid(company.ledgerUid, this.request.coinId));

        let bill = this.entity(BillEntity.createEntity(item));

        bill.userId = user.id;
        bill.coinId = coin.id;
        bill.companyId = company.id;
        bill.terminalId = terminal.id;

        let details = { userUid: user.ledgerUid, coinUid: coin.ledgerUid, companyUid: company.ledgerUid, billUid: bill.ledgerUid, terminalUid: terminal.ledgerUid, amount: bill.amount, decimals: coin.decimals };
        this.action(ActionType.BILL_ADDED, bill.ledgerUid, details);
        this.action(ActionType.BILL_ADDED, user.ledgerUid, details);
        this.action(ActionType.BILL_ADDED, company.ledgerUid, details);
        this.action(ActionType.BILL_ADDED, terminal.ledgerUid, details);

        let event = new BillAddedEvent(bill.toObject());
        this.eventAdd(event);

        if (await this.database.userIsSubscribed(user.id, bill.terminalId)) {
            this.socketEvent({ event, options: { userId: user.id } });
        }
    }
}
