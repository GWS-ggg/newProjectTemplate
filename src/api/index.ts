import type { LoginData, StepGiftData, TabInfo } from '@/types'
import request from '@/utils/request'

// 获取指定礼包数据
export function getProductListApi(params: {
  appid: string
  uid: string
  producttype: number
}): Promise<
    StepGiftData
  > {
  return request({
    url: 'http://192.168.15.144:8010/localpay/official/productlist',
    method: 'post',
    params,
  })
}

// 登录
export function loginApi(params: {
  uid: string
}): Promise<
    LoginData
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
