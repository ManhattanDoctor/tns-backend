import { TransformUtil, ObjectUtil } from '@ts-core/common';
import { Coin as HlfCoin, CoinBalance } from '@hlf-core/common';
import { Type, ClassTransformOptions, Exclude } from 'class-transformer';
import { IsInt, Matches, IsNumber, Min, IsDefined, IsOptional } from 'class-validator';
import { CreateDateColumn, Column, UpdateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { TypeormJSONTransformer, TypeormValidableEntity } from '@ts-core/backend';
import { Coin } from '@project/common/platform';
import { CoinBalanceEntity } from './CoinBalanceEntity';
import { RegExpUtil } from '@project/common/util';
import * as _ from 'lodash';

@Entity({ name: 'coin' })
export class CoinEntity extends TypeormValidableEntity implements Coin {

    // --------------------------------------------------------------------------
    //
    //  Static Methods
    //
    // --------------------------------------------------------------------------

    public static updateEntity(item: Partial<CoinEntity>, coin: HlfCoin): Partial<CoinEntity> {
        ObjectUtil.copyProperties(coin, item);
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
    @Matches(RegExpUtil.COIN_UID_REG_EXP)
    public uid: string;

    @Column({ type: 'json', transformer: TypeormJSONTransformer.instance })
    @IsDefined()
    @Type(() => CoinBalance)
    public balance: CoinBalance;

    @CreateDateColumn()
    public created: Date;

    @UpdateDateColumn()
    public updated: Date;

    @Exclude()
    @OneToMany(() => CoinBalanceEntity, item => item.coin)
    @Type(() => CoinBalanceEntity)
    public balances?: Array<CoinBalanceEntity>;

    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    public toObject(options?: ClassTransformOptions): Coin {
        return TransformUtil.fromClass<Coin>(this, options);
    }
}
