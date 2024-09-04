import { Injectable } from '@nestjs/common';
import { Logger, LoggerWrapper } from '@ts-core/common';
import * as _ from 'lodash';
import { DatabaseService } from '@project/module/database/service';
import { Transport } from '@ts-core/common';

@Injectable()
export class CoinService extends LoggerWrapper {
    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(logger: Logger, private transport: Transport, private database: DatabaseService) {
        super(logger);
    }
}