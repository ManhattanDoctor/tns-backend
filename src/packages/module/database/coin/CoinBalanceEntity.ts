import { ObjectUtil } from '@ts-core/common';
import { Exclude, Type, ClassTransformOptions } from 'class-transformer';
import { IsString, IsNumber, IsNumberString, IsOptional, ValidateNested } from 'class-validator';
import { CreateDateColumn, JoinColumn, ManyToOne, UpdateDateColumn, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import * as _ from 'lodash';
import { CoinBalance } from '@project/common/platform/coin';
import { CoinEntity } from './CoinEntity';
import { LedgerCoinObjectBalance } from '@project/common/ledger/coin';
import { TypeormValidableEntity } from '@ts-core/backend';

@Entity({ name: 'coin_balance' })
export class CoinBalanceEntity extends TypeormValidableEntity {
    // --------------------------------------------------------------------------
    //
    //  Static Methods
    //
    // --------------------------------------------------------------------------

    public static updateEntity(item: Partial<CoinBalanceEntity>, balance: LedgerCoinObjectBalance): Partial<CoinBalanceEntity> {
        ObjectUtil.copyProperties(balance, item, ['held', 'inUse', 'total']);
        return item;
    }

    // --------------------------------------------------------------------------
    //
    //  Properties
    //
    // --------------------------------------------------------------------------

    @Exclude()
    @PrimaryGeneratedColumn()
    @IsOptional()
    @IsNumber()
    public id: number;

    @Exclude()
    @Column({ name: 'ledger_uid' })
    @IsString()
    public ledgerUid: string;

    @Exclude()
    @Column({ name: 'coin_id' })
    public coinId: number;

    @Column()
    @IsNumberString()
    public held: string;

    @Column({ name: 'in_use' })
    @IsNumberString()
    public inUse: string;

    @Column()
    @IsNumberString()
    public total: string;

    @Exclude()
    @CreateDateColumn({ name: 'created_date' })
    public createdDate: Date;

    @Exclude()
    @UpdateDateColumn({ name: 'updated_date' })
    public updatedDate: Date;

    @ManyToOne(() => CoinEntity, item => item.balances)
    @JoinColumn({ name: "coin_id" })
    @ValidateNested()
    @Type(() => CoinEntity)
    public coin?: CoinEntity;

    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    public toObject(options?: ClassTransformOptions): CoinBalance {
        return {
            id: this.coin.id,
            coinUid: this.coin.ledgerUid,
            objectUid: this.ledgerUid,
            held: this.held,
            inUse: this.inUse,
            total: this.total,
            coinId: this.coin.coinId,
            decimals: this.coin.decimals,
            companyId: this.coin.companyId,
        }
    }
}
