import { LedgerUser } from '@project/common/ledger/user';
import { CompanyUser } from '@project/common/platform/company';
import { User, UserStatus, UserType } from '@project/common/platform/user';
import { UserResource } from '@project/common/platform/user/User';
import { UserRoleEntity } from '@project/module/database/user';
import { TransformUtil } from '@ts-core/common';
import { TypeormValidableEntity } from '@ts-core/backend';
import { Exclude, Expose, ClassTransformOptions, Type } from 'class-transformer';
import { ValidateNested, Matches, IsDefined, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import * as _ from 'lodash';
import { Column, CreateDateColumn, OneToMany, JoinColumn, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { CompanyEntity } from '../company';
import { TransformGroup } from '../TransformGroup';
import { UserCryptoKeyEntity } from './UserCryptoKeyEntity';
import { UserPreferencesEntity } from './UserPreferencesEntity';
import { BillEntity } from '../bill';

@Entity({ name: 'user' })
export class UserEntity extends TypeormValidableEntity implements User {
    // --------------------------------------------------------------------------
    //
    //  Properties
    //
    // --------------------------------------------------------------------------

    @PrimaryGeneratedColumn()
    @IsOptional()
    @IsNumber()
    public id: number;

    @Expose({ groups: [TransformGroup.PRIVATE] })
    @Column()
    @IsString()
    public login: string;

    @Expose({ groups: [TransformGroup.PRIVATE] })
    @Column({ type: 'varchar' })
    @IsEnum(UserResource)
    public resource: UserResource;

    @Column({ type: 'varchar' })
    @IsEnum(UserType)
    public type: UserType;

    @Expose({ groups: [TransformGroup.PRIVATE] })
    @Column({ type: 'varchar' })
    @IsEnum(UserStatus)
    public status: UserStatus;

    @Column({ name: "company_id" })
    @IsNumber()
    @IsOptional()
    public companyId: number;

    @Column({ name: 'ledger_uid' })
    @Matches(LedgerUser.UID_REG_EXP)
    public ledgerUid: string;

    @Expose({ groups: [TransformGroup.PRIVATE] })
    @CreateDateColumn({ name: 'created_date' })
    public createdDate: Date;

    @Expose({ groups: [TransformGroup.PRIVATE] })
    @UpdateDateColumn({ name: 'updated_date' })
    public updatedDate: Date;

    @OneToOne(() => UserPreferencesEntity, preferences => preferences.user, { cascade: true })
    @IsDefined()
    @ValidateNested()
    @Type(() => UserPreferencesEntity)
    public preferences: UserPreferencesEntity;

    @Exclude()
    @OneToOne(() => UserCryptoKeyEntity, cryptoKey => cryptoKey.user, { cascade: true })
    @IsDefined()
    @Type(() => UserCryptoKeyEntity)
    @ValidateNested()
    public cryptoKey: UserCryptoKeyEntity;

    @Exclude()
    @ManyToOne(() => CompanyEntity, item => item.users)
    @JoinColumn({ name: "company_id" })
    @IsOptional()
    @Type(() => CompanyEntity)
    @ValidateNested()
    public company?: CompanyEntity;

    @Exclude()
    @OneToMany(() => BillEntity, item => item.user)
    @Type(() => BillEntity)
    public bills?: Array<BillEntity>;

    @Exclude()
    @Type(() => UserRoleEntity)
    public userRoles?: Array<UserRoleEntity>;

    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    public toString(): string {
        return `${this.login}(${this.notifableUid})`;
    }

    public toObject(options?: ClassTransformOptions): User {
        return TransformUtil.fromClass<User>(this, options);
    }

    public toCompanyObject(options?: ClassTransformOptions): CompanyUser {
        let item = { ...this.toObject(options), roles: [] };
        if (!_.isEmpty(this.userRoles)) {
            item.roles = this.userRoles.map(item => item.name);
        }
        return item;
    }

    // --------------------------------------------------------------------------
    //
    //  Public Properties
    //
    // --------------------------------------------------------------------------

    @Exclude({ toPlainOnly: true })
    public get notifableUid(): number {
        return this.id;
    }
    
    @Exclude({ toPlainOnly: true })
    public get isUndefined(): boolean {
        return this.type === UserType.UNDEFINED;
    }
    @Exclude({ toPlainOnly: true })
    public get isAdministrator(): boolean {
        return this.type === UserType.ADMINISTRATOR;
    }
}
