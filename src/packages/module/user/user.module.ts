import { Module } from '@nestjs/common';
import { DatabaseModule } from '@project/module/database';
import { LedgerModule } from '@project/module/ledger';
import { SharedModule } from '@project/module/shared';
import { UserEditController, UserGetController, UserListController, UserPhotoController } from './controller';
import { FaceModule } from '@project/module/face';
import { UserService } from './service';

let providers = [UserService];

@Module({
    imports: [SharedModule, DatabaseModule, LedgerModule, FaceModule],
    exports: [...providers],
    controllers: [UserGetController, UserListController, UserEditController, UserPhotoController],
    providers
})
export class UserModule { }