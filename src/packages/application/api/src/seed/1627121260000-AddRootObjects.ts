import { MigrationInterface, QueryRunner } from 'typeorm';
import * as _ from 'lodash';
import { UserCryptoKeyEntity, UserEntity, UserPreferencesEntity, UserRoleEntity } from '@project/module/database/user';
import { UserType, UserStatus, UserResource } from '@project/common/platform/user';
import { LoginService } from '@project/module/login/service';
import { TransportCryptoManagerEd25519 } from '@ts-core/common';
import { CryptoKeyStatus } from '@project/common/platform/crypto';
import { ROOT_COIN_RUB_DECIMALS, ROOT_USER_CRYPTO_KEY_PRIVATE, ROOT_USER_CRYPTO_KEY_PUBLIC, ROOT_COIN_RUB_AMOUNT } from '@project/common/ledger';
import { UserService } from '@project/module/user/service';
import { LedgerService } from '@project/module/ledger/service';
import { CompanyEntity, CompanyPreferencesEntity } from '@project/module/database/company';
import { LedgerCompanyRole } from '@project/common/ledger/role';
import { CompanyStatus } from '@project/common/platform/company';
import { CoinBalanceEntity, CoinEntity } from '@project/module/database/coin';
import { LedgerCoin, LedgerCoinIdPreset } from '@project/common/ledger/coin';

export class AddRootObjects1627121260000 implements MigrationInterface {

    // --------------------------------------------------------------------------
    //
    //  Private Methods
    //
    // --------------------------------------------------------------------------

    private async userAdd(queryRunner: QueryRunner): Promise<void> {
        let repository = queryRunner.connection.getRepository(UserEntity);
        let ledgerUid = LedgerService.USER_ROOT_LEDGER_UID;

        let item = await repository.findOneBy({ ledgerUid });
        if (!_.isNil(item)) {
            return;
        }

        item = new UserEntity();
        item.login = LoginService.createLogin('111452810894131754642', UserResource.GOOGLE);
        item.type = UserType.ADMINISTRATOR;
        item.status = UserStatus.ACTIVE;
        item.resource = UserResource.GOOGLE;
        item.ledgerUid = ledgerUid;

        let preferences = (item.preferences = new UserPreferencesEntity());
        preferences.name = 'Renat Gubaev';
        preferences.phone = '+79099790296';
        preferences.email = 'renat.gubaev@gmail.com';
        preferences.locale = 'ru';
        preferences.isMale = true;
        preferences.picture = 'https://lh3.googleusercontent.com/a-/AOh14Gi3OO8vUAOm95cVHW-JOIzidhXd8ywkxtXm3f6r=s96-c';
        preferences.birthday = new Date(1986, 11, 7);
        preferences.location = 'Moscow, Russia';
        preferences.description = 'Default Administrator';

        let cryptoKey = item.cryptoKey = new UserCryptoKeyEntity();
        cryptoKey.status = CryptoKeyStatus.ACTIVE;
        cryptoKey.algorithm = TransportCryptoManagerEd25519.ALGORITHM;
        cryptoKey.publicKey = ROOT_USER_CRYPTO_KEY_PUBLIC;
        // We can't encrypt private key, because we don't know encryption key yet
        cryptoKey.privateKey = ROOT_USER_CRYPTO_KEY_PRIVATE;

        item = await repository.save(item);
    }

    private async companyAdd(queryRunner: QueryRunner): Promise<void> {
        let repository = queryRunner.connection.getRepository(CompanyEntity);
        let ledgerUid = LedgerService.COMPANY_ROOT_LEDGER_UID;

        let item = await repository.findOneBy({ ledgerUid });
        if (!_.isNil(item)) {
            return;
        }

        item = new CompanyEntity();
        item.status = CompanyStatus.ACTIVE;
        item.ledgerUid = ledgerUid;
        item.rolesTotal = { COMPANY_COIN_MANAGER: '1', COMPANY_COMPANY_MANAGER: '1', COMPANY_PROJECT_MANAGER: '1', COMPANY_USER_MANAGER: '1', EXPERT: '1', PROTECTOR: '1' };

        let preferences = item.preferences = new CompanyPreferencesEntity();
        preferences.title = 'Cvartel';
        preferences.picture = 'https://static.tildacdn.com/tild3833-6463-4936-b061-653837623761/badge.png';
        preferences.description = 'CVARTEL is a decentralized organization focused on developing open source computer vision tech for web3 and beyond. The technological basis of the company is the self-developed ML framework that is perfect for the development of state-of-the-art computer vision algorithms.';

        item = await repository.save(item);

        await queryRunner.connection.getRepository(UserEntity)
            .createQueryBuilder()
            .update({ companyId: item.id })
            .where('ledgerUid = :ledgerUid', { ledgerUid: LedgerService.USER_ROOT_LEDGER_UID })
            .execute();
    }

    private async userRolesAdd(queryRunner: QueryRunner): Promise<void> {
        let user = await queryRunner.connection.getRepository(UserEntity).findOneByOrFail({ ledgerUid: LedgerService.USER_ROOT_LEDGER_UID });
        let company = await queryRunner.connection.getRepository(CompanyEntity).findOneByOrFail({ ledgerUid: LedgerService.COMPANY_ROOT_LEDGER_UID });

        let repository = queryRunner.connection.getRepository(UserRoleEntity);
        let items = Object.values(LedgerCompanyRole).map(role => new UserRoleEntity(user.id, role, company.id));
        await repository.save(items);
    }

    private async coinAddRub(queryRunner: QueryRunner): Promise<void> {
        let repository = queryRunner.connection.getRepository(CoinEntity);
        let ledgerUid = LedgerCoin.createUid(LedgerService.COMPANY_ROOT_LEDGER_UID, LedgerCoinIdPreset.RUB);

        let item = await repository.findOneBy({ ledgerUid });
        if (!_.isNil(item)) {
            return;
        }

        let company = await queryRunner.connection.getRepository(CompanyEntity).findOneByOrFail({ ledgerUid: LedgerService.COMPANY_ROOT_LEDGER_UID });

        item = new CoinEntity();
        item.coinId = LedgerCoinIdPreset.RUB;
        item.decimals = ROOT_COIN_RUB_DECIMALS;
        item.ledgerUid = ledgerUid;
        item.companyId = company.id;
        item.held = item.burned = '0';
        item.inUse = item.total = item.emitted = ROOT_COIN_RUB_AMOUNT;
        item = await repository.save(item);

        let user = await queryRunner.connection.getRepository(UserEntity).findOneByOrFail({ ledgerUid: LedgerService.USER_ROOT_LEDGER_UID });

        let balance = new CoinBalanceEntity();
        balance.coinId = item.id;
        balance.ledgerUid = user.ledgerUid;
        balance.held = '0';
        balance.inUse = balance.total = ROOT_COIN_RUB_AMOUNT;
        await queryRunner.connection.getRepository(CoinBalanceEntity).save(balance);
    }

    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    public async up(queryRunner: QueryRunner): Promise<any> {
        await this.userAdd(queryRunner);
        await this.companyAdd(queryRunner);
        await this.userRolesAdd(queryRunner);

        await this.coinAddRub(queryRunner);
    }

    public async down(queryRunner: QueryRunner): Promise<any> { }
}
