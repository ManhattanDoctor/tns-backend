import {
    UserRoleName,
    UserRole
} from '@project/common/platform/user';
import { Exclude } from 'class-transformer';
import { IsString, IsNumber, IsOptional } from 'class-validator';
import { CreateDateColumn, UpdateDateColumn, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import * as _ from 'lodash';
import { TypeormValidableEntity } from '@ts-core/backend';

@Entity({ name: 'user_role' })
export class UserRoleEntity extends TypeormValidableEntity implements UserRole {
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

    @Column({ type: 'varchar' })
    @IsString()
    public name: UserRoleName;

    @Column({ name: 'user_id' })
    @IsNumber()
    public userId: number;

    @Column({ name: 'company_id', nullable: true })
    @IsOptional()
    @IsNumber()
    public companyId?: number;

    @CreateDateColumn({ name: 'created_date' })
    public createdDate: Date;

    @UpdateDateColumn({ name: 'updated_date' })
    public updatedDate: Date;

    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    constructor(userId?: number, name?: UserRoleName, companyId?: number) {
        super();
        if (!_.isNil(name)) {
            this.name = name;
        }
        if (!_.isNil(userId)) {
            this.userId = userId;
        }
        if (!_.isNil(companyId)) {
            this.companyId = companyId;
        }
    }
}
