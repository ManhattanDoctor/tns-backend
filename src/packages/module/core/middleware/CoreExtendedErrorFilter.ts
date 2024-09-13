import { ArgumentsHost, Catch } from '@nestjs/common';
import { ExtendedErrorFilter, IExceptionFilter } from '@ts-core/backend-nestjs';
import { ExtendedError } from '@ts-core/common';
import { ErrorCode as AclErrorCode } from '@project/common/hlf/acl';
import { ErrorCode as AuctionErrorCode } from '@project/common/hlf/auction';
import * as _ from 'lodash';

export type ErrorCode = AclErrorCode | AuctionErrorCode;

@Catch(ExtendedError)
export class CoreExtendedErrorFilter implements IExceptionFilter<ExtendedError> {
    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    public instanceOf(item: any): item is ExtendedError {
        return Object.values(AclErrorCode).includes(item.code) || Object.values(AuctionErrorCode).includes(item.code);
    }

    public catch(error: ExtendedError, host: ArgumentsHost): any {
        let status = ExtendedError.HTTP_CODE_BAD_REQUEST;
        return ExtendedErrorFilter.catch(error, host, status);
    }
}
