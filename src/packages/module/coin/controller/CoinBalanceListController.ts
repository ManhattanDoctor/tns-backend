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
import { ICoinBalanceListDto, ICoinBalanceListDtoResponse } from '@project/common/platform/api/coin';
import { UserGuard } from '@project/module/guard';
import { Coin, CoinBalance } from '@project/common/platform/coin';
import { COIN_BALANCE_URL, COIN_URL } from '@project/common/platform/api';
import { CoinBalanceEntity } from '@project/module/database/coin';
// --------------------------------------------------------------------------
//
//  Controller
//
// --------------------------------------------------------------------------

export class CoinBalanceListDto implements ICoinBalanceListDto {
    @ApiPropertyOptional()
    conditions?: FilterableConditions<CoinBalance>;

    @ApiPropertyOptional()
    sort?: FilterableSort<CoinBalance>;

    @ApiProperty({ default: Paginable.DEFAULT_PAGE_SIZE })
    pageSize: number;

    @ApiProperty({ default: Paginable.DEFAULT_PAGE_INDEX })
    pageIndex: number;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    traceId?: string;
}

export class CoinBalanceListDtoResponse implements ICoinBalanceListDtoResponse {
    @ApiProperty()
    pageSize: number;

    @ApiProperty()
    pageIndex: number;

    @ApiProperty()
    pages: number;

    @ApiProperty()
    total: number;

    @ApiProperty({ isArray: true, type: CoinBalance })
    items: Array<CoinBalance>;
}

// --------------------------------------------------------------------------
//
//  Controller
//
// --------------------------------------------------------------------------

@Controller(COIN_BALANCE_URL)
export class CoinBalanceListController extends DefaultController<ICoinBalanceListDto, ICoinBalanceListDtoResponse> {
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
    //  Private Methods
    //
    // --------------------------------------------------------------------------

    private parseFilters<T>(filter: FilterableSort<CoinBalance> | FilterableConditions<CoinBalance>): T {
        if (_.isEmpty(filter)) {
            return null;
        }
        let item = {};
        for (let name of ['id', 'coinId', 'decimals', 'companyId', 'objectUid', 'coinUid']) {
            let value = filter[name];
            if (_.isNil(value)) {
                continue;
            }
            delete filter[name];
            switch (name) {
                case 'coinUid':
                    item['ledgerUid'] = value;
                    break;
                case 'objectUid':
                    filter['ledgerUid'] = value;
                    break;
                default:
                    item[name] = value;
            }

        }
        return item as T;
    }

    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    @Swagger({ name: 'Get coin list', response: CoinBalanceListDtoResponse })
    @Get()
    @UseGuards(UserGuard)
    public async executeExtended(@Query({ transform: Paginable.transform }) params: CoinBalanceListDto, @Req() request: IUserHolder): Promise<ICoinBalanceListDtoResponse> {
        let query = CoinBalanceEntity
            .createQueryBuilder('coinBalance')
            .leftJoinAndSelect('coinBalance.coin', 'coin');

        let sort = this.parseFilters<FilterableSort<Coin>>(params.sort);
        let conditions = this.parseFilters<FilterableConditions<Coin>>(params.conditions);
        if (!_.isEmpty(conditions)) {
            TypeormUtil.applyConditions(query, conditions, 'coin');
        }
        if (!_.isEmpty(sort)) {
            TypeormUtil.applySort(query, sort, 'coin');
        }

        return TypeormUtil.toPagination(query, params, this.transform);
    }

    protected transform = async (item: CoinBalanceEntity): Promise<CoinBalance> => item.toObject({ groups: [TransformGroup.PUBLIC_DETAILS] });
}
