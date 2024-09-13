import { ITraceable, IPaginable, IPagination } from '@ts-core/common';
import { Coin } from "../../Coin";

export interface ICoinListDto extends IPaginable<Coin>, ITraceable {}

export interface ICoinListDtoResponse extends IPagination<Coin> { }
