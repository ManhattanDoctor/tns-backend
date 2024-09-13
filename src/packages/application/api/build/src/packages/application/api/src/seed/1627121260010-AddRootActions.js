"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddRootActions1627121260010 = void 0;
const common_1 = require("@hlf-explorer/common");
const common_2 = require("@ts-core/common");
const entity_1 = require("@project/module/database/entity");
const acl_1 = require("@project/common/hlf/acl");
const auction_1 = require("@project/common/hlf/auction");
class AddRootActions1627121260010 {
    async up(runner) {
        let repository = runner.connection.getRepository(entity_1.ActionEntity);
        if (await repository.count() > 0) {
            return;
        }
        let user = await runner.connection.getRepository(entity_1.UserEntity).findOneByOrFail({ uid: acl_1.Variables.root.uid });
        let coin = await runner.connection.getRepository(entity_1.CoinEntity).findOneByOrFail({ uid: auction_1.Variables.coin.uid });
        let nickname = await runner.connection.getRepository(entity_1.NicknameEntity).findOneByOrFail({ uid: acl_1.Variables.platform.nicknameUid });
        let items = new Array();
        let transaction = common_2.TransformUtil.toClass(common_1.LedgerBlockTransaction, { date: user.created, validationCode: 0, requestId: acl_1.Variables.transaction.hash, requestUserId: user.uid });
        await repository.save(items);
    }
    async down(queryRunner) { }
}
exports.AddRootActions1627121260010 = AddRootActions1627121260010;
