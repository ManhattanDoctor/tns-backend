import { WebSocketGateway } from '@nestjs/websockets';
import { Logger } from '@ts-core/common';
import { TransportSocketServer as CoreTransportSocketServer } from '@ts-core/socket-server';
import { TransportSocketUserId } from '@ts-core/socket-common';
import { SOCKET_NAMESPACE } from '@project/common/platform/api';
import { Socket } from 'socket.io';
import * as _ from 'lodash';

@WebSocketGateway({ namespace: SOCKET_NAMESPACE, cors: true })
export class TransportSocketServer extends CoreTransportSocketServer {

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(logger: Logger) {
        super(logger);
    }

    // --------------------------------------------------------------------------
    //
    //  Protected Methods
    //
    // --------------------------------------------------------------------------

    protected async getClientUserId(client: Socket): Promise<TransportSocketUserId> {
        return client.id;
    }
}