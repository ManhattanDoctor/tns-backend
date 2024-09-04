import { Injectable } from '@nestjs/common';
import { Logger, LoggerWrapper, ITransportCommandAsync, ITransportCommandOptions } from '@ts-core/common';
import * as _ from 'lodash';
import { UserEntity } from '@project/module/database/user';
import { LedgerUser } from '@project/common/ledger/user';
import { UserAddCommand, UserGetCommand } from '@project/common/transport/command/user';
import { CompanyEntity } from '@project/module/database/company';
import { CompanyGetCommand, CompanyUserSetCommand, CompanyUserRoleListCommand, ICompanyUserRoleListDtoResponse } from '@project/common/transport/command/company';
import { CoinAddCommand, CoinEmitCommand, CoinGetCommand, CoinObjectBalanceGetCommand } from '@project/common/transport/command/coin';
import { LedgerCompany } from '@project/common/ledger/company';
import { LedgerCoin, LedgerCoinIdPreset, LedgerCoinObjectBalance } from '@project/common/ledger/coin';
import { LedgerApiClient } from './LedgerApiClient';
import { LedgerMonitor } from './LedgerMonitor';
import { ILedgreable } from '@project/common/platform/ILedgerable';
import { BillAddCommand, BillEditCommand } from '@project/common/transport/command/bill';
import { LedgerBill, LedgerBillStatus } from '@project/common/ledger/bill';
import { BillEntity } from '@project/module/database/bill';
import { TerminalEntity } from '@project/module/database/terminal';
import { TerminalAddCommand } from '@project/common/transport/command/terminal';
import { LedgerCompanyRole, LedgerRoles } from '@project/common/ledger/role';
import { TerminalSubscriptionEditCommand } from '@project/common/transport/command/terminal';

@Injectable()
export class LedgerService extends LoggerWrapper {
    // --------------------------------------------------------------------------
    //
    //  Constants
    //
    // --------------------------------------------------------------------------

    public static USER_ROOT_LEDGER_UID = LedgerUser.createRoot().uid;
    public static COMPANY_ROOT_LEDGER_UID = LedgerCompany.createRoot().uid;

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(logger: Logger, private api: LedgerApiClient, private monitor: LedgerMonitor) {
        super(logger);
    }

    // --------------------------------------------------------------------------
    //
    //  Company Methods
    //
    // --------------------------------------------------------------------------

    public async companyRootGet(): Promise<CompanyEntity> {
        return CompanyEntity.findOneBy({ ledgerUid: LedgerService.COMPANY_ROOT_LEDGER_UID });
    }

    public async companyRootId(): Promise<number> {
        let item = await this.companyRootGet();
        return item.id;
    }

    public async companyRootLedgerGet(): Promise<LedgerCompany> {
        return this.sendListen(new CompanyGetCommand({ uid: LedgerService.COMPANY_ROOT_LEDGER_UID, details: [] }));
    }

    public async companyUserSet(roles: Array<LedgerCompanyRole>): Promise<void> {
        this.setSignerRoot();
        return this.sendListen(new CompanyUserSetCommand({ userUid: LedgerService.USER_ROOT_LEDGER_UID, companyUid: LedgerService.COMPANY_ROOT_LEDGER_UID, roles }));
    }

    public async companyUserRoles(): Promise<ICompanyUserRoleListDtoResponse> {
        this.setSignerRoot();
        return this.sendListen(new CompanyUserRoleListCommand({ userUid: LedgerService.USER_ROOT_LEDGER_UID, companyUid: LedgerService.COMPANY_ROOT_LEDGER_UID }));
    }

    // --------------------------------------------------------------------------
    //
    //  Coin Methods
    //
    // --------------------------------------------------------------------------

    public async coinAdd(coinId: string, decimals: number): Promise<LedgerCoin> {
        this.setSignerRoot();
        return this.sendListen(new CoinAddCommand({ companyUid: LedgerService.COMPANY_ROOT_LEDGER_UID, decimals, coinId }));
    }

    public async coinGet(coinId: string): Promise<LedgerCoin> {
        return this.sendListen(new CoinGetCommand({ uid: LedgerCoin.createUid(LedgerService.COMPANY_ROOT_LEDGER_UID, coinId), details: ['balance'] }));
    }

