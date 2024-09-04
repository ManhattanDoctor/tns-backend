import { Injectable } from '@nestjs/common';
import { Logger } from '@ts-core/common';
import { Transport, TransportCommandHandler } from '@ts-core/common';
import * as _ from 'lodash';
import { NotifyCommand, INotifyDto } from '../NotifyCommand';
import { UserNotFoundError } from '@project/module/core/middleware';
import { DatabaseService } from '@project/module/database/service';
import { IOneSignalUrl, OneSignalClient } from '../../service';
import { User } from '@project/common/platform/user';

@Injectable()
export class NotifyHandler extends TransportCommandHandler<INotifyDto, NotifyCommand> {

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(logger: Logger, transport: Transport, private database: DatabaseService, private oneSignal: OneSignalClient) {
        super(logger, transport, NotifyCommand.NAME);
    }

    // --------------------------------------------------------------------------
    //
    //  Private Methods
    //
    // --------------------------------------------------------------------------

    private async notify(user: User, params: INotifyDto): Promise<void> {
        let url: IOneSignalUrl = {};

        console.log('notify', params);
        
        if (!_.isNil(params.url)) {
            url.webUrl = params.url;
            url.pictureUrl = params.url;
            url.applicationUrl = params.url;
        }
        try {
            await this.oneSignal.notify(user.login, params.message, url);
        }
        catch (error) {
            this.warn(`Unable to notify OneSignal: ${error.message}`);
        }
    }

    // --------------------------------------------------------------------------
    //
    //  Protected Methods
    //
    // --------------------------------------------------------------------------

    protected async execute(params: INotifyDto): Promise<void> {
        let user = await this.database.userGet(params.userId);
        if (_.isNil(user)) {
            throw new UserNotFoundError();
        }
        await this.notify(user, params);
    }
}