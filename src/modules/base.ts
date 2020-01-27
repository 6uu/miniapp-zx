// -------- 网络请求 -----------------

type Request = (params: WechatBaaS.RequestParams) => Promise<WechatBaaS.Response<any>>;

const request: Request = wx.BaaS.request;

// -------- 获取二维码 ---------------
type GetQrCode = (type: string, params: object, cdn?: boolean, categoryName?: string) => Promise<WechatBaaS.Response<any>>

const getQrCode = wx.BaaS.getWXACode;

// -------- export ------------------

export interface IBase {
  /**
   * 网络请求
   * @param params 参数
   */
  request: Request;
  /**
   * 获取二维码
   * @param type 类型
   * @param params 参数
   * @param cdn 是否上传二维码到文件存储并返回图片链接，默认为 false
   * @param categoryName 指定上传文件分类名，cdn 为 true 时有效，不指定该参数或分类名不存在，则默认上传到根目录
   */
  getQrCode: GetQrCode;
}

export default {
  request,
  getQrCode,
}
