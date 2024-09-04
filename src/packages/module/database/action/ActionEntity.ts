import { LedgerCompany } from '@project/common/ledger/company';
import { TransformUtil, Sha512, ObjectUtil } from '@ts-core/common';
import { ClassTransformOptions } from 'class-transformer';
import { IsBoolean, IsInt, Matches, IsString, IsDate, IsEnum, IsNumber, IsOptional } from 'class-validator';
import * as _ from 'lodash';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Action, ActionType } from '@project/common/platform';
import { LedgerUser } from '@project/common/ledger/user';
import { LedgerCoin } from '@project/common/ledger/coin';
import { LedgerBlockTransaction } from '@hlf-explorer/common';
import { TypeormValidableEntity } from '@ts-core/backend';
import { LedgerBill } from '@project/common/ledger/bill';
import { LedgerTerminal } from '@project/common/ledger/terminal';

@Entity({ name: 'action' })
export class ActionEntity extends TypeormValidableEntity implements Action {
    // --------------------------------------------------------------------------
    //
    //  Static Methods
    //
    // --------------------------------------------------------------------------

    public static getUid(item: ActionEntity): string {
        return Sha512.hex(`${item.requestId}${item.objectUid}${item.type}`);
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
    @IsDate()
    public date: Date;

    @Column()
    @IsString()
    public uid: string;

    @Column({ type: 'varchar' })
    @IsEnum(ActionType)
    public type: ActionType;

    @Column({ name: 'request_id' })
    @IsString()
    public requestId: string;

    @Column({ name: 'object_uid' })
    @IsString()
    public objectUid: string;

    @Column({ name: 'initiator_uid' })
    @Matches(LedgerUser.UID_REG_EXP)
    public initiatorUid: string;

    @Column({ name: 'is_executed' })
    @IsBoolean()
    public isExecuted: boolean;

    @Column({ name: 'user_uid', nullable: true })
    @Matches(LedgerUser.UID_REG_EXP)
    @IsOptional()
    public userUid?: string;

    @Column({ name: 'coin_uid', nullable: true })
    @Matches(LedgerCoin.UID_REG_EXP)
    @IsOptional()
    public coinUid?: string;

    @Column({ name: 'bill_uid', nullable: true })
    @Matches(LedgerBill.UID_REG_EXP)
    @IsOptional()
    public billUid?: string;

    @Column({ name: 'terminal_uid', nullable: true })
    @Matches(LedgerTerminal.UID_REG_EXP)
    @IsOptional()
    public terminalUid?: string;

    @Column({ name: 'company_uid', nullable: true })
    @Matches(LedgerCompany.UID_REG_EXP)
    @IsOptional()
    public companyUid?: string;

    @Column({ nullable: true })
    @IsString()
    @IsOptional()
    public amount?: string;

    @Column({ nullable: true })
    @IsInt()
    @IsOptional()
    public decimals?: number;

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(type?: ActionType, objectUid?: string, details?: Partial<ActionEntity>, transaction?: LedgerBlockTransaction) {
        super();
        if (!_.isNil(type)) {
            this.type = type;
        }
        if (!_.isNil(objectUid)) {
            this.objectUid = objectUid;
        }
        if (!_.isNil(details)) {
            ObjectUtil.copyPartial(details, this);
        }
        if (!_.isNil(transaction)) {
            this.date = transaction.date;
            this.isExecuted = transaction.validationCode === 0 && _.isNil(transaction.responseErrorCode);
            this.requestId = transaction.requestId;
            this.initiatorUid = transaction.requestUserId;
            this.uid = ActionEntity.getUid(this);
        }
    }

    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    public toObject(options?: ClassTransformOptions): Action {
        return TransformUtil.fromClass<Action>(this, options);
    }
}
