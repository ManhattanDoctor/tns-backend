import { Module } from '@nestjs/common';
import { DatabaseModule } from '@project/module/database';
import { AuctionGetController, AuctionListController } from './controller';

let providers = [];

@Module({
    imports: [DatabaseModule],
    exports: [...providers],
    controllers: [AuctionGetController, AuctionListController],
    providers
})
export class AuctionModule { }