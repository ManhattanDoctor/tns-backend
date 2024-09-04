import { Exclude, Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TerminalEntity } from './TerminalEntity';
import { CryptoKey, CryptoKeyStatus } from '@project/common/platform/crypto';
import * as _ from 'lodash';

@Entity({ name: 'terminal_crypto_key' })
export class TerminalCryptoKeyEntity implements CryptoKey {
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
    @IsEnum(CryptoKeyStatus)
    public status: CryptoKeyStatus;

    @Column()
    @IsString()
    public algorithm: string;

    @Column({ name: 'public_key' })
    @IsString()
    public publicKey: string;

    @Column({ name: 'private_key' })
    @IsString()
    public privateKey: string;

    @Exclude()
    @OneToOne(() => TerminalEntity, terminal => terminal.cryptoKey)
    @JoinColumn({ name: 'terminal_id' })
    @Type(() => TerminalEntity)
    public terminal: TerminalEntity;
}
