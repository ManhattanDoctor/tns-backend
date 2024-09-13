import { ITraceable, IPaginable, IPagination } from '@ts-core/common';
import { Action } from '../../Action';

export interface IActionListDto extends IPaginable<Action>, ITraceable { }

export interface IActionListDtoResponse extends IPagination<Action> { }
