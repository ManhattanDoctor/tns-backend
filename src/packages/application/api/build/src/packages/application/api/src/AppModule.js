"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var AppModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const backend_nestjs_1 = require("@ts-core/backend-nestjs");
const backend_nestjs_2 = require("@ts-core/backend-nestjs");
const backend_nestjs_3 = require("@ts-core/backend-nestjs");
const AppSettings_1 = require("./AppSettings");
const database_1 = require("@project/module/database");
const typeorm_1 = require("@nestjs/typeorm");
const common_2 = require("@ts-core/common");
const backend_1 = require("@ts-core/backend");
const module_1 = require("@project/module");
const user_1 = require("@project/module/user");
const service_1 = require("./service");
const coin_1 = require("@project/module/coin");
const action_1 = require("@project/module/action");
const hlf_1 = require("@project/module/hlf");
const socket_1 = require("@project/module/socket");
let AppModule = AppModule_1 = class AppModule extends backend_1.ModeApplication {
    transport;
    service;
    static forRoot(settings) {
        return {
            module: AppModule_1,
            imports: [
                database_1.DatabaseModule,
                backend_nestjs_2.CacheModule.forRoot(),
                backend_nestjs_1.LoggerModule.forRoot(settings),
                typeorm_1.TypeOrmModule.forRoot(this.getOrmConfig(settings)[0]),
                backend_nestjs_3.TransportModule.forRoot({ type: backend_nestjs_3.TransportType.LOCAL }),
                hlf_1.HlfModule.forRoot(settings),
                user_1.UserModule,
                coin_1.CoinModule,
                action_1.ActionModule,
                socket_1.SocketModule,
            ],
            controllers: [],
            providers: [
                {
                    provide: AppSettings_1.AppSettings,
                    useValue: settings
                },
                service_1.InitializeService,
            ]
        };
    }
    static getOrmConfig(settings) {
        return [
            {
                type: 'postgres',
                host: settings.databaseHost,
                port: settings.databasePort,
                username: settings.databaseUserName,
                password: settings.databaseUserPassword,
                database: settings.databaseName,
                synchronize: false,
                logging: false,
                entities: [
                    `${(0, module_1.modulePath)()}/database/**/*Entity.{ts,js}`,
                    `${(0, module_1.nodeModulePath)()}/@hlf-explorer/monitor/cjs/**/*Entity.{ts,js}`,
                    `${(0, module_1.nodeModulePathBuild)()}/@hlf-explorer/monitor/cjs/**/*Entity.{ts,js}`
                ],
                migrations: [
                    __dirname + '/migration/*.{ts,js}',
                    `${(0, module_1.nodeModulePath)()}/@hlf-explorer/monitor/cjs/**/*Migration.{ts,js}`,
                    `${(0, module_1.nodeModulePathBuild)()}/@hlf-explorer/monitor/cjs/**/*Migration.{ts,js}`
                ],
                migrationsRun: true,
            },
            {
                name: 'seed',
                type: 'postgres',
                host: settings.databaseHost,
                port: settings.databasePort,
                username: settings.databaseUserName,
                password: settings.databaseUserPassword,
                database: settings.databaseName,
                synchronize: false,
                logging: false,
                entities: [
                    `${(0, module_1.modulePath)()}/database/**/*Entity.{ts,js}`
                ],
                migrations: [__dirname + '/seed/*.{ts,js}'],
                migrationsRun: true,
                migrationsTableName: 'migrations_seed',
            }
        ];
    }
    constructor(logger, settings, transport, service) {
        super('TNS Platform API', settings, logger);
        this.transport = transport;
        this.service = service;
    }
    async onApplicationBootstrap() {
        await super.onApplicationBootstrap();
        if (this.settings.isTesting) {
            this.warn(`Service works in ${this.settings.mode}: some functions could work different way`);
        }
        await this.service.initialize();
    }
};
AppModule = AppModule_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [common_2.Logger, AppSettings_1.AppSettings, common_2.Transport, service_1.InitializeService])
], AppModule);
exports.AppModule = AppModule;
