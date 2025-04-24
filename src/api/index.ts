import type { GiftResponseData, OrderStatusReq, OrderStatusRes, PayOrderReq, PayOrderRes } from '@/types'
import type { BoxData, BuyOrderInfoRequest, LoginInfo, ShopListInfo } from './types'
import request from '@/utils/request'

// 获取指定礼包数据
export function getProductListApi(params: {
  appid: string
  uid: string
  producttype: number
}): Promise<
    GiftResponseData
  > {
  return request({
    url: '/localpay/official/productlist',
    method: 'post',
    params,
  })
}

// 登录
export function loginApi(params: {
  uid: string
}): Promise<
    LoginInfo
  > {
  return request({
    url: '/localpay/official/login',
    method: 'post',
    params,
  })
}
// 下单
export function buyOrderApi(params: BuyOrderInfoRequest): Promise<
  any
> {
  return request({
    url: '/localpay/official/order',
    method: 'post',
    params,
  })
}

// 获取礼包列表
export function getShopListInfoApi(params: {
  uid: string
}): Promise<
    ShopListInfo
  > {
  return request({
    url: '/localpay/official/shoplist',
    method: 'post',
    params,
  })
}
// 获取宝箱数据
export function getBoxDataApi(params: {
  uid: string
  boxid: number
}): Promise<
    BoxData
  > {
  return request({
    url: '/localpay/official/boxpreview',
    method: 'post',
    params,
  })
}
// 支付
export function payOrderApi(params: PayOrderReq): Promise<PayOrderRes> {
  return request({
    url: '/wxpay/pay/order',
    method: 'post',
    params,
  })
}

// 轮询 查询订单状态接口
export function payOrderStasuApi(params: OrderStatusReq): Promise<OrderStatusRes> {
  return request({
    url: '/wxpay/site/qr_status',
    method: 'get',
    params,
  })
}
