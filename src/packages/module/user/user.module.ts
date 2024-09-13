import { Module } from '@nestjs/common';
import { DatabaseModule } from '@project/module/database';
import { UserGetController, UserListController } from './controller';

let providers = [];

@Module({
    imports: [DatabaseModule],
    exports: [...providers],
    controllers: [UserGetController, UserListController],
    providers
})
export class UserModule { }