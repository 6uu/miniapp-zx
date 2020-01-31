import { isArray, matchProduct } from '../../utils/index';

export interface IFindOptions {
  /** 指定查询条件，fn 中可直接改变参数中默认使用的 query(不需要组合查询的简单查询)，也可返回一个新的 Query 实例(往往用于组合查询) */
  fn?: (query?: WechatBaaS.Query) => void |  WechatBaaS.Query;
  /** 指定最多返回数量 */
  limit?: number;
  /** 设置列表偏移量 */
  offset?: number;
  /** 设置排序依据 */
  orderBy?: string[] | string;
  /** 指定需要展开的 pointer 类型字段 */
  expand?: string[] | string;
  /** 选择只返回指定字段 */
  select?: string[] | string;
  /** 是否返回 code */
  returnCode?: boolean;
}

export interface ISearch {
  /**
   * 查询
   * @param {String} tableName 表名
   * @param {IFindOptions} options 配置项
   *  - 不传, 或传空对象, 则直接进行 find
   *  - 根据条件查询
   *    1. 使用默认 query（常用于简单查询）
   *      fn: query => {
   *        query.compare('amount', '>=', 1);
   *        query.compare('amount', '<', 10);
   *      }
   *    2. 自定义新的 query（常用于组合查询）
   *      fn: () => {
   *        const q1 = zx.newQuery();
   *        const q2 = zx.newQuery();
   *        q1.compare('price', '>', 10)
   *        q2.isNull('name')
   *        const orQuery = zx.Query.or(query, query1)
   *        return orQuery
   *      }
   *  - limit, offset 分页
   *  - orderBy 排序
   *    1. 普通 '-created_at' or ['-created_at']
   *    2. 多重 ['-created_at', 'created_by']
   *  - expend 扩展, 返回中扩展该字段所对应关联表中的行信息
   *    1. 'created_by'
   *    2. ['created_by', 'pointer_value']
   *  - select 选择只返回指定字段
   *    1. 'name'
   *    2. ['name', 'age']
   *  - returnCode
   *    1. true：请求结果为 { data, code }
   *    2. false：请求结果为 data
   * @return {Promise}
   *  - res: { code, data } | data
   *  - err: { msg, code, maybe }, 其中, maybe 为发生错误的可能原因
   */
  find: (tableName: string, options?: IFindOptions) => Promise<any | {
    code: any;
    data: any;
  }>;

  /**
   * 查询数据总数
   * @param {String} tableName 表名
   * @param {Object} options 同 find
   * @return {Promise} num 总数
   */
  findCount: (tableName: string, options?: IFindOptions) => Promise<number>;

  /**
   * 获得一个新的 Query 实例
   */
  newQuery: () => WechatBaaS.Query;

  /**
   *  等同于 WechatBaaS.Query
   */
  Query: typeof WechatBaaS.Query;
}

const handleError = err => {
  let maybe
  // @ts-ignore
  let { code, message: msg } = err
  switch(code) {
    case 400:
      maybe = '1. 指定/过滤输出字段的字段名有误、2. GEO 查询参数有误、3. 查询语法错误'
    case 404:
      maybe = '数据表不存在'
    default:
      maybe = ''
  }
  return Promise.reject({
    msg,
    code,
    maybe
  })
}

const matchFunction = (Product: any, options?: IFindOptions) => {
  let { fn, limit, offset, orderBy, expand, select } = options || {}
  let isExpand = typeof expand === 'string' || isArray(expand)
  let isSelect = typeof select === 'string' || isArray(select)
  let isQuery = typeof fn === 'function'
  let isPageable = typeof limit === 'number' && typeof offset === 'number'
  let isOrder = typeof orderBy === 'string' || isArray(orderBy)
  let result = Product
  if (isQuery) {
    let defaultQuery = new wx.BaaS.Query()
    let query = (fn && fn(defaultQuery)) || defaultQuery
    result = result.setQuery(query)
  }
  if (isSelect) {
    result = result.select(select)
  }
  if (isExpand) {
    result = result.expand(expand)
  }
  if (isPageable) {
    result = result.limit(limit).offset(offset)
  }
  if (isOrder) {
    result = result.orderBy(orderBy)
  }
  return result
}

export const find: ISearch['find'] = (tableName: string | 'user', options?: IFindOptions) => {
  if (typeof options !== 'object' || isArray(options)) {
    return Promise.reject('options 必须为 object')
  }
  let Product = matchProduct(tableName)

  return matchFunction(Product, options)
    .find()
    .then(res => {
      let { statusCode: code, data } = res
      return options.returnCode ? { code, data } : data
    }, err => {
      return handleError(err)
    })
}

export const findCount: ISearch['findCount'] = (tableName: string | 'user', options?: IFindOptions) => {
  if (typeof options !== 'object' || isArray(options)) {
    return Promise.reject('options 必须为 object')
  }
  let Product = matchProduct(tableName)

  return matchFunction(Product, options)
    .count()
    .then((num: number) => {
      return num
    }, err => {
      return handleError(err)
    })
}

export const newQuery: ISearch['newQuery'] = () => {
  return new wx.BaaS.Query()
}

export const Query: ISearch['Query'] = wx.BaaS.Query
