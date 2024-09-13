import { MathUtil } from '@ts-core/common';
import { IsNumberString } from 'class-validator';
import * as _ from 'lodash';

export class CoinBalance {
    // --------------------------------------------------------------------------
    //
    //  Properties
    //
    // --------------------------------------------------------------------------

    @IsNumberString()
    public held: string;

    @IsNumberString()
    public inUse: string;

    @IsNumberString()
    public total: string;

    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    public isEmpty(): boolean {
        return _.isNil(this.total) || MathUtil.equals(this.total, '0');
    }
}
