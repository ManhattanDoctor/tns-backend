import { Controller, Get } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { INIT_URL, IInitDtoResponse, IHlfDetails } from '@project/common/platform/api';
import { DefaultController } from '@ts-core/backend';
import { Logger } from '@ts-core/common';
import { AppSettings } from '../AppSettings';
import * as _ from 'lodash';

// --------------------------------------------------------------------------
//
//  Dto
//
// --------------------------------------------------------------------------

export class InitDtoResponse implements IInitDtoResponse {
    @ApiProperty()
    public hlf: IHlfDetails;
}

// --------------------------------------------------------------------------
//
//  Controller
//
// --------------------------------------------------------------------------

@Controller(INIT_URL)
export class InitController extends DefaultController<void, IInitDtoResponse> {
    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(logger: Logger, private settings: AppSettings) {
        super(logger);
    }

    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    @Get()
    public async execute(): Promise<InitDtoResponse> {
        return { hlf: this.settings.hlf }
    }
}
