import { DynamicModule } from '@nestjs/common';
import { Logger } from '@ts-core/common';
import { SharedModule } from '@project/module/shared';
import { DatabaseModule } from '@project/module/database';
import { NotifyHandler } from './transport/handler';
import { OneSignalClient } from './service';
import { BillEventListener } from './listener';

export class NotificationModule {
    // --------------------------------------------------------------------------
    //
    //  Public Static Methods
    //
    // --------------------------------------------------------------------------

    public static forRoot(settings: INotificationSettings): DynamicModule {
        return {
            module: NotificationModule,
            imports: [
                SharedModule,
                DatabaseModule,
            ],
            providers: [
                {
                    provide: OneSignalClient,
                    inject: [Logger],
                    useFactory: (logger) => new OneSignalClient(logger, { siteId: settings.oneSignalSiteId, siteSecret: settings.oneSignalSiteSecret })
                },
                NotifyHandler,
                BillEventListener
            ],
        };
    }
}

export interface IOneSignalNotificationSettings {
    oneSignalSiteId: string;
    oneSignalSiteSecret: string;
}

export interface INotificationSettings extends IOneSignalNotificationSettings { }
