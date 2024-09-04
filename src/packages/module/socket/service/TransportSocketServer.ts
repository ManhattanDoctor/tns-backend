import { WebSocketGateway } from '@nestjs/websockets';
import { Logger } from '@ts-core/common';
import * as _ from 'lodash';
import { Socket } from 'socket.io';
import { SOCKET_NAMESPACE } from '@project/common/platform/api/transport'
import { TransportSocketServer as CoreTransportSocketServer } from '@ts-core/socket-server';
import { TransportSocketUserId } from '@ts-core/socket-common';
import { LoginService } from '@project/module/login/service';
import { RequestInvalidError } from '@project/module/core/middleware';

@WebSocketGateway({ namespace: SOCKET_NAMESPACE, cors: true })
export class TransportSocketServer extends CoreTransportSocketServer {

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(logger: Logger, private login: LoginService) {
        super(logger);
    }

    // --------------------------------------------------------------------------
    //
    //  Protected Methods
    //
    // --------------------------------------------------------------------------

    protected async getClientUserId(client: Socket): Promise<TransportSocketUserId> {
        let auth = client.handshake.auth;
        if (_.isNil(auth) || _.isNil(auth.token)) {
            throw new RequestInvalidError({ name: 'auth.token', value: auth.token, expected: 'not nil' });
        }
        let { id } = await this.login.verifyToken(auth.token);
        return id;
    }
}