import { LedgerEvent } from "@project/common/transport/event";
import { CompanyUserUpdateCommand, CompanyRolesUpdateCommand } from "@project/module/company/transport";
import { EventParser } from "../EventParser";
import { ActionType } from "@project/common/platform";
import { ICompanyUserEditedDto } from "@project/common/transport/event/company";

export class CompanyUserEdited extends EventParser<ICompanyUserEditedDto, void, void> {
    // --------------------------------------------------------------------------
    //
    //  Protected Methods
    //
    // --------------------------------------------------------------------------

    protected async execute(): Promise<void> {

        let userUid = this.data.userUid;
        let companyUid = this.data.companyUid;

        let details = { userUid, companyUid };
        this.action(this.type, userUid, details);
        this.action(this.type, companyUid, details);

        this.command(new CompanyUserUpdateCommand({ uid: userUid, companyUid }));
        this.command(new CompanyRolesUpdateCommand({ uid: companyUid }));
    }

    // --------------------------------------------------------------------------
    //
    //  Protected Properties
    //
    // --------------------------------------------------------------------------

    protected get type(): ActionType {
        switch (this.event.name) {
            case LedgerEvent.COMPANY_USER_ADDED:
                return ActionType.COMPANY_USER_ADDED;
            case LedgerEvent.COMPANY_USER_EDITED:
                return ActionType.COMPANY_USER_EDITED;
            case LedgerEvent.COMPANY_USER_REMOVED:
                return ActionType.COMPANY_USER_REMOVED;
        }
    }

}