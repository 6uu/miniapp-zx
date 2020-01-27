///<reference path="./node_modules/minapp-sdk-typings/types/baas.d.ts" />

// @ts-ignore
require('miniapp-sdk');

import modules, { IModules } from './modules/index';

interface ZX extends IModules {
  /** 初始化 */
  init: (clientID: string) => void,
}

let zx = {} as ZX;

Object.assign(zx, modules);

interface IInitOptions extends WechatBaaS.InitOptions {
  tables: Record<string, string>
}

zx.init = (clientID: string, options?: IInitOptions): void => {
  console.log('minizpp-zx start init ...')
  wx.BaaS.init(clientID, options);
}

export default zx;
