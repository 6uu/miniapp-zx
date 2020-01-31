// @ts-ignore
require('minapp-sdk');

import modules, { IModules } from './modules/index';
interface Wx {
  /**
  * 知晓云 SDK 命名空间
  */
  BaaS: typeof WechatBaaS;
}
interface ZX extends IModules, Wx {
  /** 初始化 */
  init: (clientID: string) => void
}

let zx = {} as ZX;

Object.assign(zx, modules);

interface IInitOptions extends WechatBaaS.InitOptions {
  tables: Record<string, string>
}

zx.init = (clientID: string, options?: IInitOptions): void => {
  // @ts-ignore
  console.log('minizpp-zx start init ...')
  wx.BaaS.init(clientID, options);
}

zx.BaaS = wx.BaaS;

export default zx;
