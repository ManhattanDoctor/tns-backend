import { LedgerUser } from '@project/common/ledger/user';
import { Terminal, TERMINAL_DESCRIPTION_MAX_LENGTH } from '@project/common/platform/terminal';
import { TransformUtil } from '@ts-core/common';
import { TypeormValidableEntity } from '@ts-core/backend';
import { Exclude, Expose, ClassTransformOptions, Type } from 'class-transformer';
import { ValidateNested, Matches, IsString, MaxLength, IsDefined, IsEnum, IsNumber, IsOptional } from 'class-validator';
import { Column, CreateDateColumn, JoinColumn, OneToMany, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { CompanyEntity } from '../company';
import { TransformGroup } from '../TransformGroup';
import { TerminalCryptoKeyEntity } from './TerminalCryptoKeyEntity';
import { LedgerTerminal, LedgerTerminalStatus } from '@project/common/ledger/terminal';
import { BillEntity } from '../bill';
import * as _ from 'lodash';

@Entity({ name: 'terminal' })
export class TerminalEntity extends TypeormValidableEntity implements Terminal {
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
    @IsEnum(LedgerTerminalStatus)
    public status: LedgerTerminalStatus;

    @Column()
    @IsString()
    @MaxLength(TERMINAL_DESCRIPTION_MAX_LENGTH)
    public description: string;

    @Column({ name: "company_id" })
    @IsNumber()
    public companyId: number;

    @Column({ name: 'ledger_uid' })
    @Matches(LedgerTerminal.UID_REG_EXP)
    public ledgerUid: string;

    @Expose({ groups: [TransformGroup.PRIVATE] })
    @CreateDateColumn({ name: 'created_date' })
    public createdDate: Date;

    @Expose({ groups: [TransformGroup.PRIVATE] })
    @UpdateDateColumn({ name: 'updated_date' })
    public updatedDate: Date;

    @Exclude()
    @OneToOne(() => TerminalCryptoKeyEntity, cryptoKey => cryptoKey.terminal, { cascade: true })
    @IsDefined()
    @Type(() => TerminalCryptoKeyEntity)
    @ValidateNested()
    public cryptoKey: TerminalCryptoKeyEntity;

    @Exclude()
    @ManyToOne(() => CompanyEntity, item => item.users)
    @JoinColumn({ name: "company_id" })
    @IsOptional()
    @Type(() => CompanyEntity)
    @ValidateNested()
    public company?: CompanyEntity;

    @Exclude()
    @OneToMany(() => BillEntity, item => item.terminal)
    @Type(() => BillEntity)
    public bills?: Array<BillEntity>;

    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    public toObject(options?: ClassTransformOptions): Terminal {
        return TransformUtil.fromClass<Terminal>(this, options);
    }
}
