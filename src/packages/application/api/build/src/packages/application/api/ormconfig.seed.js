"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AppSettings_1 = require("./src/AppSettings");
const AppModule_1 = require("./src/AppModule");
const typeorm_1 = require("typeorm");
exports.default = new typeorm_1.DataSource(AppModule_1.AppModule.getOrmConfig(new AppSettings_1.AppSettings())[1]);
