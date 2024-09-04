import { LedgerRoleStorage } from '@project/common/ledger';
import { LedgerCompany } from '@project/common/ledger/company';
import { Company, CompanyStatus } from '@project/common/platform/company';
import { TransformUtil } from '@ts-core/common';
import { TypeormJSONTransformer, TypeormValidableEntity } from '@ts-core/backend';
import { Exclude, Type, ClassTransformOptions } from 'class-transformer';
import { ValidateNested, Matches, IsDefined, IsEnum, IsNumber, IsOptional } from 'class-validator';
import * as _ from 'lodash';
import { Column, OneToMany, CreateDateColumn, Entity, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { UserCompany } from '@project/common/platform/user';
import { UserEntity, UserRoleEntity } from '../user';
import { CompanyPreferencesEntity } from './CompanyPreferencesEntity';
import { BillEntity } from '../bill';
import { TerminalEntity } from '@project/module/database/terminal';

@Entity({ name: 'company' })
export class CompanyEntity extends TypeormValidableEntity implements Company {
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
    @IsEnum(CompanyStatus)
    public status: CompanyStatus;

    @Column({ name: 'ledger_uid' })
    @Matches(LedgerCompany.UID_REG_EXP)
    public ledgerUid: string;

    @Column({ name: 'roles_total', type: 'json', transformer: TypeormJSONTransformer.instance })
    @IsDefined()
    public rolesTotal: LedgerRoleStorage;

    @CreateDateColumn({ name: 'created_date' })
    public createdDate: Date;

    @UpdateDateColumn({ name: 'updated_date' })
    public updatedDate: Date;

    @OneToOne(() => CompanyPreferencesEntity, preferences => preferences.company, { cascade: true })
    @IsDefined()
    @Type(() => CompanyPreferencesEntity)
    @ValidateNested()
    public preferences: CompanyPreferencesEntity;

    @Exclude()
    @OneToMany(() => BillEntity, item => item.company)
    @Type(() => BillEntity)
    public bills?: Array<BillEntity>;

    @Exclude()
    @OneToMany(() => UserEntity, item => item.company)
    @Type(() => UserEntity)
    public users?: Array<UserEntity>;

    @Exclude()
    @OneToMany(() => TerminalEntity, item => item.company)
    @Type(() => TerminalEntity)
    public terminals?: Array<TerminalEntity>;

    @Exclude()
    @Type(() => UserRoleEntity)
    public userRoles?: Array<UserRoleEntity>;

    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    public toObject(options?: ClassTransformOptions): Company {
        return TransformUtil.fromClass<Company>(this, options);
    }

    public toUserObject(options?: ClassTransformOptions): UserCompany {
        let item = { ...this.toObject(options), roles: [] };
        if (!_.isEmpty(this.userRoles)) {
            item.roles = this.userRoles.map(item => item.name);
        }
        return item;
    }
}
