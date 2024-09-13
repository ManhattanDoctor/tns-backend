import { Controller, Param, Get } from '@nestjs/common';
import { DefaultController } from '@ts-core/backend-nestjs';
import { Logger } from '@ts-core/common';
import { ParseIntPipe } from '@nestjs/common';
import { DatabaseService } from '@project/module/database/service';
import { Swagger } from '@project/module/swagger';
import { IUserGetDtoResponse } from '@project/common/platform/api/user';
import { USER_URL } from '@project/common/platform/api';
import { User } from '@project/common/platform';
import * as _ from 'lodash';

// --------------------------------------------------------------------------
//
//  Controller
//
// --------------------------------------------------------------------------

@Controller(`${USER_URL}/:id`)
export class UserGetController extends DefaultController<number, IUserGetDtoResponse> {
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

    @Swagger({ name: `Get user by id`, response: User })
    @Get()
    public async executeExtends(@Param('id', ParseIntPipe) id: number): Promise<IUserGetDtoResponse> {
        let item = await this.database.userGet(id);
        return !_.isNil(item) ? item.toObject() : null;
    }
}
