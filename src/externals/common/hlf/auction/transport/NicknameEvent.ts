import { TransportEvent } from '@ts-core/common';

export interface INicknameEventDto {
    nicknameUid: string;
}

export class NicknameEvent<T extends INicknameEventDto = INicknameEventDto> extends TransportEvent<T> {
    constructor(name: string, data: T) {
        super(name, data);
    }
}