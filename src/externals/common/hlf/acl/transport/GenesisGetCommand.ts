
import { TransformUtil } from '@ts-core/common';
import { HlfTransportCommandAsync } from '@hlf-core/common';
import { Matches, IsDate } from 'class-validator';
import { Type } from 'class-transformer';
import { IGenesis } from '../IGenesis';
import { CommandName } from './Command';
import { RegExpUtil } from '../../../util';

export class GenesisGetCommand extends HlfTransportCommandAsync<void, IGenesis> {
    // --------------------------------------------------------------------------
    //
    //  Static Properties
    //
    // --------------------------------------------------------------------------

    public static readonly NAME = CommandName.GENESIS_GET;

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor() {
        super(GenesisGetCommand.NAME, null, null, true);
    }

    // --------------------------------------------------------------------------
    //
    //  Protected Methods
    //
    // --------------------------------------------------------------------------

    protected checkResponse(item: IGenesis): IGenesis {
        return TransformUtil.toClass(Genesis, item);
    }
}

export class Genesis implements IGenesis {
    @Matches(RegExpUtil.USER_UID_REG_EXP)
    rootUserUid: string;

    @Type(() => Date)
    @IsDate()
    created: Date;
}
