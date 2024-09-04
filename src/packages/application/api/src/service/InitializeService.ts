import { Injectable } from '@nestjs/common';
import { Logger, Transport, ExtendedError, LoggerWrapper } from '@ts-core/common';
import { DatabaseService } from '@project/module/database/service';
import * as _ from 'lodash';
import { LedgerApiClient, LedgerMonitor } from '@project/module/ledger/service';
import { LedgerService } from '@project/module/ledger/service';
import { UserService } from '@project/module/user/service';
import { TransportSocket } from '@ts-core/socket-server';
import { FaceService } from '@project/module/face/service';

@Injectable()
export class InitializeService extends LoggerWrapper {
    // --------------------------------------------------------------------------
    //
    //  Properties
    //
    // --------------------------------------------------------------------------



    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(
        logger: Logger,
        private transport: Transport,
        private database: DatabaseService,
        private ledger: LedgerService,
        private user: UserService,
        private api: LedgerApiClient,
        private monitor: LedgerMonitor,
        private socket: TransportSocket,
        private face: FaceService
    ) {
        super(logger);
    }

    // --------------------------------------------------------------------------
    //
    //  Private Methods
    //
    // --------------------------------------------------------------------------

    private async userRootCheck(): Promise<void> {
        let userRoot = await this.ledger.userRootGet();
        if (_.isNil(userRoot)) {
            throw new ExtendedError(`Unable to find default user: please seed database`);
        }

        let userRootLedger = await this.ledger.userRootLedgerGet();
        if (_.isNil(userRootLedger)) {
            throw new ExtendedError(`Unable to find default ledger user: please check ledger chaincode`);
        }

        if (userRootLedger.cryptoKey.value !== userRoot.cryptoKey.publicKey) {
            throw new ExtendedError(`Ledger root user has different key from the default user: probably it was changed directly`);
        }
        this.log(`User root was founded`);
        /*
        let cryptoKey = user.cryptoKey;
        if (cryptoKey.publicKey !== ROOT_USER_CRYPTO_KEY_PUBLIC) {
            this.log(`Ledger root user crypto key matches default user key`);
            return;
        }
        this.log(`Ledger root user has default crypto key: changing it...`);

        let keys = Ed25519.keys();
        let algorithm = Ed25519.ALGORITHM;

        this.api.setSigner({ uid, isDisableDecryption: true });
        await this.api.ledgerRequestSendListen(new UserCryptoKeyChangeCommand({ uid, cryptoKey: { algorithm, value: keys.publicKey } }));

        cryptoKey.algorithm = Ed25519.ALGORITHM;
        cryptoKey.publicKey = keys.publicKey;
        cryptoKey.privateKey = await this.transport.sendListen(new CryptoEncryptCommand({ type: CryptoKeyType.DATABASE, value: keys.privateKey }));

        ValidateUtil.validate(cryptoKey);
        await this.database.userCryptoKey.save(cryptoKey);
        this.log(`Ledger root user default crypto key changed successfully`);
        */
    }

    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    public async initialize(): Promise<void> {
        await this.ledger.initialize();

        // console.log(await this.face.search(''));
        // console.log(await this.ledger.coinAdd('TEST', 0));
        // console.log(await this.ledger.coinEmit(LedgerService.USER_ROOT_LEDGER_UID, 'TEST', '100'));
        // console.log(await this.ledger.coinObjectBalanceGet('TEST', LedgerService.USER_ROOT_LEDGER_UID));
        // console.log(await this.ledger.userRemove());
        // console.log(await this.ledger.companyCoinList({} as any));
        // console.log(await this.ledger.coinRemove(LedgerCoinIdPreset.RUB));
        // console.log(await this.ledger.companyRemove());
        // console.log(await this.ledger.userRemove());
        // console.log(await this.ledger.billAdd(LedgerService.USER_ROOT_LEDGER_UID, '200', 'Hello 2'));
        // console.log(await this.ledger.billAdd(LedgerService.USER_ROOT_LEDGER_UID, '200', 'Hello 2'));
        // console.log(await this.ledger.companyUserSet([LedgerCompanyRole.COIN_MANAGER, LedgerCompanyRole.COMPANY_MANAGER]));
        // console.log(await this.ledger.companyUserRoles());
        // console.log(await this.ledger.billRemove('bill/15032343764286/618b6b1ec0cd1f605032e8ed73c086c41fc2ecd0f63e55452c565efe526b1d9a'));
        // console.log(await this.ledger.coinRemove('RUB'));


        // this.transport.send(new LedgerBlockParseCommand({ number: 8 }));
        // this.transport.send(new CompanyUserUpdateCommand({ uid: 'user/15054457122661/7675a0ea18f71bc549ed8831bb3c9dd4db6a0ea3442d0eb72370a917ab07e4de', companyUid: LedgerService.COMPANY_ROOT_LEDGER_UID }));

        // await this.userRootCheck();
    }
}