    public async coinObjectBalanceGet(coinId: string, objectUid: string): Promise<LedgerCoinObjectBalance> {
        return this.sendListen(new CoinObjectBalanceGetCommand({ coinUid: LedgerCoin.createUid(LedgerService.COMPANY_ROOT_LEDGER_UID, coinId), objectUid }));
    }

    public async coinEmit(to: string | ILedgreable, coinId: string, amount: string): Promise<void> {
        if (_.isObject(to)) {
            to = to.ledgerUid;
        }
        this.setSignerRoot();
        return this.sendListen(new CoinEmitCommand({ coinUid: LedgerCoin.createUid(LedgerService.COMPANY_ROOT_LEDGER_UID, coinId), objectUid: to, amount }));
    }

    // --------------------------------------------------------------------------
    //
    //  Terminal Methods
    //
    // --------------------------------------------------------------------------

    public async terminalSubscriptionEdit(user: ILedgreable, terminal: TerminalEntity, isSubscribed: boolean): Promise<void> {
        this.setSigner(user);
        await this.sendListen(new TerminalSubscriptionEditCommand({ uid: terminal.ledgerUid, isSubscribed }));
    }

    // --------------------------------------------------------------------------
    //
    //  Bill Methods
    //
    // --------------------------------------------------------------------------

    public async billAdd(terminalUid: string, userUid: string, amount: string, description: string): Promise<LedgerBill> {
        this.setSignerRoot();
        return this.sendListen(new BillAddCommand({ userUid, terminalUid, amount, description, coinId: LedgerCoinIdPreset.RUB }));
    }

    public async billEdit(user: ILedgreable, bill: BillEntity, status: LedgerBillStatus): Promise<void> {
        this.setSigner(user);
        await this.sendListen(new BillEditCommand({ uid: bill.ledgerUid, status }));
    }

    // --------------------------------------------------------------------------
    //
    //  Terminal Methods
    //
    // --------------------------------------------------------------------------

    public async terminalAdd(publicKey: string, algorithm: string, description: string): Promise<string> {
        this.setSignerRoot();
        let { uid } = await this.sendListen(new TerminalAddCommand({
            companyUid: LedgerService.COMPANY_ROOT_LEDGER_UID,
            cryptoKey: { value: publicKey, algorithm: algorithm },
            description
        }));
        return uid;
    }

    // --------------------------------------------------------------------------
    //
    //  User Methods
    //
    // --------------------------------------------------------------------------

    public async userAddIfNeed(user: UserEntity): Promise<UserEntity> {
        if (!_.isNil(user.ledgerUid)) {
            return user;
        }

        this.setSignerRoot();
        let item = await this.sendListen(new UserAddCommand({
            roles: [],
            cryptoKey: { value: user.cryptoKey.publicKey, algorithm: user.cryptoKey.algorithm },
            description: user.preferences.name,
        }));
        user.ledgerUid = item.uid;
        return user;
    }

    public async userRootGet(): Promise<UserEntity> {
        return UserEntity.findOneBy({ ledgerUid: LedgerService.USER_ROOT_LEDGER_UID });
    }

    public async userRootId(): Promise<number> {
        let item = await this.userRootGet();
        return item.id;
    }

    public async userRootLedgerGet(): Promise<LedgerUser> {
        return this.sendListen(new UserGetCommand({ uid: LedgerService.USER_ROOT_LEDGER_UID, details: ['cryptoKey', 'roles', 'description'] }));
    }

    // --------------------------------------------------------------------------
    //
    //  Other Methods
    //
    // --------------------------------------------------------------------------

    public async initialize(): Promise<void> {
        try {
            await this.monitor.start();
        }
        catch (error) {
            this.error(`Unable to connect and monitor blocks: "${error.message}"`, error);
        }
    }

    public sendListen<U, V>(command: ITransportCommandAsync<U, V>, options?: ITransportCommandOptions, ledgerName?: string): Promise<V> {
        return this.api.ledgerRequestSendListen(command, options, ledgerName);
    }

    public setSigner(uid: string | ILedgreable): void {
        if (_.isObject(uid)) {
            uid = uid.ledgerUid;
        }
        let isDisableDecryption = uid === LedgerService.USER_ROOT_LEDGER_UID;
        this.api.signer = { uid, isDisableDecryption };
    }

    public setSignerRoot(): void {
        this.setSigner(LedgerService.USER_ROOT_LEDGER_UID);
    }
}