import { TransformUtil, TraceUtil, ILogger, TransportHttp, ITransportHttpSettings, DateUtil } from '@ts-core/common';
import { IActionListDto, IActionListDtoResponse, } from './action';
import { Action } from '../Action';
import { IHlfObjectDetailsGetDto, IHlfObjectDetailsGetDtoResponse } from './hlf';
import * as _ from 'lodash';

export class Client extends TransportHttp<ITransportHttpSettings> {
    // --------------------------------------------------------------------------
    //
    //  Static Methods
    //
    // --------------------------------------------------------------------------

    public static totp(): Promise<string> {
        let window = 5 * DateUtil.MILLISECONDS_MINUTE;
        return Promise.resolve(`Login data is "${Math.floor(Date.now() / window)}"`);
    }

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(logger: ILogger, url?: string) {
        super(logger, { method: 'get', baseURL: url, isHandleError: true, isHandleLoading: true, headers: {} });
    }

    // --------------------------------------------------------------------------
    //
    //  Auth Methods
    //
    // --------------------------------------------------------------------------

    public async logout(traceId?: string): Promise<void> {
        // return this.call<void, ITraceable>(LOGOUT_URL, { data: TraceUtil.addIfNeed({ traceId }), method: 'post' });
    }

    //--------------------------------------------------------------------------
    //
    // 	Action Methods
    //
    //--------------------------------------------------------------------------

    public async actionList(data?: IActionListDto): Promise<IActionListDtoResponse> {
        let item = await this.call<IActionListDtoResponse, IActionListDto>(ACTION_URL, { data: TraceUtil.addIfNeed(data) });
        item.items = TransformUtil.toClassMany(Action, item.items);
        return item;
    }

    //--------------------------------------------------------------------------
    //
    // 	Hlf Methods
    //
    //--------------------------------------------------------------------------

    public async hlfObjectDetailsGet(uid: string): Promise<IHlfObjectDetailsGetDtoResponse> {
        return this.call<IHlfObjectDetailsGetDtoResponse, IHlfObjectDetailsGetDto>(`${HLF_OBJECT_DETAILS_URL}`, { data: TraceUtil.addIfNeed({ uid }) });
    }
}

const PREFIX = 'api/';

export const USER_URL = PREFIX + 'user';

export const COIN_URL = PREFIX + 'coin';
export const COIN_BALANCE_URL = PREFIX + 'coinBalance';

export const INIT_URL = PREFIX + 'init';
export const LOGIN_URL = PREFIX + 'login';
export const LOGOUT_URL = PREFIX + 'logout';

export const ACTION_URL = PREFIX + 'action';
export const HLF_OBJECT_DETAILS_URL = PREFIX + 'hlfObjectDetails';
