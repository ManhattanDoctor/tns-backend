
import { TransformUtil } from '@ts-core/common';
import { HlfTransportCommandAsync } from '@hlf-core/common';
import { Matches, IsDate } from 'class-validator';
import { Type } from 'class-transformer';
import { IGenesis } from '../IGenesis';
import { CommandName } from './Command';

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
    @Type(() => Date)
    @IsDate()
    created: Date;
}
