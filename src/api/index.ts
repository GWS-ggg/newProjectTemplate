import type { GiftResponseData, TabInfo } from '@/types'
import type { BoxData, LoginInfo, ShopListInfo } from './types'
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

// 获取tab信息
export function getTabInfoApi(params: {
  appid: string
  uid: string
  key: number
  skuid: string
  tradeproductid: number
}): Promise<
    TabInfo
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
