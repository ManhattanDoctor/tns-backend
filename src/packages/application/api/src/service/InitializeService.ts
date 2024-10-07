import { Injectable } from '@nestjs/common';
import { Logger, ISignature, Transport, ObjectUtil, LoggerWrapper } from '@ts-core/common';
import { DatabaseService } from '@project/module/database/service';
import { TransportSocket } from '@ts-core/socket-server';
import { COIN_UID, HlfService, PLATFORM_USER_UID, ROOT_USER_UID, SECOND_USER_PRIVATE_KEY, SECOND_USER_PUBLIC_KEY, SECOND_USER_UID, THIRD_USER_PRIVATE_KEY, THIRD_USER_PUBLIC_KEY, THIRD_USER_UID } from '@project/module/hlf/service';
import { UserAddCommand, UserGetCommand } from '@project/common/hlf/acl/transport';
import { TransportCryptoManagerMetamaskBackend, Metamask } from '@ts-core/crypto-metamask-backend';
import { personalSign, recoverPersonalSignature } from '@metamask/eth-sig-util';
import * as _ from 'lodash';
import { LedgerBlockParseCommand } from '@hlf-explorer/monitor';
import { AuctionBidCommand, AuctionCheckCommand, AuctionPrimaryAddCommand, AuctionSecondaryAddCommand, CoinEmitCommand, CoinTransferCommand, NicknameTransferCommand } from '@project/common/hlf/auction/transport';
import { CoinBalanceUpdateCommand, CoinUpdateCommand } from '@project/module/coin/transport';
import { Variables } from '@project/common/hlf/acl';
import { UserAddedEvent } from '@project/common/platform/transport';

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
        private socket: TransportSocket,
        private hlf: HlfService
    ) {
        super(logger);
    }

    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    public async initialize(): Promise<void> {
        await this.hlf.initialize();

        // this.transport.send(new LedgerBlockParseCommand({ number: 8 }));
        let api = this.hlf;
        /*
        api.setRoot();
        let signature: ISignature ={
            "value": "0xd4d10d55c3ad23e94fc928a01a5c40212de4f633754dc053333c7f1a24495b8100355d635785f7f13a334c85330ce37166d73cf4c9c25f43fec477919ef8e31f1b",
            "publicKey": "0x8e20ea4fa57f19624b9878173589852ca4d41dad",
            "algorithm": "KeccakMetamask",
            "nonce": "1726747980606"
        }
        console.log(signature);
        let address = Metamask.verify(`${Variables.signature.message}_${signature.nonce}`, signature.value, signature.publicKey);
        console.log(address);
        */

        api.setRoot();
        // api.sendListen(new UserAddCommand({ signature: { publicKey: SECOND_USER_PUBLIC_KEY, algorithm: TransportCryptoManagerMetamaskBackend.ALGORITHM, value: personalSign({ data: '1', privateKey: Buffer.from(SECOND_USER_PRIVATE_KEY, 'hex') }), nonce: '1' }, inviterUid: PLATFORM_USER_UID }));
        // await api.sendListen(new UserAddCommand({ signature: { publicKey: THIRD_USER_PUBLIC_KEY, algorithm: TransportCryptoManagerMetamaskBackend.ALGORITHM, value: personalSign({ data: '1', privateKey: Buffer.from(THIRD_USER_PRIVATE_KEY, 'hex') }), nonce: '1' }, inviterUid: SECOND_USER_UID }));
        // api.sendListen(new CoinTransferCommand({ to: SECOND_USER_UID, coinUid: COIN_UID, amount: '12' }));
        // await api.sendListen(new CoinTransferCommand({ to: THIRD_USER_UID, coinUid: COIN_UID, amount: '1000000' }));

        // api.setSecond();
        // await api.send(new AuctionBidCommand({ auctionUid: 'auction/renat/14998993295469' }));
        // await api.sendListen(new AuctionPrimaryAddCommand({ nickname: 'renat' }));
        // await api.send(new AuctionCheckCommand({ uid: 'auction/renat/14999073706560' }));
        // await api.send(new NicknameTransferCommand({ from: SECOND_USER_UID, to: THIRD_USER_UID }));
        // api.setThird();
        // await api.send(new AuctionBidCommand({ auctionUid: 'auction/renat/14998993295469' }));
        // await api.send(new AuctionCheckCommand({ uid: 'auction/renat/14998993295469' }));
        // await api.send(new NicknameTransferCommand({ from: THIRD_USER_UID, to: ROOT_USER_UID }));
        // await api.send(new NicknameTransferCommand({ from: THIRD_USER_UID, to: SECOND_USER_UID }));
        // await api.send(new AuctionSecondaryAddCommand({ price: { coinId: 'TRUE', value: '120' } }));
        // console.log(await api.ledgerRequestSendListen(new TransportFabricCommandAsync('AUCTION:AuctionSecondaryAdd', { price: { coinId: 'TRUE', value: '1000' } })));

        // console.log(await api.ledgerRequestSendListen(new TransportFabricCommandAsync('AUCTION:AuctionBidConditionsGet', { auctionUid: 'auction/renat' })));
        // console.log(await api.ledgerRequestSendListen(new TransportFabricCommandAsync('AUCTION:AuctionBid', { auctionUid: 'auction/renat' })));
        // console.log(await api.ledgerRequestSendListen(new TransportFabricCommandAsync('AUCTION:AuctionAdd', { nickname: 'vasya' })));
        // console.log(await api.ledgerRequestSendListen(new TransportFabricCommandAsync('AUCTION:AuctionBidConditionsGet', { auctionUid: 'auction/renat' })));
        // console.log(await api.ledgerRequestSendListen(new TransportFabricCommandAsync('AUCTION:AuctionBidConditionsGet', { auctionUid: 'auction/vasya' })));
        // console.log(await api.ledgerRequestSendListen(new TransportFabricCommandAsync('AUCTION:AuctionCheck', { uid: 'auction/vasya' })));
        // console.log(await api.ledgerRequestSendListen(new TransportFabricCommandAsync('AUCTION:AuctionGet', { uid: 'auction/renat' })));
        // console.log(await api.ledgerRequestSendListen(new TransportFabricCommandAsync('AUCTION:AuctionCheck', { uid: 'auction/renat' })));
        // console.log(await api.ledgerRequestSendListen(new TransportFabricCommandAsync('AUCTION:NicknameTransfer', { to: ROOT_USER_UID })));
        // console.log(await api.ledgerRequestSendListen(new TransportFabricCommandAsync('AUCTION:AuctionCheck', { uid: 'auction/renat' })));

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