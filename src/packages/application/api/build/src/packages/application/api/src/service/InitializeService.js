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
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitializeService = void 0;
const common_1 = require("@nestjs/common");
const common_2 = require("@ts-core/common");
const service_1 = require("@project/module/database/service");
const socket_server_1 = require("@ts-core/socket-server");
const service_2 = require("@project/module/hlf/service");
let InitializeService = class InitializeService extends common_2.LoggerWrapper {
    transport;
    database;
    hlf;
    monitor;
    socket;
    constructor(logger, transport, database, hlf, monitor, socket) {
        super(logger);
        this.transport = transport;
        this.database = database;
        this.hlf = hlf;
        this.monitor = monitor;
        this.socket = socket;
    }
    async initialize() {
        await this.hlf.initialize();
    }
};
InitializeService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [common_2.Logger,
        common_2.Transport,
        service_1.DatabaseService,
        service_2.HlfService,
        service_2.HlfMonitor,
        socket_server_1.TransportSocket])
], InitializeService);
exports.InitializeService = InitializeService;
