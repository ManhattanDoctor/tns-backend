import { TransformUtil, Sha512, ObjectUtil } from '@ts-core/common';
import { ClassTransformOptions } from 'class-transformer';
import { IsBoolean, IsInt, Matches, IsString, IsDate, IsEnum, IsNumber, IsOptional } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Action, ActionType } from '@project/common/platform';
import { LedgerBlockTransaction } from '@hlf-explorer/common';
import { TypeormValidableEntity } from '@ts-core/backend';
import { RegExpUtil } from '@project/common/util';
import * as _ from 'lodash';

@Entity({ name: 'action' })
export class ActionEntity extends TypeormValidableEntity implements Action {
    // --------------------------------------------------------------------------
    //
    //  Static Methods
    //
    // --------------------------------------------------------------------------

    private static getUid(item: ActionEntity, eventUid?: string): string {
        let uid = `${item.requestId}${item.objectUid}${item.type}`;
        if (!_.isNil(eventUid)) {
            uid += eventUid;
        }
        return Sha512.hex(uid);
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

    @Column({ name: 'is_executed' })
    @IsBoolean()
    public isExecuted: boolean;

    @Column({ name: 'initiator_uid' })
    @Matches(RegExpUtil.USER_UID_REG_EXP)
    @IsOptional()
    public initiatorUid?: string;

    @Column({ name: 'user_uid', nullable: true })
    @Matches(RegExpUtil.USER_UID_REG_EXP)
    @IsOptional()
    public userUid?: string;

    @Column({ name: 'coin_uid', nullable: true })
    @Matches(RegExpUtil.COIN_UID_REG_EXP)
    @IsOptional()
    public coinUid?: string;

    @Column({ name: 'auction_uid', nullable: true })
    @Matches(RegExpUtil.AUCTION_UID_REG_EXP)
    @IsOptional()
    public auctionUid?: string;

    @Column({ name: 'nickname_uid', nullable: true })
    @Matches(RegExpUtil.NICKNAME_UID_REG_EXP)
    @IsOptional()
    public nicknameUid?: string;

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

    constructor(type?: ActionType, objectUid?: string, details?: Partial<ActionEntity>, transaction?: LedgerBlockTransaction, eventUid?: string) {
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
        if (_.isNil(transaction)) {
            return;
        }
        this.date = transaction.date;
        this.requestId = transaction.requestId;
        this.isExecuted = transaction.validationCode === 0 && _.isNil(transaction.responseErrorCode);
        this.initiatorUid = transaction.requestUserId;
        this.uid = ActionEntity.getUid(this, eventUid);
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
