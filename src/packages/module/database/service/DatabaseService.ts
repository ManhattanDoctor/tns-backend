import { Injectable } from '@nestjs/common';
import { Logger, LoggerWrapper } from '@ts-core/common';
import { SelectQueryBuilder } from 'typeorm';
import { UserEntity, UserRoleEntity } from '../user';
import { CompanyEntity } from '../company';
import { CompanyUndefinedError, UserUndefinedError } from '@project/module/core/middleware';
import { CompanyStatus } from '@project/common/platform/company';
import { CoinBalanceEntity, CoinEntity } from '@project/module/database/coin';
import { IsUser } from '@project/common/ledger';
import * as _ from 'lodash';
import { BillEntity } from '@project/module/database/bill';
import { TerminalEntity } from '@project/module/database/terminal';
import { TerminalSubscriptionEntity } from '../terminal';

@Injectable()
export class DatabaseService extends LoggerWrapper {
    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(logger: Logger) {
        super(logger);
    }

    // --------------------------------------------------------------------------
    //
    //  Query Methods
    //
    // --------------------------------------------------------------------------

    public addUserRelations<T = any>(query: SelectQueryBuilder<T>): void {
        query.leftJoinAndSelect('user.company', 'company');
        query.leftJoinAndSelect('user.cryptoKey', 'userCryptoKey');
        query.leftJoinAndSelect('user.preferences', 'userPreferences');
    }

    public addCompanyRelations<T = any>(query: SelectQueryBuilder<T>, userId?: number | string | UserEntity): void {
        query.leftJoinAndSelect('company.preferences', 'companyPreferences');
        if (userId instanceof UserEntity) {
            userId = userId.id;
        }
        if (!_.isNil(userId)) {
            query.leftJoinAndMapMany('company.userRoles', UserRoleEntity, 'companyRole', `companyRole.userId = ${userId} AND companyRole.companyId = company.id`)
        }
    }

    // --------------------------------------------------------------------------
    //
    //  User Methods
    //
    // --------------------------------------------------------------------------

    public async userGet(idOrUidLogin: string | number): Promise<UserEntity> {
        let query = UserEntity.createQueryBuilder('user');
        if (_.isString(idOrUidLogin)) {
            if (idOrUidLogin.indexOf('@') === 0) {
                query.where(`user.uid  = :uid`, { uid: idOrUidLogin });
            }
            else if (IsUser(idOrUidLogin)) {
                query.where(`user.ledgerUid  = :ledgerUid`, { ledgerUid: idOrUidLogin });
            }
            else {
                query.where(`user.login  = :login`, { login: idOrUidLogin });
            }
        }
        else if (_.isNumber(idOrUidLogin)) {
            query.where(`user.id  = :id`, { id: idOrUidLogin });
        }
        else {
            throw new UserUndefinedError();
        }

        this.addUserRelations(query);
        this.addCompanyRelations(query, 'user.id');
        return query.getOne();
    }

    public async userGetByUid(uid: string): Promise<UserEntity> {
        let query = UserEntity.createQueryBuilder('user');
        this.addUserRelations(query);
        this.addCompanyRelations(query, 'user.id');
        query.where(`userPreferences.uid  = :uid`, { uid }).getOne();
        return query.getOne();
    }

    public async userIsSubscribed(userId: number, terminalId: number): Promise<boolean> {
        let subscription = await TerminalSubscriptionEntity.findOneBy({ userId, terminalId });
        return _.isNil(subscription) || subscription.isSubscribed;
    }
    public async userIsNotSubscribed(userId: number, terminalId: number): Promise<boolean> {
        return !(await this.userIsSubscribed(userId, terminalId));
    }

    // --------------------------------------------------------------------------
    //
    //  Company Methods
    //
    // --------------------------------------------------------------------------

    public async companyGet(idOrLedgerUid: string | number, userId?: number | UserEntity): Promise<CompanyEntity> {
        let query = CompanyEntity.createQueryBuilder('company');
        if (_.isString(idOrLedgerUid)) {
            query.where(`company.ledgerUid  = :ledgerUid`, { ledgerUid: idOrLedgerUid });
        }
        else if (_.isNumber(idOrLedgerUid)) {
            query.where(`company.id  = :id`, { id: idOrLedgerUid });
        }
        else {
            throw new CompanyUndefinedError();
        }

        this.addCompanyRelations(query, userId);
        return query.getOne();
    }

    public async companyStatus(item: CompanyEntity, status: CompanyStatus): Promise<CompanyEntity> {
        item.status = status;
        return item.save();
    }

    // --------------------------------------------------------------------------
    //
    //  Coin Methods
    //
    // --------------------------------------------------------------------------

    public async coinGet(idOrLedgerUid: string | number): Promise<CoinEntity> {
        let query = CoinEntity.createQueryBuilder('coin');
        if (_.isString(idOrLedgerUid)) {
            query.where(`coin.ledgerUid  = :ledgerUid`, { ledgerUid: idOrLedgerUid });
        }
        else if (_.isNumber(idOrLedgerUid)) {
            query.where(`coin.id  = :id`, { id: idOrLedgerUid });
        }
        this.addCoinRelations(query);
        return query.getOne();
    }

    public async coinBalanceGet(coinUid: string, objectUid: string): Promise<CoinBalanceEntity> {
        let query = CoinBalanceEntity.createQueryBuilder('coinBalance');
        query.leftJoinAndSelect('coinBalance.coin', 'coin');
        query.where(`coin.ledgerUid = :coinUid`, { coinUid });
        query.andWhere(`coinBalance.ledgerUid = :objectUid`, { objectUid });
        this.addCoinRelations(query);
        return query.getOne();
    }

    public addCoinRelations<T = any>(query: SelectQueryBuilder<T>): void {

    }

    public addCoinBalanceRelations<T = any>(query: SelectQueryBuilder<T>): void {
        query.leftJoinAndSelect('coinBalance.coin', 'coin');
    }

    // --------------------------------------------------------------------------
    //
    //  Bill Methods
    //
    // --------------------------------------------------------------------------

    public async billGet(idOrLedgerUid: string | number): Promise<BillEntity> {
        let query = BillEntity.createQueryBuilder('bill');
        if (_.isString(idOrLedgerUid)) {
            query.where(`bill.ledgerUid  = :ledgerUid`, { ledgerUid: idOrLedgerUid });
        }
        else if (_.isNumber(idOrLedgerUid)) {
            query.where(`bill.id  = :id`, { id: idOrLedgerUid });
        }
        this.addBillRelations(query);
        return query.getOne();
    }

    public addBillRelations<T = any>(query: SelectQueryBuilder<T>): void {
        query.leftJoinAndSelect('bill.coin', 'coin');
    }

    // --------------------------------------------------------------------------
    //
    //  Terminal Methods
    //
    // --------------------------------------------------------------------------

    public async terminalGet(idOrLedgerUid: string | number): Promise<TerminalEntity> {
        let query = TerminalEntity.createQueryBuilder('terminal');
        if (_.isString(idOrLedgerUid)) {
            query.where(`terminal.ledgerUid  = :ledgerUid`, { ledgerUid: idOrLedgerUid });
        }
        else if (_.isNumber(idOrLedgerUid)) {
            query.where(`terminal.id  = :id`, { id: idOrLedgerUid });
        }
        this.addTerminalRelations(query);
        return query.getOne();
    }

    public addTerminalRelations<T = any>(query: SelectQueryBuilder<T>): void {
        query.leftJoinAndSelect('terminal.cryptoKey', 'terminalCryptoKey');
    }
}
