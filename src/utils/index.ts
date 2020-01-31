export const isArray = value => {
  if (typeof Array.isArray === 'function') {
    return Array.isArray(value)
  } else{
    return Object.prototype.toString.call(value) === '[object Array]'
  }
}

export const matchProduct = (tableName: string | 'user') => {
  if (tableName === 'user') {
    return new wx.BaaS.User()
  } else {
    return new wx.BaaS.TableObject(tableName)
  }
}
