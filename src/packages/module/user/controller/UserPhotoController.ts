import { Body, Controller, Param, Post, Req, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { DefaultController } from '@ts-core/backend';
import { Logger, Sha512 } from '@ts-core/common';
import { IsBase64, IsOptional, IsString } from 'class-validator';
import * as _ from 'lodash';
import { Swagger } from '@project/module/swagger';
import { UserGuard } from '@project/module/guard';
import { IUserHolder, UserEntity } from '@project/module/database/user';
import { DatabaseService } from '@project/module/database/service';
import { IUserPhotoDto, IUserPhotoDtoResponse } from '@project/common/platform/api/user';
import { USER_PHOTO_URL } from '@project/common/platform/api';
import { TransformGroup } from '@project/module/database';
import { User, UserStatus } from '@project/common/platform/user';
import { UserUidAlreadyExistsError } from '../../core/middleware';
import { LedgerService } from '@project/module/ledger/service';
import { LedgerCoinIdPreset } from '@project/common/ledger/coin';
import { ROOT_COIN_RUB_AMOUNT } from '@project/common/ledger';
import { UserNotFoundError } from '@project/module/core/middleware';
import { FaceService } from '@project/module/face/service';

// --------------------------------------------------------------------------
//
//  Dto
//
// --------------------------------------------------------------------------

export class UserPhotoDto implements IUserPhotoDto {
    @ApiPropertyOptional()
    @IsOptional()
    id?: number;

    @ApiPropertyOptional()
    @IsBase64()
    photo: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    traceId?: string;
}

@Controller(`${USER_PHOTO_URL}/:id`)
export class UserPhotoController extends DefaultController<IUserPhotoDto, IUserPhotoDtoResponse> {
    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(logger: Logger, private database: DatabaseService, private ledger: LedgerService, private face: FaceService) {
        super(logger);
    }

    // --------------------------------------------------------------------------
    //
    //  Private Methods
    //
    // --------------------------------------------------------------------------

    private async getUid(item: string): Promise<string> {
        let value = await this.face.search(item);
        return !_.isNil(value) ? value : this.face.create(item);
    }

    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    @Swagger({ name: 'User photo', response: User })
    @Post()
    @UseGuards(UserGuard)
    public async executeExtended(@Param('id', ParseIntPipe) userId: number, @Body() params: UserPhotoDto, @Req() request: IUserHolder): Promise<IUserPhotoDtoResponse> {
        let user = request.user;
        let item = await this.database.userGet(userId);

        let status = !user.isAdministrator ? [UserStatus.ACTIVE] : null;
        UserGuard.checkUser({ isRequired: true, status }, item);

        if (!_.isNil(item.preferences.uid)) {
            throw new UserUidAlreadyExistsError();
        }

        let uid = await this.getUid(params.photo);
        console.log(uid);
        if (!_.isNil(await this.database.userGetByUid(uid))) {
            throw new UserUidAlreadyExistsError();
        }

        await this.ledger.coinEmit(item, LedgerCoinIdPreset.RUB, ROOT_COIN_RUB_AMOUNT);

        item.preferences.uid = uid;
        await item.save();
        return item.toObject({ groups: [TransformGroup.PUBLIC_DETAILS, TransformGroup.PRIVATE] });
    }
}
