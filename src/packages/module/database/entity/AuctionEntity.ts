import { Auction, AuctionStatus } from '@project/common/platform';
import { Auction as HlfAuction } from '@project/common/hlf/auction';
import { ObjectUtil, TransformUtil } from '@ts-core/common';
import { CoinAmount } from '@hlf-core/common';
import { TypeormJSONTransformer, TypeormValidableEntity } from '@ts-core/backend';
import { Type, ClassTransformOptions } from 'class-transformer';
import { Matches, IsEnum, ValidateIf, IsDate, ValidateNested, IsDefined, IsNumber, IsOptional } from 'class-validator';
import { Entity, Column, UpdateDateColumn, CreateDateColumn, PrimaryGeneratedColumn } from 'typeorm';
import { RegExpUtil } from '@project/common/util';
import { AuctionType } from '@project/common/hlf/auction';
import * as _ from 'lodash';

@Entity({ name: 'auction' })
export class AuctionEntity extends TypeormValidableEntity implements Auction {

    // --------------------------------------------------------------------------
    //
    //  Static Methods
    //
    // --------------------------------------------------------------------------

    public static updateEntity(item: Partial<AuctionEntity>, auction: HlfAuction): Partial<AuctionEntity> {
        ObjectUtil.copyProperties(auction, item);
        item.nickname = Auction.getNicknameByUid(auction);
        return item;
    }

    // --------------------------------------------------------------------------
    //
    //  Properties
    //
    // --------------------------------------------------------------------------

    @PrimaryGeneratedColumn()
    @IsOptional()
    @IsNumber()
    public id: number;

    @Column()
    @Matches(RegExpUtil.AUCTION_UID_REG_EXP)
    public uid: string;

    @Column({ type: 'varchar' })
    @IsEnum(AuctionType)
    public type: AuctionType;

    @Column({ type: 'json', transformer: TypeormJSONTransformer.instance })
    @Type(() => CoinAmount)
    @IsDefined()
    @ValidateNested()
    public price: CoinAmount;

    @Column({ type: 'varchar' })
    @IsEnum(AuctionStatus)
    public status: AuctionStatus;

    @Column()
    @Type(() => Date)
    @IsDate()
    public expired: Date;

    @Column()
    @Matches(RegExpUtil.NICKNAME_REG_EXP)
    public nickname: string;

    @Column({ name: 'bidder_uid' })
    @ValidateIf(item => item.type === AuctionType.PRIMARY)
    @Matches(RegExpUtil.USER_UID_REG_EXP)
    public bidderUid?: string;

    @Column({ name: 'parent_uid' })
    @IsOptional()
    @Matches(RegExpUtil.NICKNAME_UID_REG_EXP)
    public parentUid?: string;

    @Column({ name: 'initiator_uid' })
    @ValidateIf(item => item.type === AuctionType.SECONDARY)
    @Matches(RegExpUtil.USER_UID_REG_EXP)
    public initiatorUid?: string;

    @Column()
    @Type(() => Date)
    @IsOptional()
    @IsDate()
    public finished?: Date;

    @CreateDateColumn()
    public created: Date;

    @UpdateDateColumn()
    public updated: Date;

    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    public toObject(options?: ClassTransformOptions): Auction {
        return TransformUtil.fromClass<Auction>(this, options);
    }

    // --------------------------------------------------------------------------
    //
    //  Public Properties
    //
    // --------------------------------------------------------------------------

    public get isSucceed(): boolean {
        return this.status === AuctionStatus.COMPLETED;
    }

    public get winnerUid(): string {
        return !_.isNil(this.bidderUid) ? this.bidderUid : this.initiatorUid;
    }
}
