import { isArray } from '../../utils/index';

const handleError = (err: any) => {
  let maybe;

  // @ts-ignore
  let { code, message: msg } = err;

  switch(code) {
    case 400:
      maybe = '1. 提交的 ACL 权限不合法 2. 提交的数据的字段类型不匹配 3. 提交的数据中没有包含必填项 4. 重复创建数据（设置了唯一索引）'
    case 403:
      maybe = '没有权限写入数据'
    case 404:
      maybe = '写入的数据表不存在'
    default:
      maybe = ''
  }

  return Promise.reject({
    msg,
    code,
    maybe
  })
}

export interface ICreate {
  /**
   * creat 新增数据项
   * @param {String} tableName 表名
   * @param {Object|Array} data 要新增的数据
   *  - 不批量
   *    data = {
   *      name: 'apple',
   *      price: 1,
   *      desc: ['good'],
   *      amount: 0
   *    }
   *  - 批量
   *    data = [
   *      { a: 2, b: 3 },
   *      { a: 99, b: 88 }
   *    ]
   * @param {Object} options 其他配置
   */
  create: (tableName: string, options: any) => Promise<any>;
}

export const create = (tableName: string, data: Record<string, any> | any[], options = {}) => {
  if (typeof data !== 'object') {
    return Promise.reject('data 必须是 object or array')
  }
  let Product = new wx.BaaS.TableObject(tableName)
  let product = Product.create()
  let call = isArray(data) ? 'createMany' : 'set'
  return product[call](data)
    .save()
    .then(res => {
      // @ts-ignore
      let { statusCode: code, data } = res
      return { code, data }
    }, err => {
      return handleError(err)
    })
}
