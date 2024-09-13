"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddRootObjects1627121260000 = void 0;
const entity_1 = require("@project/module/database/entity");
const acl_1 = require("@project/common/hlf/acl");
const auction_1 = require("@project/common/hlf/auction");
const common_1 = require("@hlf-core/common");
class AddRootObjects1627121260000 {
    async userAdd(runner) {
        let repository = runner.connection.getRepository(entity_1.UserEntity);
        let platform = new entity_1.UserEntity();
        platform.uid = acl_1.User.createUid(acl_1.Variables.platform.address);
        platform.status = acl_1.UserStatus.ACTIVE;
        platform.inviterUid = acl_1.Variables.platform.uid;
        platform.nicknameUid = acl_1.Variables.platform.nicknameUid;
        await repository.save(platform);
        let team = new entity_1.UserEntity();
        team.uid = acl_1.User.createUid(acl_1.Variables.team.address);
        team.status = acl_1.UserStatus.ACTIVE;
        team.inviterUid = acl_1.Variables.platform.uid;
        await repository.save(team);
        let root = new entity_1.UserEntity();
        root.uid = acl_1.User.createUid(acl_1.Variables.root.address);
        root.roles = Object.values(acl_1.UserRole);
        root.status = acl_1.UserStatus.ACTIVE;
        root.inviterUid = acl_1.Variables.platform.uid;
        await repository.save(root);
    }
    async coinAdd(runner) {
        let coin = new entity_1.CoinEntity();
        coin.uid = auction_1.Variables.coin.uid;
        coin.coinId = auction_1.Variables.coin.coinId;
        coin.decimals = auction_1.Variables.coin.decimals;
        coin.ownerUid = acl_1.Variables.platform.uid;
        coin.balance = new common_1.CoinBalance();
        coin.balance.held = coin.balance.burned = '0';
        coin.balance.inUse = coin.balance.emitted = auction_1.Variables.coin.amount;
        coin = await runner.connection.getRepository(entity_1.CoinEntity).save(coin);
        let balance = new entity_1.CoinBalanceEntity();
        balance.uid = acl_1.Variables.root.uid;
        balance.held = '0';
        balance.inUse = balance.total = auction_1.Variables.coin.amount;
        balance.coinId = coin.id;
        balance = await runner.connection.getRepository(entity_1.CoinBalanceEntity).save(balance);
    }
    async nicknameAdd(runner) {
        let nickname = new entity_1.NicknameEntity();
        nickname.uid = acl_1.Variables.platform.nicknameUid;
        nickname.nickname = acl_1.Variables.platform.nickname;
        nickname.ownerUid = acl_1.Variables.platform.uid;
        nickname.parentUid = null;
        nickname = await runner.connection.getRepository(entity_1.NicknameEntity).save(nickname);
    }
    async up(runner) {
        let repository = runner.connection.getRepository(entity_1.UserEntity);
        if (await repository.count() > 0) {
            return;
        }
        await this.userAdd(runner);
        await this.coinAdd(runner);
        await this.nicknameAdd(runner);
    }
    async down(runner) { }
}
exports.AddRootObjects1627121260000 = AddRootObjects1627121260000;
