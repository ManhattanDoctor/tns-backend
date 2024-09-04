import { TransportCommand } from '@ts-core/common';

export class NotifyCommand extends TransportCommand<INotifyDto> {
    // --------------------------------------------------------------------------
    //
    //  Static Properties
    //
    // --------------------------------------------------------------------------

    public static readonly NAME = 'NotifyCommand';

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(request: INotifyDto) {
        super(NotifyCommand.NAME, request);
    }
}

export interface INotifyDto {
    userId: number;
    message: string;

    url?: string;
}

