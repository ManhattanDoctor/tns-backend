import { Controller, Get, Req, UseGuards, Query } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DefaultController } from '@ts-core/backend-nestjs';
import { TypeormUtil } from '@ts-core/backend';
import { FilterableConditions, FilterableSort, Paginable } from '@ts-core/common';
import { Logger } from '@ts-core/common';
import { IsOptional, IsString } from 'class-validator';
import * as _ from 'lodash';
import { DatabaseService } from '@project/module/database/service';
import { Swagger } from '@project/module/swagger';
import { IUserHolder } from '@project/module/database/user';
import { TransformGroup } from '@project/module/database';
import { IBillListDto, IBillListDtoResponse } from '@project/common/platform/api/bill';
import { UserGuard, UserGuardOptions } from '@project/module/guard';
import { Bill } from '@project/common/platform/bill';
import { BILL_URL } from '@project/common/platform/api';
import { BillEntity } from '@project/module/database/bill';

// --------------------------------------------------------------------------
//
//  Controller
//
// --------------------------------------------------------------------------

export class BillListDto implements IBillListDto {
    @ApiPropertyOptional()
    conditions?: FilterableConditions<Bill>;

    @ApiPropertyOptional()
    sort?: FilterableSort<Bill>;

    @ApiProperty({ default: Paginable.DEFAULT_PAGE_SIZE })
    pageSize: number;

    @ApiProperty({ default: Paginable.DEFAULT_PAGE_INDEX })
    pageIndex: number;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    traceId?: string;
}

export class BillListDtoResponse implements IBillListDtoResponse {
    @ApiProperty()
    pageSize: number;

    @ApiProperty()
    pageIndex: number;

    @ApiProperty()
    pages: number;

    @ApiProperty()
    total: number;

    @ApiProperty({ isArray: true, type: Bill })
    items: Array<Bill>;
}

// --------------------------------------------------------------------------
//
//  Controller
//
// --------------------------------------------------------------------------

@Controller(BILL_URL)
export class BillListController extends DefaultController<IBillListDto, IBillListDtoResponse> {
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

    @Swagger({ name: 'Get bill list', response: BillListDtoResponse })
    @Get()
    @UseGuards(UserGuard)
    public async executeExtended(@Query({ transform: Paginable.transform }) params: BillListDto, @Req() request: IUserHolder): Promise<IBillListDtoResponse> {
        let query = BillEntity.createQueryBuilder('bill')
            .where('bill.userId = :userId', { userId: request.user.id })
        this.database.addBillRelations(query);
        return TypeormUtil.toPagination(query, params, this.transform);
    }

    protected transform = async (item: BillEntity): Promise<Bill> => item.toObject({ groups: [TransformGroup.PUBLIC_DETAILS] });
}
