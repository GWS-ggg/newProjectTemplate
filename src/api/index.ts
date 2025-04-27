import type { GiftResponseData, OrderStatusReq, OrderStatusRes, PayOrderReq, PayOrderRes } from '@/types'
import type { BoxData, BuyOrderInfoRequest, FreeGiftAwardRequest, LoginInfo, ShopListInfo } from './types'
import request from '@/utils/request'

// 获取指定礼包数据
export function getProductListApi(data: {
  appid: string
  uid: string
  producttype: number
}): Promise<
    GiftResponseData
  > {
  return request({
    url: '/localpay/official/productlist',
    method: 'post',
    data,
  })
}

// 登录
export function loginApi(data: {
  uid: string
}): Promise<
    LoginInfo
  > {
  return request({
    url: '/localpay/official/login',
    method: 'post',
    data,
  })
}
// 下单
export function buyOrderApi(data: BuyOrderInfoRequest): Promise<
  {
    param: string
  }
> {
  return request({
    url: '/localpay/official/order',
    method: 'post',
    data,
  })
}

// 免费礼包发奖
export function freeGiftAwardApi(data: FreeGiftAwardRequest): Promise<
  any
> {
  return request({
    url: '/localpay/official/exchange',
    method: 'post',
    data,
  })
}
// 获取礼包列表
export function getShopListInfoApi(data: {
  uid: string
}): Promise<
    ShopListInfo
  > {
  return request({
    url: '/localpay/official/shoplist',
    method: 'post',
    data,
  })
}
// 获取宝箱数据
export function getBoxDataApi(data: {
  uid: string
  boxid: number
}): Promise<
    BoxData
  > {
  return request({
    url: '/localpay/official/boxpreview',
    method: 'post',
    data,
  })
}

// 支付
export function payOrderApi(data: PayOrderReq): Promise<PayOrderRes> {
  return request({
    url: '/wxpay/pay/order',
    method: 'post',
    data,
    apiType: 'pay',
  })
}

// 轮询 查询订单状态接口
export function payOrderStasuApi(data: OrderStatusReq): Promise<OrderStatusRes> {
  return request({
    url: '/wxpay/site/qr_status',
    method: 'post',
    data,
    apiType: 'pay',
  })
}

// paypal回调通知服务器
export function paypalSettleApi(data: {
  orderid: string
  fntype14: string
  status: 0 | 1 | 3
}): Promise<void> {
  return request({
    url: '/wxpay/paypal/settle',
    method: 'post',
    data,
    apiType: 'pay',
  })
}
