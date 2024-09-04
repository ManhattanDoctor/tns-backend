import { TransformUtil } from '@ts-core/common';
import { TypeormValidableEntity } from '@ts-core/backend';
import { Expose, ClassTransformOptions } from 'class-transformer';
import { IsBoolean, IsNumber, IsOptional } from 'class-validator';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { TransformGroup } from '../TransformGroup';
import { TerminalSubscription } from '@project/common/platform/terminal';
import * as _ from 'lodash';

@Entity({ name: 'terminal_subscription' })
export class TerminalSubscriptionEntity extends TypeormValidableEntity implements TerminalSubscription {

    // --------------------------------------------------------------------------
    //
    //  Static Methods
    //
    // --------------------------------------------------------------------------

    public static createEntity(terminalId: number, userId: number): TerminalSubscriptionEntity {
        let item = new TerminalSubscriptionEntity();
        item.userId = userId;
        item.terminalId = terminalId;
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

    @Column({ name: "user_id" })
    @IsNumber()
    public userId: number;

    @Column({ name: "terminal_id" })
    @IsNumber()
    public terminalId: number;

    @Column({ name: "is_subscribed" })
    @IsBoolean()
    public isSubscribed: boolean;

    @Expose({ groups: [TransformGroup.PRIVATE] })
    @CreateDateColumn({ name: 'created_date' })
    public createdDate: Date;

    @Expose({ groups: [TransformGroup.PRIVATE] })
    @UpdateDateColumn({ name: 'updated_date' })
    public updatedDate: Date;

    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    public toObject(options?: ClassTransformOptions): TerminalSubscription {
        return TransformUtil.fromClass<TerminalSubscription>(this, options);
    }
}
