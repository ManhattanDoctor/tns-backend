"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddRootActions1627121260020 = void 0;
const service_1 = require("@project/module/ledger/service");
const company_1 = require("@project/module/database/company");
const user_1 = require("@project/module/database/user");
const action_1 = require("@project/module/database/action");
const platform_1 = require("@project/common/platform");
const coin_1 = require("@project/common/ledger/coin");
const common_1 = require("@hlf-explorer/common");
const common_2 = require("@ts-core/common");
const ledger_1 = require("@project/common/ledger");
const coin_2 = require("@project/module/database/coin");
class AddRootActions1627121260020 {
    async up(queryRunner) {
        let repository = queryRunner.connection.getRepository(action_1.ActionEntity);
        let count = await repository.count();
        if (count > 0) {
            return;
        }
        let user = await queryRunner.connection.getRepository(user_1.UserEntity).findOneByOrFail({ ledgerUid: service_1.LedgerService.USER_ROOT_LEDGER_UID });
        let company = await queryRunner.connection.getRepository(company_1.CompanyEntity).findOneByOrFail({ ledgerUid: service_1.LedgerService.COMPANY_ROOT_LEDGER_UID });
        let coinRub = await queryRunner.connection.getRepository(coin_2.CoinEntity).findOneByOrFail({ ledgerUid: coin_1.LedgerCoin.createUid(service_1.LedgerService.COMPANY_ROOT_LEDGER_UID, coin_1.LedgerCoinIdPreset.RUB) });
        let items = new Array();
        let transaction = common_2.TransformUtil.toClass(common_1.LedgerBlockTransaction, { date: user.createdDate, validationCode: 0, requestId: ledger_1.ROOT_REQUEST_ID, requestUserId: user.ledgerUid });
        items.push(new action_1.ActionEntity(platform_1.ActionType.USER_ADDED, service_1.LedgerService.USER_ROOT_LEDGER_UID, { userUid: user.ledgerUid, companyUid: company.ledgerUid }, transaction));
        items.push(new action_1.ActionEntity(platform_1.ActionType.COMPANY_ADDED, service_1.LedgerService.COMPANY_ROOT_LEDGER_UID, { userUid: user.ledgerUid, companyUid: company.ledgerUid }, transaction));
        items.push(new action_1.ActionEntity(platform_1.ActionType.COMPANY_USER_ADDED, service_1.LedgerService.COMPANY_ROOT_LEDGER_UID, { userUid: user.ledgerUid, companyUid: company.ledgerUid }, transaction));
        items.push(new action_1.ActionEntity(platform_1.ActionType.COIN_ADDED, coinRub.ledgerUid, { userUid: user.ledgerUid, companyUid: company.ledgerUid, coinUid: coinRub.ledgerUid }, transaction));
        items.push(new action_1.ActionEntity(platform_1.ActionType.COIN_EMITTED_SENT, coinRub.ledgerUid, { coinUid: coinRub.ledgerUid, amount: ledger_1.ROOT_COIN_RUB_AMOUNT, decimals: ledger_1.ROOT_COIN_RUB_DECIMALS }, transaction));
        items.push(new action_1.ActionEntity(platform_1.ActionType.COIN_EMITTED_RECEIVE, user.ledgerUid, { coinUid: coinRub.ledgerUid, amount: ledger_1.ROOT_COIN_RUB_AMOUNT, decimals: ledger_1.ROOT_COIN_RUB_DECIMALS }, transaction));
        await repository.save(items);
    }
    async down(queryRunner) { }
}
exports.AddRootActions1627121260020 = AddRootActions1627121260020;
