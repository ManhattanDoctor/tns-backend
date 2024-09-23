import { User } from '@project/common/platform';
import { TransformUtil, ObjectUtil } from '@ts-core/common';
import { TypeormValidableEntity } from '@ts-core/backend';
import { ClassTransformOptions } from 'class-transformer';
import { Matches, IsEnum, IsNumber, IsOptional } from 'class-validator';
import { Entity, Column, UpdateDateColumn, CreateDateColumn, PrimaryGeneratedColumn } from 'typeorm';
import { RegExpUtil } from '@project/common/util';
import { UserRole, UserStatus, User as HlfUser } from '@project/common/hlf/acl';
import * as _ from 'lodash';

@Entity({ name: 'user' })
export class UserEntity extends TypeormValidableEntity implements User {

    // --------------------------------------------------------------------------
    //
    //  Static Methods
    //
    // --------------------------------------------------------------------------

    public static updateEntity(item: Partial<UserEntity>, user: HlfUser): Partial<UserEntity> {
        ObjectUtil.copyProperties(user, item);
        item.address = User.getAddressByUid(user);
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
    @Matches(RegExpUtil.USER_UID_REG_EXP)
    public uid: string;

    @Column({ type: 'varchar' })
    @IsEnum(UserStatus)
    public status: UserStatus;

    @Column()
    @Matches(RegExpUtil.ETH_ADDRESS_REG_EXP)
    public address: string;

    @Column({ name: 'inviter_uid' })
    @Matches(RegExpUtil.USER_UID_REG_EXP)
    public inviterUid: string;

    @Column()
    @IsOptional()
    @Matches(RegExpUtil.ETH_ADDRESS_REG_EXP)
    public wallet?: string;

    @Column({ array: true, type: 'varchar' })
    @IsOptional()
    @IsEnum(UserRole, { each: true })
    public roles?: Array<UserRole>;

    @Column({ name: 'nickname_uid' })
    @IsOptional()
    @Matches(RegExpUtil.NICKNAME_UID_REG_EXP)
    public nicknameUid?: string;

    @CreateDateColumn()
    public created: Date;

    @UpdateDateColumn()
    public updated: Date;

    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    public toObject(options?: ClassTransformOptions): User {
        return TransformUtil.fromClass<User>(this, options);
    }

    // --------------------------------------------------------------------------
    //
    //  Public Properties
    //
    // --------------------------------------------------------------------------

}
