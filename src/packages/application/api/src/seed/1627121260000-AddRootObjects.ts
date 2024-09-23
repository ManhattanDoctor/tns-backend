import { MigrationInterface, QueryRunner } from 'typeorm';
import { CoinBalanceEntity, CoinEntity, NicknameEntity, UserEntity } from '@project/module/database/entity';
import { User, UserStatus, Variables as AclVariables, UserRole } from '@project/common/hlf/acl';
import { Variables as AuctionVariable } from '@project/common/hlf/auction';
import { CoinBalance } from '@hlf-core/common';
import * as _ from 'lodash';

export class AddRootObjects1627121260000 implements MigrationInterface {

    // --------------------------------------------------------------------------
    //
    //  Private Methods
    //
    // --------------------------------------------------------------------------

    private async userAdd(runner: QueryRunner): Promise<void> {
        let repository = runner.connection.getRepository(UserEntity);

        let platform = new UserEntity();
        platform.uid = User.createUid(AclVariables.platform.address);
        platform.status = UserStatus.ACTIVE;
        platform.address = AclVariables.platform.address;
        platform.inviterUid = AclVariables.platform.uid;
        platform.nicknameUid = AclVariables.platform.nicknameUid;
        await repository.save(platform);

        let team = new UserEntity();
        team.uid = User.createUid(AclVariables.team.address);
        team.status = UserStatus.ACTIVE;
        team.address = AclVariables.team.address;
        team.inviterUid = AclVariables.platform.uid;
        await repository.save(team);

        let root = new UserEntity();
        root.uid = User.createUid(AclVariables.root.address);
        root.roles = Object.values(UserRole);
        root.status = UserStatus.ACTIVE;
        root.address = AclVariables.root.address;
        root.inviterUid = AclVariables.platform.uid;
        await repository.save(root);
    }

    private async coinAdd(runner: QueryRunner): Promise<void> {
        let coin = new CoinEntity();
        coin.uid = AuctionVariable.coin.uid;
        coin.coinId = AuctionVariable.coin.coinId;
        coin.decimals = AuctionVariable.coin.decimals;
        coin.ownerUid = AclVariables.platform.uid;
        coin.balance = new CoinBalance();
        coin.balance.held = coin.balance.burned = '0';
        coin.balance.inUse = coin.balance.emitted = AuctionVariable.coin.amount;
        coin = await runner.connection.getRepository(CoinEntity).save(coin);

        let balance = new CoinBalanceEntity();
        balance.uid = AclVariables.root.uid;
        balance.held = '0';
        balance.coinUid = coin.uid;
        balance.decimals = coin.decimals;
        balance.inUse = balance.total = AuctionVariable.coin.amount;
        balance.coinId = coin.id;
        balance = await runner.connection.getRepository(CoinBalanceEntity).save(balance);
    }

    private async nicknameAdd(runner: QueryRunner): Promise<void> {
        let nickname = new NicknameEntity();
        nickname.uid = AclVariables.platform.nicknameUid;
        nickname.nickname = AclVariables.platform.nickname;
        nickname.ownerUid = AclVariables.platform.uid;
        nickname.parentUid = null;
        nickname = await runner.connection.getRepository(NicknameEntity).save(nickname);
    }

    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    public async up(runner: QueryRunner): Promise<any> {
        let repository = runner.connection.getRepository(UserEntity);
        if (await repository.count() > 0) {
            return;
        }
        await this.userAdd(runner);
        await this.coinAdd(runner);
        await this.nicknameAdd(runner);
    }

    public async down(runner: QueryRunner): Promise<any> { }
}
