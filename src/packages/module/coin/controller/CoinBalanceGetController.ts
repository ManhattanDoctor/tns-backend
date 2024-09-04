import { Controller, Get, Req, UseGuards, Param, Query } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DefaultController } from '@ts-core/backend-nestjs';
import { Logger } from '@ts-core/common';
import { IsOptional, IsString } from 'class-validator';
import * as _ from 'lodash';
import { DatabaseService } from '@project/module/database/service';
import { Swagger } from '@project/module/swagger';
import { IUserHolder } from '@project/module/database/user';
import { TransformGroup } from '@project/module/database';
import { UserGuard } from '@project/module/guard';
import { CoinBalance } from '@project/common/platform/coin';
import { COIN_BALANCE_URL } from '@project/common/platform/api';
import { ICoinBalanceGetDto } from '@project/common/platform/api/coin';
import { LedgerCoin } from '@project/common/ledger/coin';
import { CoinBalanceNotFoundError } from '@project/module/core/middleware';
import { LedgerService } from '@project/module/ledger/service';
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

    @Swagger({ name: 'Get coin list', response: CoinBalance })
    @Get()
    @UseGuards(UserGuard)
    public async executeExtended(@Param('coinId') coinId: string, @Query() params: CoinBalanceGetDto, @Req() request: IUserHolder): Promise<CoinBalance> {
        let coinUid = LedgerCoin.createUid(LedgerService.COMPANY_ROOT_LEDGER_UID, coinId);
        let item = await this.database.coinBalanceGet(coinUid, params.objectUid);
        if (_.isNil(item)) {
            throw new CoinBalanceNotFoundError();
        }
        return item.toObject({ groups: [TransformGroup.PUBLIC_DETAILS] });
    }
}
