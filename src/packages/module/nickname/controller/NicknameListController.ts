import { Controller, Get, Query } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DefaultController } from '@ts-core/backend-nestjs';
import { TypeormUtil } from '@ts-core/backend';
import { Logger, FilterableConditions, FilterableSort, IPagination, Paginable } from '@ts-core/common';
import { IsOptional, IsString } from 'class-validator';
import { DatabaseService } from '@project/module/database/service';
import { NICKNAME_URL } from '@project/common/platform/api';
import { Swagger } from '@project/module/swagger';
import { Nickname } from '@project/common/platform';
import { NicknameEntity } from '@project/module/database/entity';
import * as _ from 'lodash';

// --------------------------------------------------------------------------
//
//  Controller
//
// --------------------------------------------------------------------------

export class NicknameListDto implements Paginable<Nickname> {
    @ApiPropertyOptional()
    conditions?: FilterableConditions<Nickname>;

    @ApiPropertyOptional()
    sort?: FilterableSort<Nickname>;

    @ApiProperty({ default: Paginable.DEFAULT_PAGE_SIZE })
    pageSize: number;

    @ApiProperty({ default: Paginable.DEFAULT_PAGE_INDEX })
    pageIndex: number;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    traceId?: string;
}

export class NicknameListDtoResponse implements IPagination<Nickname> {
    @ApiProperty()
    pageSize: number;

    @ApiProperty()
    pageIndex: number;

    @ApiProperty()
    pages: number;

    @ApiProperty()
    total: number;

    @ApiProperty({ isArray: true, type: Nickname })
    items: Array<Nickname>;
}

// --------------------------------------------------------------------------
//
//  Controller
//
// --------------------------------------------------------------------------

@Controller(NICKNAME_URL)
export class NicknameListController extends DefaultController<NicknameListDto, NicknameListDtoResponse> {
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

    @Swagger({ name: 'Get nickname list', response: NicknameListDtoResponse })
    @Get()
    public async executeExtended(@Query({ transform: Paginable.transform }) params: NicknameListDto): Promise<NicknameListDtoResponse> {
        let query = NicknameEntity.createQueryBuilder('auction');
        this.database.addNicknameRelations(query);
        return TypeormUtil.toPagination(query, params, this.transform);
    }

    protected transform = async (item: NicknameEntity): Promise<Nickname> => item.toObject();
}
