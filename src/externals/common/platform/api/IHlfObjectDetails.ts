import { Sha512 } from "@ts-core/common";
import { HlfObjectType } from "../../hlf";

export interface IHlfObjectDetails {
    id: number;
    type: HlfObjectType;
    name: string;
    picture: string;
    description?: string;
}

export function hlfObjectPicture(uid: string): string {
    return `https://www.gravatar.com/avatar/${Sha512.hex(uid)}?s=200&d=identicon&r=g`;
}