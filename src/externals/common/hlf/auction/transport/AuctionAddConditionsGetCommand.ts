import { TransformUtil } from '@ts-core/common';
import { IsEnum, ValidateNested, ValidateIf, Matches, IsDefined, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { CoinAmount, HlfTransportCommandAsync, ICoinAmount } from '@hlf-core/common';
import { CommandName } from './Command';
import { RegExpUtil } from '../../../util';
import { AuctionType } from '../Auction';

export class AuctionAddConditionsGetCommand extends HlfTransportCommandAsync<IAuctionAddConditionsGetDto, IAuctionAddConditionsGetDtoResponse> {
    // --------------------------------------------------------------------------
    //
    //  Public Static Properties
    //
    // --------------------------------------------------------------------------

    public static readonly NAME = CommandName.AUCTION_ADD_CONDITIONS_GET;

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(request: IAuctionAddConditionsGetDto) {
        super(AuctionAddConditionsGetCommand.NAME, TransformUtil.toClass(AuctionAddConditionsGetDto, request), null, true);
    }

    // --------------------------------------------------------------------------
    //
    //  Protected Methods
    //
    // --------------------------------------------------------------------------

    protected checkResponse(item: IAuctionAddConditionsGetDtoResponse): AuctionAddConditionsGetDtoResponse {
        return TransformUtil.toClass(AuctionAddConditionsGetDtoResponse, item);
    }
}

export interface IAuctionAddConditionsGetDto {
    price?: ICoinAmount;
    nickname?: string;
}

export interface IAuctionAddConditionsGetDtoResponse {
    type: AuctionType;
    price: ICoinAmount;
    expired: Date;
    parentUid: string;
}

export class AuctionAddConditionsGetDto implements IAuctionAddConditionsGetDto {
    @IsOptional()
    @IsDefined()
    @Type(() => CoinAmount)
    price: CoinAmount;

    @IsOptional()
    @Matches(RegExpUtil.NICKNAME_REG_EXP)
    nickname?: string;
}

export class AuctionAddConditionsGetDtoResponse implements IAuctionAddConditionsGetDtoResponse {
    @Type(() => CoinAmount)
    @IsDefined()
    @ValidateNested()
    price: CoinAmount;

    @IsEnum(AuctionType)
    type: AuctionType;

    @Type(() => Date)
    expired: Date;

    @Matches(RegExpUtil.NICKNAME_REG_EXP)
    parentUid: string;
}
