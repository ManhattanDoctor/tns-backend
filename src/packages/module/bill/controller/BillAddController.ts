import { Body, Controller, Post, Headers, UseGuards } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DefaultController } from '@ts-core/backend';
import { Logger, Transport } from '@ts-core/common';
import { IsNumberString, Matches, IsOptional, IsString } from 'class-validator';
import * as _ from 'lodash';
import { Swagger } from '@project/module/swagger';
import { UserGuard, UserGuardOptions } from '@project/module/guard';
import { UserEntity } from '@project/module/database/user';
import { IBillAddDto, IBillAddDtoResponse } from '@project/common/platform/api/bill';
import { BILL_URL } from '@project/common/platform/api';
import { RegExpUtil } from '@project/common/util';
import { HeaderUndefinedError, SignatureInvalidError, TerminalNotFoundError, UserIsNotSubscribedOnTerminalError, UserNotFoundError } from '@project/module/core/middleware';
import { LedgerService } from '@project/module/ledger/service';
import { LedgerTerminal } from '@project/common/ledger/terminal';
import { DatabaseService } from '@project/module/database/service';
import { CryptoUtil } from '@project/common/platform/util';
import { TerminalKeyCommand } from '@project/module/terminal/transport';

// --------------------------------------------------------------------------
//
//  Dto
//
// --------------------------------------------------------------------------

export class BillAddDto implements IBillAddDto {
    @ApiProperty()
    @IsString()
    uid: string;

    @ApiProperty()
    @IsNumberString()
    amount: string;

    @ApiProperty()
    @Matches(LedgerTerminal.UID_REG_EXP)
    terminalUid: string;

    @ApiProperty()
    @Matches(RegExpUtil.DESCRIPTION_REG_EXP)
    description: string;
}

@Controller(`${BILL_URL}`)
export class BillAddController extends DefaultController<IBillAddDto, IBillAddDtoResponse> {
    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(logger: Logger, private transport: Transport, private database: DatabaseService, private ledger: LedgerService) {
        super(logger);
    }

    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    @Swagger({ name: 'Bill add', response: null })
    @Post()
    @UseGuards(UserGuard)
    @UserGuardOptions({ required: false })
    public async executeExtended(@Body() params: BillAddDto, @Headers('signature') signature: string): Promise<IBillAddDtoResponse> {
        if (_.isEmpty(signature)) {
            throw new HeaderUndefinedError(`Unable to find "signature" header`);
        }
        let user = await this.database.userGetByUid(params.uid);
        if (_.isNil(user)) {
            throw new UserNotFoundError();
        }
        let { publicKey } = await this.transport.sendListen(new TerminalKeyCommand(params.terminalUid));
        if (!CryptoUtil.verify(params, signature, publicKey)) {
            throw new SignatureInvalidError();
        }
        let terminal = await this.database.terminalGet(params.terminalUid); 
        if(await this.database.userIsNotSubscribed(user.id, terminal.id)) {
            throw new  UserIsNotSubscribedOnTerminalError();
        }
        return this.ledger.billAdd(params.terminalUid, user.ledgerUid, params.amount, params.description);
    }
}
