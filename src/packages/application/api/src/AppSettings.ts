import { IDatabaseSettings, IWebSettings, EnvSettingsStorage } from '@ts-core/backend';
import { ILogger, LoggerLevel } from '@ts-core/common';


export class AppSettings extends EnvSettingsStorage implements IWebSettings, IDatabaseSettings {
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
}
