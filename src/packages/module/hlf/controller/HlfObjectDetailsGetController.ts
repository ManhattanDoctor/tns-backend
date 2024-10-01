import { Controller, Get, Query } from '@nestjs/common';
import { DefaultController, Cache } from '@ts-core/backend-nestjs';
import { Logger, ExtendedError, DateUtil } from '@ts-core/common';
import { Swagger } from '@project/module/swagger';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';
import { getType, HlfObjectType } from '@project/common/hlf';
import { IHlfObjectDetails, HLF_OBJECT_DETAILS_URL, hlfObjectPicture } from '@project/common/platform/api';
import { IHlfObjectDetailsGetDto, IHlfObjectDetailsGetDtoResponse } from '@project/common/platform/api/hlf';
import { AuctionEntity, NicknameEntity, UserEntity } from '@project/module/database/entity';
import * as _ from 'lodash';

// --------------------------------------------------------------------------
//
//  Controller
//
// --------------------------------------------------------------------------

export class HlfObjectDetailsGetDto implements IHlfObjectDetailsGetDto {
    @IsString()
    uid: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    traceId?: string;
}

@Controller(`${HLF_OBJECT_DETAILS_URL}`)
export class HlfObjectDetailsGetController extends DefaultController<IHlfObjectDetailsGetDto, IHlfObjectDetailsGetDtoResponse> {
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

    private async getItem(params: HlfObjectDetailsGetDto): Promise<IHlfObjectDetails> {
        let { uid } = params;
        let type = getType(uid);
        if (type === HlfObjectType.USER) {
            let item = await UserEntity.createQueryBuilder('item').where('item.uid  = :uid', { uid }).getOne();
            return { id: item.id, name: item.address, picture: hlfObjectPicture(uid, { display: 'monsterid' }), type };
        }
        else if (type === HlfObjectType.NICKNAME) {
            let item = await NicknameEntity.createQueryBuilder('item').where('item.uid  = :uid', { uid }).getOne();
            return { id: item.id, name: item.nickname, picture: hlfObjectPicture(uid, { display: 'retro' }), type };
        }
        else if (type === HlfObjectType.AUCTION) {
            let item = await AuctionEntity.createQueryBuilder('item').where('item.uid  = :uid', { uid }).getOne();
            return { id: item.id, name: item.nickname, picture: hlfObjectPicture(uid, {}), type };
        }
        throw new ExtendedError(`Unknown "${type}" type`);
    }

    private getCacheKey(params: HlfObjectDetailsGetDto): string {
        return `hldObject_${params.uid}`;
    }

    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    @Swagger({ name: 'Get hlf object details', response: null })
    @Get()
    public async executeExtended(@Query() params: HlfObjectDetailsGetDto): Promise<IHlfObjectDetailsGetDtoResponse> {
        let item = await this.cache.wrap<IHlfObjectDetails>(this.getCacheKey(params), () => this.getItem(params), DateUtil.MILLISECONDS_DAY);
        return item;
    }
}
