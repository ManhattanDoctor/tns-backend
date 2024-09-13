import { Coin } from '@hlf-core/common';
import { CoinBalance as HlfCoinBalance } from '../hlf/auction';

export class CoinBalance extends HlfCoinBalance {
    id: number;
    uid: string;
    coin: Coin;
}