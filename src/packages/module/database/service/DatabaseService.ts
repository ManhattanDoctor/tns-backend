import { Injectable } from '@nestjs/common';
import { Logger, LoggerWrapper } from '@ts-core/common';
import { SelectQueryBuilder } from 'typeorm';
import { AuctionEntity, CoinEntity, NicknameEntity, UserEntity } from '@project/module/database/entity';
import { CoinBalanceEntity } from '../entity';
import * as _ from 'lodash';

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
    //  User Methods
    //
    // --------------------------------------------------------------------------

    public async userGet(idOrUid: string | number): Promise<UserEntity> {
        let query = UserEntity.createQueryBuilder('user');
        if (_.isNumber(idOrUid)) {
            query.where('user.id  = :id', { id: idOrUid });
        }
        else if (_.isString(idOrUid)) {
            query.where('user.uid  = :uid', { uid: idOrUid });
        }
        this.addUserRelations(query);
        return query.getOne();
    }

    public addUserRelations<T = any>(query: SelectQueryBuilder<T>): void { }

    // --------------------------------------------------------------------------
    //
    //  Auction Methods
    //
    // --------------------------------------------------------------------------

    public async auctionGet(idOrUid: string | number): Promise<AuctionEntity> {
        let query = AuctionEntity.createQueryBuilder('auction');
        if (_.isNumber(idOrUid)) {
            query.where('auction.id  = :id', { id: idOrUid });
        }
        else if (_.isString(idOrUid)) {
            query.where('auction.uid  = :uid', { uid: idOrUid });
        }
        this.addAuctionRelations(query);
        return query.getOne();
    }

    public addAuctionRelations<T = any>(query: SelectQueryBuilder<T>): void { }

    // --------------------------------------------------------------------------
    //
    //  Nickname Methods
    //
    // --------------------------------------------------------------------------

    public async nicknameGet(idOrUid: string | number): Promise<NicknameEntity> {
        let query = NicknameEntity.createQueryBuilder('nickname');
        if (_.isNumber(idOrUid)) {
            query.where('nickname.id  = :id', { id: idOrUid });
        }
        else if (_.isString(idOrUid)) {
            query.where('nickname.uid  = :uid', { uid: idOrUid });
        }
        this.addNicknameRelations(query);
        return query.getOne();
    }

    public addNicknameRelations<T = any>(query: SelectQueryBuilder<T>): void { }

    // --------------------------------------------------------------------------
    //
    //  Coin Methods
    //
    // --------------------------------------------------------------------------

    public async coinGet(idOrUid: string | number): Promise<CoinEntity> {
        let query = CoinEntity.createQueryBuilder('coin');
        if (_.isNumber(idOrUid)) {
            query.where('coin.id  = :id', { id: idOrUid });
        }
        else if (_.isString(idOrUid)) {
            query.where('coin.uid  = :uid', { uid: idOrUid });
        }
        this.addCoinRelations(query);
        return query.getOne();
    }

    public async coinBalanceGet(uid: string, coinUid: string): Promise<CoinBalanceEntity> {
        let query = CoinBalanceEntity.createQueryBuilder('coinBalance');
        query.where('coinBalance.uid = :uid', { uid });
        query.andWhere('coinBalance.coinUid = :coinUid', { coinUid });
        this.addCoinBalanceRelations(query);
        this.addCoinRelations(query);
        return query.getOne();
    }

    public addCoinRelations<T = any>(query: SelectQueryBuilder<T>): void { }

    public addCoinBalanceRelations<T = any>(query: SelectQueryBuilder<T>): void {
        // query.leftJoinAndSelect('coinBalance.coin', 'coin');
    }
}
