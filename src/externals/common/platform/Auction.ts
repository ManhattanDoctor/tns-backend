import { IsDate, ValidateIf, Matches, ValidateNested, IsDefined, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { Auction as HlfAuction } from '../hlf/auction';

export enum AuctionStatus {
    FAILED = 'FAILED',
    COMPLETED = 'COMPLETED',
    IN_PROGRESS = 'IN_PROGRESS',
}
export class Auction extends HlfAuction {
    id: number;

    @IsEnum(AuctionStatus)
    status: AuctionStatus;

    @Type(() => Date)
    @IsDate()
    finished?: Date;
}

export function getAuctionRoom(id: number): string {
    return `auction${id}`;
}
