import { Nickname } from '@project/common/platform';
import { Nickname as HlfNickname } from '@project/common/hlf/auction';
import { TransformUtil, ObjectUtil } from '@ts-core/common';
import { TypeormValidableEntity } from '@ts-core/backend';
import { ClassTransformOptions } from 'class-transformer';
import { Matches, IsNumber, IsOptional } from 'class-validator';
import { Entity, Column, UpdateDateColumn, CreateDateColumn, PrimaryGeneratedColumn } from 'typeorm';
import { RegExpUtil } from '@project/common/util';
import * as _ from 'lodash';

@Entity({ name: 'nickname' })
export class NicknameEntity extends TypeormValidableEntity implements Nickname {

    // --------------------------------------------------------------------------
    //
    //  Static Methods
    //
    // --------------------------------------------------------------------------

    public static updateEntity(item: Partial<NicknameEntity>, nickname: HlfNickname): Partial<NicknameEntity> {
        ObjectUtil.copyProperties(nickname, item);
        item.nickname = Nickname.getNicknameByUid(nickname);
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
    @Matches(RegExpUtil.NICKNAME_UID_REG_EXP)
    public uid: string;

    @Column()
    @Matches(RegExpUtil.NICKNAME_REG_EXP)
    public nickname: string;

    @Column({ name: 'owner_uid' })
    @Matches(RegExpUtil.USER_UID_REG_EXP)
    public ownerUid: string;

    @Column({ name: 'parent_uid' })
    // @Matches(RegExpUtil.NICKNAME_UID_REG_EXP)
    public parentUid: string;

    @CreateDateColumn()
    public created: Date;

    @UpdateDateColumn()
    public updated: Date;

    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    public toObject(options?: ClassTransformOptions): Nickname {
        return TransformUtil.fromClass<Nickname>(this, options);
    }
}
