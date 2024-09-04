import { Controller, Param, Req, Get, UseGuards } from '@nestjs/common';
import { DefaultController } from '@ts-core/backend-nestjs';
import { Logger } from '@ts-core/common';
import { ParseIntPipe } from '@nestjs/common';
import * as _ from 'lodash';
import { DatabaseService } from '@project/module/database/service';
import { Swagger } from '@project/module/swagger';
import { UserGuard, UserGuardOptions } from '@project/module/guard';
import { COIN_URL } from '@project/common/platform/api';
import { ICoinGetDtoResponse } from '@project/common/platform/api/coin';
import { TransformGroup } from '@project/module/database';
import { Coin } from '@project/common/platform/coin';
import { CoinNotFoundError } from '@project/module/core/middleware';

// --------------------------------------------------------------------------
//
//  Controller
//
// --------------------------------------------------------------------------

@Controller(`${COIN_URL}/:id`)
export class CoinGetController extends DefaultController<number, ICoinGetDtoResponse> {
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

    @Swagger({ name: `Get coin by id`, response: Coin })
    @Get()
    @UseGuards(UserGuard)
    @UserGuardOptions({ required: false })
    public async executeExtends(@Param('id', ParseIntPipe) id: number): Promise<ICoinGetDtoResponse> {
        let item = await this.database.coinGet(id);
        if (_.isNil(item)) {
            throw new CoinNotFoundError();
        }
        let groups = [TransformGroup.PUBLIC_DETAILS];
        return item.toObject({ groups });
    }
}
