import { Coin as HlfCoin } from '@hlf-core/common';

export class Coin extends HlfCoin {
    id: number;
}

export function getCoinRoom(id: number): string {
    return `coin${id}`;
}

export function getCoinBalanceRoom(objectUid: string): string {
    return `coinBalance/${objectUid}`;
}
