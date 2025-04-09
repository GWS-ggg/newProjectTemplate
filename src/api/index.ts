import type { GiftResponseData, TabInfo } from '@/types'
import type { LoginInfo } from './types'
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
