import { MigrationInterface, QueryRunner } from 'typeorm';
import * as _ from 'lodash';
import { LedgerService } from '@project/module/ledger/service';
import { CompanyEntity } from '@project/module/database/company';
import { UserEntity } from '@project/module/database/user';
import { ActionEntity } from '@project/module/database/action';
import { ActionType } from '@project/common/platform';
import { LedgerCoin, LedgerCoinIdPreset } from '@project/common/ledger/coin';
import { LedgerBlockTransaction } from '@hlf-explorer/common';
import { TransformUtil } from '@ts-core/common';
import { ROOT_COIN_RUB_AMOUNT, ROOT_COIN_RUB_DECIMALS, ROOT_REQUEST_ID } from '@project/common/ledger';
import { CoinEntity } from '@project/module/database/coin';

export class AddRootActions1627121260020 implements MigrationInterface {
    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    public async up(queryRunner: QueryRunner): Promise<any> {
        let repository = queryRunner.connection.getRepository(ActionEntity);
        let count = await repository.count();
        if (count > 0) {
            return;
        }

        let user = await queryRunner.connection.getRepository(UserEntity).findOneByOrFail({ ledgerUid: LedgerService.USER_ROOT_LEDGER_UID });
        let company = await queryRunner.connection.getRepository(CompanyEntity).findOneByOrFail({ ledgerUid: LedgerService.COMPANY_ROOT_LEDGER_UID });
        let coinRub = await queryRunner.connection.getRepository(CoinEntity).findOneByOrFail({ ledgerUid: LedgerCoin.createUid(LedgerService.COMPANY_ROOT_LEDGER_UID, LedgerCoinIdPreset.RUB) });

        let items = new Array();
        let transaction = TransformUtil.toClass(LedgerBlockTransaction, { date: user.createdDate, validationCode: 0, requestId: ROOT_REQUEST_ID, requestUserId: user.ledgerUid });

        items.push(new ActionEntity(ActionType.USER_ADDED, LedgerService.USER_ROOT_LEDGER_UID, { userUid: user.ledgerUid, companyUid: company.ledgerUid }, transaction));

        items.push(new ActionEntity(ActionType.COMPANY_ADDED, LedgerService.COMPANY_ROOT_LEDGER_UID, { userUid: user.ledgerUid, companyUid: company.ledgerUid }, transaction));
        items.push(new ActionEntity(ActionType.COMPANY_USER_ADDED, LedgerService.COMPANY_ROOT_LEDGER_UID, { userUid: user.ledgerUid, companyUid: company.ledgerUid }, transaction));

        items.push(new ActionEntity(ActionType.COIN_ADDED, coinRub.ledgerUid, { userUid: user.ledgerUid, companyUid: company.ledgerUid, coinUid: coinRub.ledgerUid }, transaction));

        items.push(new ActionEntity(ActionType.COIN_EMITTED_SENT, coinRub.ledgerUid, { coinUid: coinRub.ledgerUid, amount: ROOT_COIN_RUB_AMOUNT, decimals: ROOT_COIN_RUB_DECIMALS }, transaction));
        items.push(new ActionEntity(ActionType.COIN_EMITTED_RECEIVE, user.ledgerUid, { coinUid: coinRub.ledgerUid, amount: ROOT_COIN_RUB_AMOUNT, decimals: ROOT_COIN_RUB_DECIMALS }, transaction));

        await repository.save(items);
    }

    public async down(queryRunner: QueryRunner): Promise<any> { }
}
