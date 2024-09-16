import { DynamicModule, OnApplicationBootstrap, Injectable } from '@nestjs/common';
import { CacheModule, LoggerModule, TransportModule, TransportType } from '@ts-core/backend-nestjs';
import { AppSettings } from './AppSettings';
import { DatabaseModule } from '@project/module/database';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Logger, Transport } from '@ts-core/common';
import { IDatabaseSettings, ModeApplication } from '@ts-core/backend';
import { modulePath, nodeModulePath, nodeModulePathBuild } from '@project/module';
import { UserModule } from '@project/module/user';
import { InitializeService } from './service';
import { CoinModule } from '@project/module/coin';
import { AuctionModule } from '@project/module/auction';
import { NicknameModule } from '@project/module/nickname';
import { ActionModule } from '@project/module/action';
import { HlfModule } from '@project/module/hlf';
import { SocketModule } from '@project/module/socket';
import { InitController } from './controller';

@Injectable()
export class AppModule extends ModeApplication<AppSettings> implements OnApplicationBootstrap {
    // --------------------------------------------------------------------------
    //
    //  Public Static Methods
    //
    // --------------------------------------------------------------------------

    public static forRoot(settings: AppSettings): DynamicModule {
        return {
            module: AppModule,
            imports: [
                DatabaseModule,
                CacheModule.forRoot(),
                LoggerModule.forRoot(settings),
                TypeOrmModule.forRoot(this.getOrmConfig(settings)[0]),
                TransportModule.forRoot({ type: TransportType.LOCAL }),

                SocketModule,
                HlfModule.forRoot(settings.hlf),

                UserModule,
                CoinModule,
                ActionModule,
                AuctionModule,
                NicknameModule
            ],
            controllers: [
                InitController
            ],
            providers: [
                {
                    provide: AppSettings,
                    useValue: settings
                },
                InitializeService,
            ]
        };
    }

    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    public static getOrmConfig(settings: IDatabaseSettings): Array<TypeOrmModuleOptions> {
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
                    `${modulePath()}/database/**/*Entity.{ts,js}`,
                    `${nodeModulePath()}/@hlf-explorer/monitor/cjs/**/*Entity.{ts,js}`,
                    `${nodeModulePathBuild()}/@hlf-explorer/monitor/cjs/**/*Entity.{ts,js}`
                ],
                migrations: [
                    __dirname + '/migration/*.{ts,js}',
                    `${nodeModulePath()}/@hlf-explorer/monitor/cjs/**/*Migration.{ts,js}`,
                    `${nodeModulePathBuild()}/@hlf-explorer/monitor/cjs/**/*Migration.{ts,js}`
                ],
                migrationsRun: true,
                /*
                ssl: {
                    ca: process.env.SSL_CA
                }
                */
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
                    `${modulePath()}/database/**/*Entity.{ts,js}`
                ],
                migrations: [__dirname + '/seed/*.{ts,js}'],
                migrationsRun: true,
                migrationsTableName: 'migrations_seed',
                /*
                ssl: {
                    ca: process.env.SSL_CA
                }
                */
            }
        ];
    }

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    public constructor(logger: Logger, settings: AppSettings, private transport: Transport, private service: InitializeService) {
        super('TNS Platform API', settings, logger);
    }
    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    public async onApplicationBootstrap(): Promise<void> {
        await super.onApplicationBootstrap();
        if (this.settings.isTesting) {
            this.warn(`Service works in ${this.settings.mode}: some functions could work different way`);
        }
        await this.service.initialize();
    }
}
