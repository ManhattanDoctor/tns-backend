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
import { UserGuard } from '@project/module/guard';
import { ACTION_URL } from '@project/common/platform/api';
import { IUserHolder } from '@project/module/database/user';
import { TransformGroup } from '@project/module/database';
import { Action } from '@project/common/platform';
import { IActionListDto, IActionListDtoResponse } from '@project/common/platform/api/action';
import { ActionEntity } from '@project/module/database/action';

// --------------------------------------------------------------------------
//
//  Controller
//
// --------------------------------------------------------------------------

export class ActionListDto implements IActionListDto {
    @ApiPropertyOptional()
    conditions?: FilterableConditions<Action>;

    @ApiPropertyOptional()
    sort?: FilterableSort<Action>;

    @ApiProperty({ default: Paginable.DEFAULT_PAGE_SIZE })
    pageSize: number;

    @ApiProperty({ default: Paginable.DEFAULT_PAGE_INDEX })
    pageIndex: number;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    traceId?: string;
}

export class ActionListDtoResponse implements IActionListDtoResponse {
    @ApiProperty()
    pageSize: number;

    @ApiProperty()
    pageIndex: number;

    @ApiProperty()
    pages: number;

    @ApiProperty()
    total: number;

    @ApiProperty({ isArray: true, type: Action })
    items: Array<Action>;
}

// --------------------------------------------------------------------------
//
//  Controller
//
// --------------------------------------------------------------------------

@Controller(ACTION_URL)
export class ActionListController extends DefaultController<IActionListDto, IActionListDtoResponse> {
    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(logger: Logger) {
        super(logger);
    }

    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    @Swagger({ name: 'Get ledger action list', response: ActionListDtoResponse })
    @Get()
    @UseGuards(UserGuard)
    public async executeExtended(@Query({ transform: Paginable.transform }) params: ActionListDto, @Req() request: IUserHolder): Promise<IActionListDtoResponse> {
        let query = ActionEntity.createQueryBuilder('action');
        return TypeormUtil.toPagination(query, params, this.transform);
    }

    protected transform = async (item: ActionEntity): Promise<Action> => item.toObject({ groups: [TransformGroup.PUBLIC_DETAILS] });
}
