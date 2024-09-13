import { ITraceable } from "@ts-core/common";
import { IHlfObjectDetails } from "../IHlfObjectDetails";

export interface IHlfObjectDetailsGetDto extends ITraceable {
    uid: string;
}

export declare type IHlfObjectDetailsGetDtoResponse = IHlfObjectDetails;
