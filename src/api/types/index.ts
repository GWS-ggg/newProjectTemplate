import type { BoxInfo, BoxProps } from '@/types'

export interface LoginInfo {
  username: string
  viplevel: number
  vipscore: number
  viptargetscore: number
}

export interface ShopListInfo {
  TabInfo: ShopListItem[]
}

export interface ShopListItem {
  id: number
  BannerPic?: string
  Expire: number
  ProductType: number
  Tag?: number
}
export interface BoxData {
  Props: BoxProps[]
  BoxInfo: BoxInfo
}

export interface BuyOrderInfoRequest {
  appid: string
  uid: string
  key: number
  skuid?: string
  tradeproductid: number
  exchangeid?: number
}

export interface FreeGiftAwardRequest {
  appid: string
  uid: string
  packagekey: number
  tradeproductid: number
  exchangeid?: number
}
