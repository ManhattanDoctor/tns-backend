import { Controller, Get, Query } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DefaultController } from '@ts-core/backend-nestjs';
import { TypeormUtil } from '@ts-core/backend';
import { Logger, FilterableConditions, FilterableSort, IPagination, Paginable } from '@ts-core/common';
import { IsOptional, IsString } from 'class-validator';
import { DatabaseService } from '@project/module/database/service';
import { USER_URL } from '@project/common/platform/api';
import { Swagger } from '@project/module/swagger';
import { User } from '@project/common/platform';
import { UserEntity } from '@project/module/database/entity';
import * as _ from 'lodash';

// --------------------------------------------------------------------------
//
//  Controller
//
// --------------------------------------------------------------------------

export class UserListDto implements Paginable<User> {
    @ApiPropertyOptional()
    conditions?: FilterableConditions<User>;

    @ApiPropertyOptional()
    sort?: FilterableSort<User>;

    @ApiProperty({ default: Paginable.DEFAULT_PAGE_SIZE })
    pageSize: number;

    @ApiProperty({ default: Paginable.DEFAULT_PAGE_INDEX })
    pageIndex: number;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    traceId?: string;
}

export class UserListDtoResponse implements IPagination<User> {
    @ApiProperty()
    pageSize: number;

    @ApiProperty()
    pageIndex: number;

    @ApiProperty()
    pages: number;

    @ApiProperty()
    total: number;

    @ApiProperty({ isArray: true, type: User })
    items: Array<User>;
}

// --------------------------------------------------------------------------
//
//  Controller
//
// --------------------------------------------------------------------------

@Controller(USER_URL)
export class UserListController extends DefaultController<UserListDto, UserListDtoResponse> {
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

    @Swagger({ name: 'Get user list', response: UserListDtoResponse })
    @Get()
    public async executeExtended(@Query({ transform: Paginable.transform }) params: UserListDto): Promise<UserListDtoResponse> {
        let query = UserEntity.createQueryBuilder('user');
        this.database.addUserRelations(query);
        return TypeormUtil.toPagination(query, params, this.transform);
    }

    protected transform = async (item: UserEntity): Promise<User> => item.toObject();
}
