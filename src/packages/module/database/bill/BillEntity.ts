import { LedgerBill, LedgerBillStatus } from '@project/common/ledger/bill';
import { Bill } from '@project/common/platform/bill';
import { TransformUtil, ObjectUtil } from '@ts-core/common';
import { Exclude, ClassTransformOptions, Type } from 'class-transformer';
import { ValidateNested, MaxLength, IsString, IsNumberString, IsDate, Matches, IsEnum, IsNumber, IsOptional } from 'class-validator';
import { Column, ManyToOne, JoinColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { UserEntity } from '../user';
import { CompanyEntity } from '../company';
import * as _ from 'lodash';
import { TypeormValidableEntity } from '@ts-core/backend';
import { CoinEntity } from '../coin';
import { BILL_DESCRIPTION_MAX_LENGTH } from '@project/common/platform/bill';
import { TerminalEntity } from '@project/module/database/terminal';

@Entity({ name: 'bill' })
export class BillEntity extends TypeormValidableEntity implements Bill {

    // --------------------------------------------------------------------------
    //
    //  Static Methods
    //
    // --------------------------------------------------------------------------

    public static createEntity(bill: LedgerBill): BillEntity {
        let item = new BillEntity();
        item.ledgerUid = bill.uid;
        BillEntity.updateEntity(item, bill);
        return item;
    }

    public static updateEntity(item: Partial<Bill>, bill: LedgerBill): Partial<Bill> {
        ObjectUtil.copyProperties(bill, item, ['createdDate', 'description', 'amount', 'status']);
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

    @Column({ type: 'varchar' })
    @IsEnum(LedgerBillStatus)
    public status: LedgerBillStatus;

    @Column({ name: 'ledger_uid' })
    @IsOptional()
    @Matches(LedgerBill.UID_REG_EXP)
    public ledgerUid: string;

    @Column()
    @IsString()
    @MaxLength(BILL_DESCRIPTION_MAX_LENGTH)
    public description: string;

    @Column({ name: 'created_date' })
    @IsDate()
    public createdDate: Date;

    @UpdateDateColumn({ name: 'updated_date' })
    public updatedDate: Date;

    @Column({ name: "user_id" })
    @IsNumber()
    public userId: number;

    @Column({ name: 'coin_id' })
    public coinId: number;

    @Column({ name: "company_id" })
    @IsNumber()
    public companyId: number;

    @Column({ name: "terminal_id" })
    @IsNumber()
    public terminalId: number;

    @Column()
    @IsNumberString()
    public amount: string;

    @ManyToOne(() => CoinEntity, item => item.bills)
    @JoinColumn({ name: "coin_id" })
    @Type(() => CoinEntity)
    @ValidateNested()
    public coin: CoinEntity;

    @Exclude()
    @ManyToOne(() => UserEntity, item => item.bills)
    @JoinColumn({ name: "user_id" })
    @Type(() => UserEntity)
    @ValidateNested()
    public user: UserEntity;

    @ManyToOne(() => CompanyEntity, item => item.bills)
    @JoinColumn({ name: "company_id" })
    @ValidateNested()
    @Type(() => CompanyEntity)
    public company?: CompanyEntity;

    @ManyToOne(() => TerminalEntity, item => item.bills)
    @JoinColumn({ name: "terminal_id" })
    @ValidateNested()
    @Type(() => TerminalEntity)
    public terminal?: TerminalEntity;

    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    public toObject(options?: ClassTransformOptions): Bill {
        return TransformUtil.fromClass<Bill>(this, options);
    }
}
