import { ICreate, create } from './create';
import { ISearch, find, findCount, newQuery, Query } from './search';
import { IGet, get } from './get';
import { IEdit, update } from './edit';

export interface ITable extends ICreate, ISearch, IGet, IEdit {}

export default {
  create,
  find,
  findCount,
  newQuery,
  Query,
  get,
  update,
}
