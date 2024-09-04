
import {
    UserPreferences,
    USER_PREFERENCES_NAME_MIN_LENGTH,
    USER_PREFERENCES_NAME_MAX_LENGTH,
    USER_PREFERENCES_DESCRIPTION_MAX_LENGTH,
    USER_PREFERENCES_PHONE_MAX_LENGTH,
    USER_PREFERENCES_STRING_MAX_LENGTH,
    USER_PREFERENCES_PICTURE_MAX_LENGTH,
    USER_PREFERENCES_LOCATION_MAX_LENGTH,
} from '@project/common/platform/user';
import { Exclude, Type } from 'class-transformer';
import { ObjectUtil } from '@ts-core/common';
import { IsEmail, IsDate, IsEnum, Length, IsBoolean, MaxLength, IsNumber, IsOptional, IsString } from 'class-validator';
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from './UserEntity';
import * as _ from 'lodash';
import { LoginUser } from '@project/common/platform/api/login';

@Entity({ name: 'user_preferences' })
export class UserPreferencesEntity implements UserPreferences {
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

    @Column()
    @IsString()
    @Length(USER_PREFERENCES_NAME_MIN_LENGTH, USER_PREFERENCES_NAME_MAX_LENGTH)
    public name: string;

    @Column({ nullable: true })
    @IsEmail()
    @IsOptional()
    @MaxLength(USER_PREFERENCES_STRING_MAX_LENGTH)
    public uid?: string;

    @Column({ nullable: true })
    @IsEmail()
    @IsOptional()
    @MaxLength(USER_PREFERENCES_STRING_MAX_LENGTH)
    public email?: string;

    @Column({ nullable: true })
    @IsString()
    @IsOptional()
    @MaxLength(USER_PREFERENCES_PHONE_MAX_LENGTH)
    public phone?: string;

    @Column({ nullable: true })
    @IsString()
    @IsOptional()
    @MaxLength(USER_PREFERENCES_DESCRIPTION_MAX_LENGTH)
    public description?: string;

    @Column({ nullable: true })
    @IsString()
    @IsOptional()
    @MaxLength(USER_PREFERENCES_DESCRIPTION_MAX_LENGTH)
    public locale?: string;

    @Column({ nullable: true })
    @IsString()
    @IsOptional()
    @MaxLength(USER_PREFERENCES_PICTURE_MAX_LENGTH)
    public picture?: string;

    @Column({ name: 'is_male', nullable: true })
    @IsBoolean()
    @IsOptional()
    public isMale?: boolean;

    @Column({ nullable: true })
    @IsDate()
    @IsOptional()
    public birthday?: Date;

    @Column({ nullable: true })
    @IsString()
    @IsOptional()
    @MaxLength(USER_PREFERENCES_LOCATION_MAX_LENGTH)
    public location?: string;

    @Exclude()
    @OneToOne(() => UserEntity, user => user.preferences)
    @JoinColumn({ name: 'user_id' })
    @Type(() => UserEntity)
    public user: UserEntity;

    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    constructor(item?: LoginUser) {
        if (_.isNil(item) || _.isNil(item.preferences)) {
            return;
        }
        let preferences = item.preferences;
        if (_.isString(preferences.birthday)) {
            preferences.birthday = new Date(preferences.birthday);
        }
        ObjectUtil.copyPartial(preferences, this);
    }
}
