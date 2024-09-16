import { Controller, ParseIntPipe, Param, Get } from '@nestjs/common';
import { DefaultController } from '@ts-core/backend-nestjs';
import { Logger } from '@ts-core/common';
import { DatabaseService } from '@project/module/database/service';
import { Swagger } from '@project/module/swagger';
import { IAuctionGetDtoResponse } from '@project/common/platform/api/auction';
import { AUCTION_URL } from '@project/common/platform/api';
import { Auction } from '@project/common/platform';
import * as _ from 'lodash';

// --------------------------------------------------------------------------
//
//  Controller
//
// --------------------------------------------------------------------------

@Controller(`${AUCTION_URL}/:id`)
export class AuctionGetController extends DefaultController<number, IAuctionGetDtoResponse> {
    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(logger: Logger, private database: DatabaseService) {
        super(logger);
    }

    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    @Swagger({ name: 'Get auction by id', response: Auction })
    @Get()
    public async executeExtends(@Param('id', ParseIntPipe) id: number): Promise<IAuctionGetDtoResponse> {
        let item = await this.database.auctionGet(id);
        return !_.isNil(item) ? item.toObject() : null;
    }
}
