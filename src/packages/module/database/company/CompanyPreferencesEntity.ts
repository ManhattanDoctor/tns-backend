import {
    CompanyPreferences,
    COMPANY_PREFERENCES_TITLE_MIN_LENGTH,
    COMPANY_PREFERENCES_TITLE_MAX_LENGTH,
    COMPANY_PREFERENCES_DESCRIPTION_MIN_LENGTH,
    COMPANY_PREFERENCES_DESCRIPTION_MAX_LENGTH,
    COMPANY_PREFERENCES_LOGO_MAX_LENGTH,
} from '@project/common/platform/company';
import { Exclude, Type } from 'class-transformer';
import { Length, MaxLength, IsNumber, IsOptional, IsString } from 'class-validator';
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CompanyEntity } from './CompanyEntity';
import * as _ from 'lodash';

@Entity({ name: 'company_preferences' })
export class CompanyPreferencesEntity implements CompanyPreferences {
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
    @MaxLength(COMPANY_PREFERENCES_LOGO_MAX_LENGTH)
    public picture: string;

    @Column()
    @IsString()
    @Length(COMPANY_PREFERENCES_TITLE_MIN_LENGTH, COMPANY_PREFERENCES_TITLE_MAX_LENGTH)
    public title: string;

    @Column()
    @IsString()
    @Length(COMPANY_PREFERENCES_DESCRIPTION_MIN_LENGTH, COMPANY_PREFERENCES_DESCRIPTION_MAX_LENGTH)
    public description: string;

    @Exclude()
    @OneToOne(() => CompanyEntity, company => company.preferences)
    @JoinColumn({ name: 'company_id' })
    @Type(() => CompanyEntity)
    public company: CompanyEntity;
}
