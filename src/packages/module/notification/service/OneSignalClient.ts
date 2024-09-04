import { TransportHttp, ITransportHttpSettings, LoggerLevel, ExtendedError } from '@ts-core/common';
import { ILogger } from '@ts-core/common';
import * as _ from 'lodash';

export class OneSignalClient extends TransportHttp<IOneSignalClientSettings> {
    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(logger: ILogger, settings: IOneSignalClientSettings) {
        super(logger, Object.assign(settings, { method: 'get', baseURL: 'https://onesignal.com/api/v1', isHandleError: true, isHandleLoading: true, headers: {} }));

        this.headers.Authorization = `Bearer ${settings.siteSecret}`;
        this.level = LoggerLevel.ALL;
    }

    // --------------------------------------------------------------------------
    //
    //  Protected Methods
    //
    // --------------------------------------------------------------------------

    protected isError(data: any): boolean {
        return !_.isNil(data.error) ? true : super.isError(data)

    }

    protected parseError(error: any): ExtendedError<any, any> {
        if (!_.isNil(error.error)) {
            return new ExtendedError(error.error.error_msg, error.error.error_code);
        }
        return super.parseError(error);
    }

    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    public async notify(userId: string, message: string, url?: IOneSignalUrl): Promise<void> {
        let data = {
            app_id: this.settings.siteId,
            contents: { en: message },
            include_external_user_ids: [userId],
            channel_for_external_user_ids: 'push',
        } as any;

        if (!_.isNil(url.url)) {
            data.url = url.url;
        }
        if (!_.isNil(url.webUrl)) {
            data.web_url = url.webUrl;
        }
        /*
        if (!_.isNil(url.applicationUrl)) {
            data.app_url = url.applicationUrl;
        }
        */
        if (!_.isNil(url.pictureUrl)) {
            data.firefox_icon = data.chrome_web_icon = data.chrome_web_badge = data.big_picture = data.chrome_web_image = url.pictureUrl;
        }

        let { errors, warnings } = await this.call(`notifications`, { method: 'post', data });
        if (!_.isEmpty(errors)) {
            this.warn(errors.join(', '));
        }
        if (!_.isNil(warnings)) {
            this.warn(JSON.stringify(warnings, null, 4));
        }
    }
}
export interface IOneSignalUrl {
    url?: string;
    webUrl?: string;
    pictureUrl?: string;
    applicationUrl?: string;
}

export interface IOneSignalClientSettings extends ITransportHttpSettings {
    siteId: string;
    siteSecret: string;
}