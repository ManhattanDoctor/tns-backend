import { Controller, Get, UseGuards, Req, Query } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DefaultController } from '@ts-core/backend-nestjs';
import { TypeormUtil } from '@ts-core/backend';
import { FilterableConditions, FilterableSort, IPagination, Paginable } from '@ts-core/common';
import { Logger } from '@ts-core/common';
import { IsOptional, IsString } from 'class-validator';
import * as _ from 'lodash';
import { DatabaseService } from '@project/module/database/service';
import { IUserHolder, UserEntity, UserRoleEntity } from '@project/module/database/user';
import { User, UserType } from '@project/common/platform/user';
import { USER_URL } from '@project/common/platform/api';
import { Swagger } from '@project/module/swagger';
import { UserGuard, UserGuardOptions } from '@project/module/guard';

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
    @UseGuards(UserGuard)
    @UserGuardOptions({ type: [UserType.ADMINISTRATOR] })
    public async executeExtended(@Query({ transform: Paginable.transform }) params: UserListDto, @Req() request: IUserHolder): Promise<UserListDtoResponse> {
        let user = request.user;
        let company = request.company;

        UserGuard.checkCompany({ isCompanyRequired: true }, company);

        let query = UserEntity.createQueryBuilder('user')
            .innerJoinAndSelect('user.preferences', 'preferences')
            .innerJoinAndSelect('user.company', 'company')
            .where(`company.id  = :id`, { id: company.id })
            .leftJoinAndMapMany('company.userRoles', UserRoleEntity, 'companyRole', `companyRole.userId = user.id AND companyRole.companyId = company.id`)

        return TypeormUtil.toPagination(query, params, this.transform);
    }

    protected transform = async (item: UserEntity): Promise<User> => item.toObject();
}
