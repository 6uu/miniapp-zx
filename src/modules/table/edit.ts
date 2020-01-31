export interface IEdit {
  /**
   * 更新数据项
   * @param {String} tableName 表名
   * @param {String} recordID 数据行 ID
   * @param {Object|Array} data 更新的数据
   *  - 普通更新
   *    data = {
   *      name: 'apple',
   *      price: 1,
   *      desc: ['good'],
   *      amount: 0
   *    }
   */
  update: (tableName: string, recordID: string, data: any | any[]) => Promise<any>;
}

const handleError = err => {
  let maybe: string
  // @ts-ignore
  let { code, message: msg } = err
  switch(code) {
    case 400:
      maybe = '1. 提交的数据不合法、2. 重复创建数据（设置了唯一索引）'
    case 403:
      maybe = '没有权限更新数据'
    case 404:
      maybe = '数据行不存在'
    default:
      maybe = ''
  }
  return Promise.reject({
    msg,
    code,
    maybe
  })
}

export const update: IEdit['update'] = (tableName, recordID, data) => {
  if (typeof data !== 'object') {
    return Promise.reject('data must be an Object or Array')
  }

  const product = new wx.BaaS.TableObject(tableName).getWithoutData(recordID);

  product.set(data)
  return product.update(data)
    .then(res => {
      let { statusCode: code, data } = res
      return { code, data }
    }, err => {
      return handleError(err)
    })
}
