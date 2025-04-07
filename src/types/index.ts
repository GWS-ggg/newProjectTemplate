export interface GiftResponseData {
  ProductInfo?: ProductInfo
  ItemInfo?: ItemInfo[]
}

export interface ProductInfo {
  Title: string
  Content: string
  Pic: string
  Key: number
  Price: number
  Discount: number
  SkuID: string
  TradeProductID: number
  Props: Array<{
    PropID?: number
    PropType?: number
    DeltaCount?: number
    Icon?: string
    Text?: string
    Scale?: number
    VipScore?: number
  }>
  ExpireTime: number
  AddProps?: Array<{
    VipScore?: number
  }>
}

export interface ItemInfo {
  id?: number
  Content?: string
  Key?: number
  Pic?: string
  SkuID?: string
  TradeProductID?: number
  Props?: Array<{
    PropID?: number
    PropType?: number
    DeltaCount?: number
    Icon?: string
    Text?: string
    Scale?: number
    VipScore?: number
  }>
  AddProps?: Array<{
    VipScore?: number
  }>
  TaskTargetScore?: number
}

export interface LoginData {
  username: string
  viplevel: number
  vipscore: number
  viptargetscore: number
}

export interface TabInfo {
  TabInfo: Array<{
    BannerPic: string
    Expire: number
    ProductType: number
  }>
}

// battlePass
export interface BattlePassItemInfo {
  Key: number
  Price: number
  SkuID: string
  TradeProductID: number
  Props: Array<{
    VipScore: number
  }>
  ExpireTime: number
  AddProps: Array<{
    VipScore: number
  }>
}
