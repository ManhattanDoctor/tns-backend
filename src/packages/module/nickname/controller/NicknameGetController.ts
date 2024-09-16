import { Controller, ParseIntPipe, Param, Get } from '@nestjs/common';
import { DefaultController } from '@ts-core/backend-nestjs';
import { Logger } from '@ts-core/common';
import { DatabaseService } from '@project/module/database/service';
import { Swagger } from '@project/module/swagger';
import { INicknameGetDtoResponse } from '@project/common/platform/api/nickname';
import { NICKNAME_URL } from '@project/common/platform/api';
import { Nickname } from '@project/common/platform';
import * as _ from 'lodash';

// --------------------------------------------------------------------------
//
//  Controller
//
// --------------------------------------------------------------------------

@Controller(`${NICKNAME_URL}/:id`)
export class NicknameGetController extends DefaultController<number, INicknameGetDtoResponse> {
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

    @Swagger({ name: 'Get auction by id', response: Nickname })
    @Get()
    public async executeExtends(@Param('id', ParseIntPipe) id: number): Promise<INicknameGetDtoResponse> {
        let item = await this.database.nicknameGet(id);
        return !_.isNil(item) ? item.toObject() : null;
    }
}
