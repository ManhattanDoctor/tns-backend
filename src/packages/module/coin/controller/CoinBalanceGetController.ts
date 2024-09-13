import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DefaultController } from '@ts-core/backend-nestjs';
import { Logger } from '@ts-core/common';
import { CoinUtil } from '@hlf-core/common';
import { IsOptional, IsString } from 'class-validator';
import { DatabaseService } from '@project/module/database/service';
import { Swagger } from '@project/module/swagger';
import { COIN_BALANCE_URL } from '@project/common/platform/api';
import { CoinBalance } from '@project/common/platform';
import { Variables as AclVariables } from '@project/common/hlf/acl';
import { ICoinBalanceGetDto } from '@project/common/platform/api/coin';
import * as _ from 'lodash';

// --------------------------------------------------------------------------
//
//  Controller
//
// --------------------------------------------------------------------------

export class CoinBalanceGetDto implements ICoinBalanceGetDto {
    @ApiProperty()
    @IsString()
    objectUid: string;

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

@Controller(`${COIN_BALANCE_URL}/:coinId`)
export class CoinBalanceGetController extends DefaultController<ICoinBalanceGetDto, CoinBalance> {
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

    @Swagger({ name: 'Get coin balance', response: CoinBalance })
    @Get()
    public async executeExtended(@Param('coinId') coinId: string, @Query() params: CoinBalanceGetDto): Promise<CoinBalance> {
        let coinUid = CoinUtil.createUid(coinId, AclVariables.platform.uid);
        let item = await this.database.coinBalanceGet(params.objectUid, coinUid);
        return !_.isNil(item) ? item.toObject() : null;
    }
}
