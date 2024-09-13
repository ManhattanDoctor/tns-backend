"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppSettings = void 0;
const backend_1 = require("@ts-core/backend");
const common_1 = require("@ts-core/common");
class AppSettings extends backend_1.EnvSettingsStorage {
    logger;
    get loggerLevel() {
        return this.getValue('LOGGER_LEVEL', common_1.LoggerLevel.ALL);
    }
    get databaseUri() {
        return null;
    }
    get databaseHost() {
        return this.getValue('POSTGRES_DB_HOST');
    }
    get databasePort() {
        return this.getValue('POSTGRES_DB_PORT', 5432);
    }
    get databaseName() {
        return this.getValue('POSTGRES_DB');
    }
    get databaseUserName() {
        return this.getValue('POSTGRES_USER');
    }
    get databaseUserPassword() {
        return this.getValue('POSTGRES_PASSWORD');
    }
    get webPort() {
        return this.getValue('WEB_PORT');
    }
    get webHost() {
        return this.getValue('WEB_HOST', 'localhost');
    }
    get ledgerName() {
        return this.getValue('LEDGER_NAME');
    }
    get ledgerEndpoint() {
        return this.getValue('LEDGER_ENDPOINT');
    }
    get goSiteId() {
        return this.getValue('GO_SITE_ID');
    }
    get goSiteSecret() {
        return this.getValue('GO_SITE_SECRET');
    }
}
exports.AppSettings = AppSettings;
