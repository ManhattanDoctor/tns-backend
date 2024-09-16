import { Controller, Get, Query } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DefaultController } from '@ts-core/backend-nestjs';
import { TypeormUtil } from '@ts-core/backend';
import { Logger, FilterableConditions, FilterableSort, IPagination, Paginable } from '@ts-core/common';
import { IsOptional, IsString } from 'class-validator';
import { DatabaseService } from '@project/module/database/service';
import { AUCTION_URL } from '@project/common/platform/api';
import { Swagger } from '@project/module/swagger';
import { Auction } from '@project/common/platform';
import { AuctionEntity } from '@project/module/database/entity';
import * as _ from 'lodash';

// --------------------------------------------------------------------------
//
//  Controller
//
// --------------------------------------------------------------------------

export class AuctionListDto implements Paginable<Auction> {
    @ApiPropertyOptional()
    conditions?: FilterableConditions<Auction>;

    @ApiPropertyOptional()
    sort?: FilterableSort<Auction>;

    @ApiProperty({ default: Paginable.DEFAULT_PAGE_SIZE })
    pageSize: number;

    @ApiProperty({ default: Paginable.DEFAULT_PAGE_INDEX })
    pageIndex: number;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    traceId?: string;
}

export class AuctionListDtoResponse implements IPagination<Auction> {
    @ApiProperty()
    pageSize: number;

    @ApiProperty()
    pageIndex: number;

    @ApiProperty()
    pages: number;

    @ApiProperty()
    total: number;

    @ApiProperty({ isArray: true, type: Auction })
    items: Array<Auction>;
}

// --------------------------------------------------------------------------
//
//  Controller
//
// --------------------------------------------------------------------------

@Controller(AUCTION_URL)
export class AuctionListController extends DefaultController<AuctionListDto, AuctionListDtoResponse> {
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

    @Swagger({ name: 'Get auction list', response: AuctionListDtoResponse })
    @Get()
    public async executeExtended(@Query({ transform: Paginable.transform }) params: AuctionListDto): Promise<AuctionListDtoResponse> {
        let query = AuctionEntity.createQueryBuilder('auction');
        this.database.addAuctionRelations(query);
        return TypeormUtil.toPagination(query, params, this.transform);
    }

    protected transform = async (item: AuctionEntity): Promise<Auction> => item.toObject();
}
