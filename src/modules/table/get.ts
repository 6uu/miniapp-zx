import { isArray } from '../../utils/index'

export interface IGetOptions {
  select?: string | string[];
  expand?: string | string[];
  returnCode?: boolean;
}

export interface IGet {
  /**
   * 获取数据项
   * @param {String} tableName 表名
   * @param {String} recordID 记录 ID
   * @param {Object} options 使用 select 来控制请求返回的字段
   */
  get: (tableName: string, recordId: string, options?: IGetOptions) => Promise<{
    code: any;
    data: any;
  }>;
}

const matchFunction = (Product: WechatBaaS.TableObject, options: IGetOptions) => {
  const { select, expand } = options || {};
  const isExpand = typeof expand === 'string' || isArray(expand)
  const isSelect = typeof select === 'string' || isArray(select)
  let result = Product
  if (isExpand) {
    result = result.expand(expand as string | string[])
  }
  if (isSelect) {
    result = result.select(select as string | string[])
  }
  return result
}

export const get: IGet['get'] = (tableName, recordId, options) => {
  if (typeof options !== 'object' || isArray(options)) {
    return Promise.reject('options 必须为 object')
  }

  const Product = new wx.BaaS.TableObject(tableName);

  return matchFunction(Product, options)
    .get(recordId)
    .then(res => {
      let { statusCode: code, data } = res
      return options.returnCode ? { code, data } : data
    }, err => {
      let { code, message } = err;
      return Promise.reject({ code, msg: message })
    })
}
