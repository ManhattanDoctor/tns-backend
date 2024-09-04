import { Controller, Get, Query } from '@nestjs/common';
import { DefaultController, Cache } from '@ts-core/backend-nestjs';
import { Logger, ExtendedError, DateUtil } from '@ts-core/common';
import * as _ from 'lodash';
import { Swagger } from '@project/module/swagger';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';
import { getType, LedgerObjectType } from '@project/common/ledger';
import { ILedgerObjectDetails, LEDGER_OBJECT_DETAILS_URL } from '@project/common/platform/api';
import { ILedgerObjectDetailsGetDto, ILedgerObjectDetailsGetDtoResponse } from '@project/common/platform/api/ledger';
import { UserEntity } from '@project/module/database/user';
import { CoinEntity } from '@project/module/database/coin';
import { CompanyEntity } from '@project/module/database/company';
import { BillEntity } from '@project/module/database/bill';
import { TerminalEntity } from '@project/module/database/terminal';

// --------------------------------------------------------------------------
//
//  Controller
//
// --------------------------------------------------------------------------

export class LedgerObjectDetailsGetDto implements ILedgerObjectDetailsGetDto {
    @IsString()
    ledgerUid: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    traceId?: string;
}

@Controller(`${LEDGER_OBJECT_DETAILS_URL}`)
export class LedgerObjectDetailsGetController extends DefaultController<ILedgerObjectDetailsGetDto, ILedgerObjectDetailsGetDtoResponse> {
    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(logger: Logger, private cache: Cache) {
        super(logger);
    }

    // --------------------------------------------------------------------------
    //
    //  Private Methods
    //
    // --------------------------------------------------------------------------

    private async getItem(params: LedgerObjectDetailsGetDto): Promise<ILedgerObjectDetails> {
        let type = getType(params.ledgerUid);
        let ledgerUid = params.ledgerUid;
        if (type === LedgerObjectType.USER) {
            let item = await UserEntity.createQueryBuilder('item').where(`item.ledgerUid  = :ledgerUid`, { ledgerUid }).leftJoinAndSelect('item.preferences', 'itemPreferences').getOne();
            return { id: item.id, name: item.preferences.name, picture: item.preferences.picture, description: item.preferences.description, type };
        }
        if (type === LedgerObjectType.COMPANY) {
            let item = await CompanyEntity.createQueryBuilder('item').where(`item.ledgerUid  = :ledgerUid`, { ledgerUid }).leftJoinAndSelect('item.preferences', 'itemPreferences').getOne();
            return { id: item.id, name: item.preferences.title, picture: item.preferences.picture, description: item.preferences.description, type };
        }
        if (type === LedgerObjectType.COIN) {
            let item = await CoinEntity.createQueryBuilder('item').where(`item.ledgerUid  = :ledgerUid`, { ledgerUid }).getOne();
            return { id: item.id, name: item.coinId, description: null, picture: null, type };
        }
        if (type === LedgerObjectType.BILL) {
            let item = await BillEntity.createQueryBuilder('item').where(`item.ledgerUid  = :ledgerUid`, { ledgerUid }).getOne();
            return { id: item.id, name: item.description, description: item.description, picture: null, type };
        }
        if (type === LedgerObjectType.TERMINAL) {
            let item = await TerminalEntity.createQueryBuilder('item').where(`item.ledgerUid  = :ledgerUid`, { ledgerUid }).getOne();
            return { id: item.id, name: item.description, description: item.description, picture: null, type };
        }
        throw new ExtendedError(`Unknown "${type}" type`);
    }

    private getCacheKey(params: LedgerObjectDetailsGetDto): string {
        return `ledgerObject_${params.ledgerUid}`;
    }

    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    @Swagger({ name: `Get ledger object details`, response: null })
    @Get()
    public async executeExtended(@Query() params: LedgerObjectDetailsGetDto): Promise<ILedgerObjectDetailsGetDtoResponse> {
        let item = await this.cache.wrap<ILedgerObjectDetails>(this.getCacheKey(params), () => this.getItem(params), {
            ttl: DateUtil.MILLISECONDS_DAY / DateUtil.MILLISECONDS_SECOND
        });
        return item;
    }
}
