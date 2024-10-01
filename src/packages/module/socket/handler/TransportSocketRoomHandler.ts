import { Logger } from "@ts-core/common";
import { Injectable } from "@nestjs/common";
import { TransportSocketUserId } from "@ts-core/socket-common";
import { TransportSocketRoomHandler as CoreTransportSocketRoomHandler, ISocketUser, TransportSocket } from "@ts-core/socket-server";

@Injectable()
export class TransportSocketRoomHandler extends CoreTransportSocketRoomHandler {
    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(logger: Logger, transport: TransportSocket) {
        super(logger, transport);
    }

    // --------------------------------------------------------------------------
    //
    //  Protected Methods
    //
    // --------------------------------------------------------------------------

    protected async check(name: string, user: ISocketUser<TransportSocketUserId>): Promise<void> { }
}