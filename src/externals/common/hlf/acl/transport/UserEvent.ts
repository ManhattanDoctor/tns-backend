import { TransportEvent } from '@ts-core/common';

export interface IUserEventDto {
    userUid: string;
}

export class UserEvent<T extends IUserEventDto= IUserEventDto> extends TransportEvent<T> {
    constructor(name: string, data: T) {
        super(name, data);
    }
}