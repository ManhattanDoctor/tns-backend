import { IDatabaseSettings, IWebSettings, EnvSettingsStorage } from '@ts-core/backend';
import { ILogger, LoggerLevel } from '@ts-core/common';
import { ICryptoSettings } from '@project/module/crypto/service';
import { IGoStrategySettings, IYaStrategySettings, IMaStrategySettings, IVkStrategySettings } from '@project/module/login/strategy';
import { INotificationSettings } from '@project/module/notification';
import { IFaceSettings } from '@project/module/face/service';

export class AppSettings extends EnvSettingsStorage implements IFaceSettings ,INotificationSettings, ICryptoSettings, IGoStrategySettings, IVkStrategySettings, IYaStrategySettings, IMaStrategySettings, IWebSettings, IDatabaseSettings {
    // --------------------------------------------------------------------------
    //
    //  Public Properties
    //
    // --------------------------------------------------------------------------

    public logger?: ILogger;

    // --------------------------------------------------------------------------
    //
    //  Logger Properties
    //
    // --------------------------------------------------------------------------

    public get loggerLevel(): LoggerLevel {
        return this.getValue('LOGGER_LEVEL', LoggerLevel.ALL);
    }

    // --------------------------------------------------------------------------
    //
    //  Public Database Properties
    //
    // --------------------------------------------------------------------------

    public get databaseUri(): string {
        return null;
    }

    public get databaseHost(): string {
        return this.getValue('POSTGRES_DB_HOST');
    }

    public get databasePort(): number {
        return this.getValue('POSTGRES_DB_PORT', 5432);
    }

    public get databaseName(): string {
        return this.getValue('POSTGRES_DB');
    }

    public get databaseUserName(): string {
        return this.getValue('POSTGRES_USER');
    }

    public get databaseUserPassword(): string {
        return this.getValue('POSTGRES_PASSWORD');
    }

    // --------------------------------------------------------------------------
    //
    //  Web Properties
    //
    // --------------------------------------------------------------------------

    public get webPort(): number {
        return this.getValue('WEB_PORT');
    }

    public get webHost(): string {
        return this.getValue('WEB_HOST', 'localhost');
    }


    // --------------------------------------------------------------------------
    //
    //  JWT Properties
    //
    // --------------------------------------------------------------------------

    public get jwtSecret(): string {
        return this.getValue('JWT_SECRET');
    }

    public get jwtExpiresTimeout(): number {
        return this.getValue('JWT_EXPIRES_TIMEOUT', 3600);
    }

    // --------------------------------------------------------------------------
    //
    //  Crypto Properties
    //
    // --------------------------------------------------------------------------

    public get databaseEncryptionNonce(): string {
        return this.getValue('DATABASE_ENCRYPTION_NONCE');
    }

    public get databaseEncryptionKey(): string {
        return this.getValue('DATABASE_ENCRYPTION_KEY');
    }

    // --------------------------------------------------------------------------
    //
    //  Explorer Properties
    //
    // --------------------------------------------------------------------------

    public get ledgerName(): string {
        return this.getValue('LEDGER_NAME');
    }

    public get ledgerEndpoint(): string {
        return this.getValue('LEDGER_ENDPOINT');
    }

    // --------------------------------------------------------------------------
    //
    //  Google Properties
    //
    // --------------------------------------------------------------------------

    public get goSiteId(): string {
        return this.getValue('GO_SITE_ID');
    }

    public get goSiteSecret(): string {
        return this.getValue('GO_SITE_SECRET');
    }

    // --------------------------------------------------------------------------
    //
    //  Yandex Properties
    //
    // --------------------------------------------------------------------------

    public get yaSiteId(): string {
        return this.getValue('YA_SITE_ID');
    }

    public get yaSiteSecret(): string {
        return this.getValue('YA_SITE_SECRET');
    }

    // --------------------------------------------------------------------------
    //
    //  Mail Properties
    //
    // --------------------------------------------------------------------------

    public get maSiteId(): string {
        return this.getValue('MA_SITE_ID');
    }

    public get maSiteSecret(): string {
        return this.getValue('MA_SITE_SECRET');
    }

    // --------------------------------------------------------------------------
    //
    //  Vk Properties
    //
    // --------------------------------------------------------------------------

    public get vkSiteId(): string {
        return this.getValue('VK_SITE_ID');
    }

    public get vkSiteSecret(): string {
        return this.getValue('VK_SITE_SECRET');
    }

    // --------------------------------------------------------------------------
    //
    //  Logger Properties
    //
    // --------------------------------------------------------------------------

    public get s3FileBucketName(): string {
        return this.getValue('S3_FILE_BUCKET_NAME');
    }

    public get s3AccessKeyId(): string {
        return this.getValue('S3_ACCESS_KEY_ID');
    }

    public get s3SecretAccessKey(): string {
        return this.getValue('S3_SECRET_ACCESS_KEY');
    }

    // --------------------------------------------------------------------------
    //
    //  OneSignal Properties
    //
    // --------------------------------------------------------------------------

    public get oneSignalSiteId(): string {
        return this.getValue('ONE_SIGNAL_SITE_ID');
    }

    public get oneSignalSiteSecret(): string {
        return this.getValue('ONE_SIGNAL_SITE_SECRET');
    }

    // --------------------------------------------------------------------------
    //
    //  Face Properties
    //
    // --------------------------------------------------------------------------

    public get faceApiKey(): string {
        return this.getValue('FACE_API_KEY');
    }

}
