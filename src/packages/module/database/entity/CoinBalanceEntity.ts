import { MathUtil, ObjectUtil, TransformUtil } from '@ts-core/common';
import { Exclude, Type, ClassTransformOptions } from 'class-transformer';
import { IsString, Matches, IsNumber, IsInt, Min, IsNumberString, IsOptional, ValidateNested } from 'class-validator';
import { CreateDateColumn, JoinColumn, ManyToOne, UpdateDateColumn, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { CoinEntity } from './CoinEntity';
import { TypeormValidableEntity } from '@ts-core/backend';
import { CoinBalance } from '@project/common/platform';
import { CoinBalance as HlfCoinBalance } from '@project/common/hlf/auction';
import { RegExpUtil } from '@project/common/util';
import * as _ from 'lodash';

@Entity({ name: 'coin_balance' })
export class CoinBalanceEntity extends TypeormValidableEntity implements CoinBalance {

    // --------------------------------------------------------------------------
    //
    //  Static Methods
    //
    // --------------------------------------------------------------------------

    public static updateEntity(item: Partial<CoinBalanceEntity>, balance: HlfCoinBalance): Partial<CoinBalanceEntity> {
        ObjectUtil.copyProperties(balance, item);
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
    @IsString()
    public uid: string;

    @Column()
    @IsNumberString()
    public held: string;

    @Column({ name: 'in_use' })
    @IsNumberString()
    public inUse: string;

    @Column()
    @IsNumberString()
    public total: string;

    @Column()
    @IsInt()
    @Min(0)
    public decimals: number;

    @Column({ name: 'coin_uid' })
    @Matches(RegExpUtil.COIN_UID_REG_EXP)
    public coinUid: string;

    @Exclude()
    @CreateDateColumn()
    public created: Date;

    @Exclude()
    @UpdateDateColumn()
    public updated: Date;

    @Exclude()
    @Column({ name: 'coin_id' })
    public coinId: number;

    @Exclude()
    @ManyToOne(() => CoinEntity, item => item.balances)
    @JoinColumn({ name: "coin_id" })
    @ValidateNested()
    @Type(() => CoinEntity)
    public coin: CoinEntity;

    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    public isEmpty(): boolean {
        return _.isNil(this.total) || MathUtil.equals(this.total, '0');
    }

    public toObject(options?: ClassTransformOptions): CoinBalance {
        return TransformUtil.fromClass<CoinBalance>(this, options);
    }
}
