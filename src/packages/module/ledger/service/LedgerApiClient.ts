import { ClassType } from '@ts-core/common';
import { ILogger } from '@ts-core/common';
import { Transport, ITransportCommand, ITransportCommandOptions, TransportCommandAsync } from '@ts-core/common';
import * as _ from 'lodash';
import { ILedgerRequestRequest, LedgerApiClient as CommonLedgerApiClient } from '@hlf-explorer/common';
import { ExtendedError } from '@ts-core/common';
import { DateUtil } from '@ts-core/common';
import { CryptoLedgerSignCommand } from '@project/module/crypto/transport';
import { User } from '@project/common/platform/user';

export class LedgerApiClient extends CommonLedgerApiClient {
    // --------------------------------------------------------------------------
    //
    // 	Public Properties
    //
    // --------------------------------------------------------------------------

    public signer: ISignerSettings;
    protected transport: Transport;

    // --------------------------------------------------------------------------
    //
    // 	Constructor
    //
    // --------------------------------------------------------------------------

    constructor(logger: ILogger, transport: Transport, url?: string, defaultLedgerName?: string) {
        super(logger, url, defaultLedgerName);
        this.transport = transport;
        this.settings.timeout = DateUtil.MILLISECONDS_HOUR;
        console.log(url, defaultLedgerName);
    }

    // --------------------------------------------------------------------------
    //
    // 	Protected Methods
    //
    // --------------------------------------------------------------------------

    protected async createRequest<U>(command: ITransportCommand<U>, options?: ITransportCommandOptions, ledgerName?: string): Promise<ILedgerRequestRequest> {
        let signer = this.signer;
        let item = await super.createRequest<U>(command, options, ledgerName);
        if (_.isNil(signer)) {
            return item;
        }
        options = item.options;

        let uid = _.isString(signer.uid) ? signer.uid : signer.uid.ledgerUid;
        options['userId'] = uid;
        options['signature'] = await this.transport.sendListen(new CryptoLedgerSignCommand({ uid, command, isDisableDecryption: this.signer.isDisableDecryption }));
        if (!signer.isKeepAfterSigning) {
            this.signer = null;
        }
        // this.batch();
        return item;
    }

    // --------------------------------------------------------------------------
    //
    // 	Public Methods
    //
    // --------------------------------------------------------------------------

    public async getCommandByEvent<U extends ITransportCommand<T>, T = any>(type: ClassType<U>, requestId: string): Promise<U> {
        let transaction = await this.getTransaction(requestId);
        if (_.isNil(transaction)) {
            throw new ExtendedError(`Unable to find transaction by "${requestId}" request`);
        }
        if (transaction.validationCode !== 0) {
            throw new ExtendedError(`Transaction "${requestId}" finished by ${transaction.validationCode} validationCode`);
        }

        let item = new type(transaction.request.request);
        if (item instanceof TransportCommandAsync) {
            item.response(transaction.response.response);
        }
        return item;
    }
}

export interface ISignerSettings {
    uid: string | User;
    isKeepAfterSigning?: boolean;
    isDisableDecryption?: boolean;
}

