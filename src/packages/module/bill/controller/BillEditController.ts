import { Body, Controller, Param, Put, Req, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { DefaultController } from '@ts-core/backend';
import { Logger } from '@ts-core/common';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import * as _ from 'lodash';
import { Swagger } from '@project/module/swagger';
import { UserGuard } from '@project/module/guard';
import { DatabaseService } from '@project/module/database/service';
import { IBillEditDto, IBillEditDtoResponse } from '@project/common/platform/api/bill';
import { Bill } from '@project/common/platform/bill';
import { BillNotFoundError } from '@project/module/core/middleware';
import { BILL_URL } from '@project/common/platform/api';
import { LedgerBillStatus } from '@project/common/ledger/bill';
import { IUserHolder } from '@project/module/database/user';
import { LedgerService } from '@project/module/ledger/service';

// --------------------------------------------------------------------------
//
//  Dto
//
// --------------------------------------------------------------------------

export class BillEditDto implements IBillEditDto {
    @ApiPropertyOptional()
    @IsOptional()
    id?: number;

    @ApiPropertyOptional()
    @IsOptional()
    @IsEnum(LedgerBillStatus)
    status: LedgerBillStatus;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    traceId?: string;
}

@Controller(`${BILL_URL}/:id`)
export class BillEditController extends DefaultController<IBillEditDto, IBillEditDtoResponse> {
    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(logger: Logger, private database: DatabaseService, private ledger: LedgerService,) {
        super(logger);
    }

    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    @Swagger({ name: 'Bill edit', response: Bill })
    @Put()
    @UseGuards(UserGuard)
    public async executeExtended(@Param('id', ParseIntPipe) billId: number, @Body() params: BillEditDto, @Req() request: IUserHolder): Promise<IBillEditDtoResponse> {
        let item = await this.database.billGet(billId);
        if (_.isNil(item)) {
            throw new BillNotFoundError();
        }
        /*
        if (!BillUtil.isCanEdit(request.user, item)) {
            throw new BillForbiddenError();
        }
        */
        // item.status = params.status;
        // item = await BillEntity.save(item);

        // return item.toObject({ groups: [TransformGroup.PUBLIC_DETAILS] });
        await this.ledger.billEdit(request.user, item, params.status);
        return null;
    }
}
