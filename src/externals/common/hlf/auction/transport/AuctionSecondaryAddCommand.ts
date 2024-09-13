import { TransformUtil } from '@ts-core/common';
import { ValidateNested, IsDefined } from 'class-validator';
import { Type } from 'class-transformer';
import { CoinAmount, HlfTransportCommandAsync, ICoinAmount } from '@hlf-core/common';
import { CommandName } from './Command';
import { Auction } from '../Auction';

export class AuctionSecondaryAddCommand extends HlfTransportCommandAsync<IAuctionSecondaryAddDto, Auction> {
    // --------------------------------------------------------------------------
    //
    //  Public Static Properties
    //
    // --------------------------------------------------------------------------

    public static readonly NAME = CommandName.AUCTION_SECONDARY_ADD;

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(request: IAuctionSecondaryAddDto) {
        super(AuctionSecondaryAddCommand.NAME, TransformUtil.toClass(AuctionSecondaryAddDto, request));
    }
}

export interface IAuctionSecondaryAddDto {
    price: ICoinAmount;
}

export class AuctionSecondaryAddDto {
    @Type(() => CoinAmount)
    @IsDefined()
    @ValidateNested()
    public price: CoinAmount;
}
