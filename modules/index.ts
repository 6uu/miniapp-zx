import base, { IBase } from './base';
import user, { IUser } from './user';
import table, { ITable } from './table/index';

export default {
  base,
  user,
  table,
}

export interface IModules extends IUser, IBase, ITable {}
