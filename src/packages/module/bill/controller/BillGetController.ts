import { Controller, Query, Req, Get, UseGuards } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DefaultController } from '@ts-core/backend-nestjs';
import { Logger } from '@ts-core/common';
import { isNumberString, IsOptional, IsString, IsDefined } from 'class-validator';
import * as _ from 'lodash';
import { DatabaseService } from '@project/module/database/service';
import { Swagger } from '@project/module/swagger';
import { UserGuard, UserGuardOptions } from '@project/module/guard';
import { BILL_GET_URL } from '@project/common/platform/api';
import { IBillGetDto, IBillGetDtoResponse } from '@project/common/platform/api/bill';
import { TransformGroup } from '@project/module/database';
import { BillNotFoundError } from '@project/module/core/middleware';
import { Bill } from '@project/common/platform/bill';

// --------------------------------------------------------------------------
//
//  Dto
//
// --------------------------------------------------------------------------

export class BillGetDto implements IBillGetDto {
    @ApiProperty()
    @IsDefined()
    public idOrLedgerUid: string | number;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    traceId?: string;
}

// --------------------------------------------------------------------------
//
//  Controller
//
// --------------------------------------------------------------------------

@Controller(`${BILL_GET_URL}`)
export class BillGetController extends DefaultController<IBillGetDto, IBillGetDtoResponse> {
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

    @Swagger({ name: `Get bill by id or ledgerUid`, response: Bill })
    @Get()
    @UseGuards(UserGuard)
    @UserGuardOptions({ required: false })
    public async executeExtends(@Query() params: BillGetDto): Promise<IBillGetDtoResponse> {
        console.log(params)
        let idOrLedgerUid = params.idOrLedgerUid;
        if (isNumberString(params.idOrLedgerUid)) {
            idOrLedgerUid = Number(idOrLedgerUid);
        }

        let item = await this.database.billGet(idOrLedgerUid);
        if (_.isNil(item)) {
            throw new BillNotFoundError();
        }
        let groups = [TransformGroup.PUBLIC_DETAILS];
        return item.toObject({ groups });
    }
}
