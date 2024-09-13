
import * as _ from 'lodash';

export const Variables = {
    root: {
        uid: 'user/0x1fc1e02161515812ddfe05b32bb0accc2d5d739e',
        address: '0x1fc1e02161515812ddfe05b32bb0accc2d5d739e'
    },
    team: {
        uid: 'user/0xffffffffffffffffffffffffffffffffffffffff',
        address: '0xffffffffffffffffffffffffffffffffffffffff',
    },
    platform: {
        uid: 'user/0x0000000000000000000000000000000000000000',
        address: '0x0000000000000000000000000000000000000000',
        nickname: 'tns_foundation',
        nicknameUid: 'nickname/tns_foundation'
    },
    transaction: {
        hash: _.padStart('0', 64, '0')
    }
}