import { Module } from '@nestjs/common';
import { DatabaseModule } from '@project/module/database';
import { NicknameGetController, NicknameListController } from './controller';

let providers = [];

@Module({
    imports: [DatabaseModule],
    exports: [...providers],
    controllers: [NicknameGetController, NicknameListController],
    providers
})
export class NicknameModule { }