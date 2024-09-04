import { ObjectUtil, TransformUtil } from '@ts-core/common';
import { Exclude, Type, ClassTransformOptions } from 'class-transformer';
import { IsInt, Matches, IsNumber, IsString, IsNumberString, IsOptional } from 'class-validator';
import { CreateDateColumn, OneToMany, UpdateDateColumn, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import * as _ from 'lodash';
import { LedgerCoin } from '@project/common/ledger/coin';
import { CoinBalanceEntity } from './CoinBalanceEntity';
import { Coin } from '@project/common/platform/coin';
import { TypeormValidableEntity } from '@ts-core/backend';
import { BillEntity } from '../bill';

@Entity({ name: 'coin' })
export class CoinEntity extends TypeormValidableEntity implements Coin {
    // --------------------------------------------------------------------------
    //
    //  Static Methods
    //
    // --------------------------------------------------------------------------

    public static updateEntity(item: Partial<Coin>, coin: LedgerCoin): Partial<Coin> {
        ObjectUtil.copyProperties(coin.balance, item, ['burned', 'emitted', 'inUse', 'held']);
        item.total = coin.balance.getTotal();
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

    @Column({ name: 'coin_id', type: 'varchar' })
    @IsString()
    public coinId: string;

    @Column()
    @IsNumberString()
    public held: string;

    @Column({ name: 'in_use' })
    @IsNumberString()
    public inUse: string;

    @Column()
    @IsNumberString()
    public burned: string;

    @Column()
    @IsNumberString()
    public emitted: string;

    @Column()
    @IsNumberString()
    public total: string;

    @Column()
    @IsInt()
    public decimals: number;

    @Exclude()
    @Column({ name: 'company_id' })
    @IsNumber()
    public companyId: number;

    @Column({ name: 'ledger_uid' })
    @Matches(LedgerCoin.UID_REG_EXP)
    public ledgerUid: string;

    @CreateDateColumn({ name: 'created_date' })
    public createdDate: Date;

    @UpdateDateColumn({ name: 'updated_date' })
    public updatedDate: Date;

    @Exclude()
    @OneToMany(() => BillEntity, item => item.coin)
    @Type(() => BillEntity)
    public bills?: Array<BillEntity>;

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
