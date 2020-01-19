// -------- 用户登陆：静默登陆 & 点击按钮登陆 --------------

type Login = (authData?: WechatBaaS.AuthData | null, options?: WechatBaaS.LoginOptions) => Promise<WechatBaaS.CurrentUser>;

const login: Login = wx.BaaS.auth.loginWithWechat;

// -------- 获取当前用户信息 ------------
function user(mode: null | undefined): Promise<WechatBaaS.CurrentUser>;
function user(mode: 'json'): Promise<Object>;
function user(mode: 'get', data: any): Promise<any>;
function user(mode: 'update', data: any): Promise<any>;
function user(mode, data: any = {}) {
  // 不传: 执行 currentUser
  if (!mode) {
    return wx.BaaS.auth.getCurrentUser();
  }
  // json: 一次性获取完整的用户信息
  else if (mode === 'json') {
    return wx.BaaS.auth.getCurrentUser().then(user => {
      return user.toJSON();
    });
  }
  // get: 获取用户的单个字段(包括内置字段和自定义字段)
  else if (mode === 'get') {
    return new Promise((resolve, reject) => {
      if (!data) {
        reject('请传入第二个参数 key')
      }
      wx.BaaS.auth.getCurrentUser().then(user => {
        resolve(user.get(data))
      }).catch(err => {
        reject(err)
      })
    })
  }
  // 更新用户自定义字段
  else if (mode === 'update') {
    return new Promise((resolve, reject) => {
      if (!data) {
        reject('请传入第二个参数 data')
      } else if (typeof data !== 'object') {
        reject('类型错误，二个参数应该是一个对象')
      }
      wx.BaaS.auth.getCurrentUser().then(user => {
        // 只支持一次性赋值，即 data 是个对象
        return user.set(data).update()
      }).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  }
}

// -------- export ------------------

export interface IUser {
  /**
   * 微信登录
   * @param authData 用户信息，值为 null 时是静默登录
   * @param options 其他选项
   */
  login: Login;
}

export default {
  login,
  user,
}
