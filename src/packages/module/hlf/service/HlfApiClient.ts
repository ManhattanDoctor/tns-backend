import { Injectable } from '@nestjs/common';
import { ILedgerRequestRequest, LedgerApiClient as BaseLedgerApiClient } from '@hlf-explorer/common';
import { TransportCryptoManager, ITransportCommand, ITransportCommandOptions, TransportCommandAsync, Logger, ILogger, ClassType, DateUtil, ExtendedError } from '@ts-core/common';
import { TransportCryptoManagerMetamaskBackend } from '@ts-core/crypto-metamask-backend';
import * as _ from 'lodash';

@Injectable()
export class HlfApiClient extends BaseLedgerApiClient {
    // --------------------------------------------------------------------------
    //
    // 	Properties
    //
    // --------------------------------------------------------------------------

    private manager: TransportCryptoManager;

    private userId: string;
    private publicKey: string;
    private privateKey: string;

    // --------------------------------------------------------------------------
    //
    // 	Constructor
    //
    // --------------------------------------------------------------------------

    constructor(logger: ILogger, url?: string, ledgerNameDefault?: string) {
        super(logger, url, ledgerNameDefault);
        this.manager = new TransportCryptoManagerMetamaskBackend();
        this.setRoot();
    }

    // --------------------------------------------------------------------------
    //
    // 	Protected Methods
    //
    // --------------------------------------------------------------------------

    protected async createRequest<U>(command: ITransportCommand<U>, options?: ITransportCommandOptions, ledgerName?: string): Promise<ILedgerRequestRequest> {
        let item = await super.createRequest<U>(command, options, ledgerName);
        options = item.options;

        options['userId'] = this.userId;
        options['signature'] = await TransportCryptoManager.sign(command, this.manager, { publicKey: this.publicKey, privateKey: this.privateKey });
        return item;
    }

    // --------------------------------------------------------------------------
    //
    // 	Public Methods
    //
    // --------------------------------------------------------------------------

    public setRoot(): void {
        this.userId = ROOT_USER_UID;
        this.publicKey = ROOT_USER_PUBLIC_KEY;
        this.privateKey = ROOT_USER_PRIVATE_KEY;
    }

    public setSecond(): void {
        this.userId = SECOND_USER_UID;
        this.publicKey = SECOND_USER_PUBLIC_KEY;
        this.privateKey = SECOND_USER_PRIVATE_KEY;
    }

    public setThird(): void {
        this.userId = THIRD_USER_UID;
        this.publicKey = THIRD_USER_PUBLIC_KEY;
        this.privateKey = THIRD_USER_PRIVATE_KEY;
    }

    public async getCommandByEvent<U extends ITransportCommand<T>, T = any>(classType: ClassType<U>, requestId: string): Promise<U> {
        let transaction = await this.getTransaction(requestId);
        if (_.isNil(transaction)) {
            throw new ExtendedError(`Unable to find transaction by "${requestId}" request`);
        }
        if (transaction.validationCode !== 0) {
            throw new ExtendedError(`Transaction "${requestId}" finished by ${transaction.validationCode} validationCode`);
        }

        let item = new classType(transaction.request.request);
        if (item instanceof TransportCommandAsync) {
            item.response(transaction.response.response);
        }
        return item;
    }
}

export const COIN_UID = `coin/user/0x0000000000000000000000000000000000000000/TRUE`;
export const PLATFORM_USER_UID = 'user/0x0000000000000000000000000000000000000000';

export const ROOT_USER_UID = `user/0x1fc1e02161515812ddfe05b32bb0accc2d5d739e`;
export const ROOT_USER_PUBLIC_KEY = `0x1fc1e02161515812ddFE05B32Bb0ACCC2D5D739e`;
export const ROOT_USER_PRIVATE_KEY = `096d59a4fa23e40e5b360aadd037fb7c61b1043852d79e018e4cd1f098658b25`;

export const SECOND_USER_UID = `user/0x8e20ea4fa57f19624b9878173589852ca4d41dad`;
export const SECOND_USER_PUBLIC_KEY = `0x8e20EA4fA57f19624B9878173589852cA4D41DAD`;
export const SECOND_USER_PRIVATE_KEY = `cae6ce3996518dcc8bf2c6bf776dadda2719e6261d698b6205a9e77f053e008a`;

export const THIRD_USER_UID = `user/0x648ef39f243763152c49e20f010f0df93efb9d36`;
export const THIRD_USER_PUBLIC_KEY = `0x648ef39f243763152c49e20f010f0df93efb9d36`;
export const THIRD_USER_PRIVATE_KEY = `5f1003307320bc335b7888cf7e3dddf3e8f17d7ce4237e01eb9b8e14097c85be`;
