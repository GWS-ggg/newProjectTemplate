export interface GiftResponseData {
  ProductInfo?: ProductInfo
  ItemInfo?: ItemInfo[]
}

export interface ProductInfo {
  Title: string
  Content: string
  Pic: string[]
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
  TaskTargetScore?: number
  TaskScore?: number
}

export interface ItemInfo {
  id?: number
  Content?: string
  Key?: number
  Pic?: string
  SkuID?: string
  TradeProductID?: number
  BuyTimes?: number
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
  TaskScore?: number
  TaskTargetScore?: number
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
  BuyTimes?: number
  Props: Array<{
    VipScore: number
  }>
  ExpireTime: number
  AddProps: Array<{
    VipScore: number
  }>
}

// 轮盘礼包
export interface WheelGiftItemInfo {
  id?: number
  Key: number
  Price: number
  SkuID: string
  TradeProductID: number
  Limit: number
  BuyTimes: number
  Props?: Array<{
    PropID: number
    PropType: number
    DeltaCount: number
    Icon: string
    Text?: string
    Scale?: number
  }>
  ExpireTime: number
}

export interface onePlusTwoGiftItemInfo {
  id: number
  Title: string
  Key: number
  TradeProductID: number
  SkuID?: string
  Limit: number
  Price?: number
  BuyTimes?: number
  sortId?: number
  Props: Array<{
    PropID: number
    PropType: number
    DeltaCount: number
    Icon: string
    Text?: string
    Scale?: number
  }>
  ExpireTime: number
}

export interface ThreeChoiceOneGiftItemInfo {
  id: number
  Key: number
  TradeProductID: number
  SkuID?: string
  Limit: number
  Price?: number
  BuyTimes?: number
  Props: Array<Prop>
}

export interface Prop {
  PropID: number
  PropType: number
  DeltaCount: number
  Icon: string
  Text?: string
  Scale?: number
}

export interface DailyLoginItemInfo {
  Key: number
  Price: number
  SkuID: string
  TradeProductID: number
  Limit: number
  BuyTimes?: number
  Props: Array<Prop>
  Addition: number
}

export interface SixSegmentItemInfo {
  id: number
  sortId?: number
  Key: number
  Price: number
  SkuID: string
  TradeProductID: number
  Limit: number
  BuyTimes?: number
  Props: Array<Prop>

}

export interface ThreeSegmentNItemInfo {
  id: number
  sortId?: number
  Key: number
  Price: number
  SkuID: string
  TradeProductID: number
  Limit: number
  BuyTimes?: number
  Props: Array<Prop>
}

export interface ThreeSegmentItemInfo {
  id: number
  sortId?: number
  Key: number
  Price: number
  SkuID: string
  TradeProductID: number
  Limit: number
  BuyTimes?: number
  Props: Array<Prop>
}

export interface BoxProps {
  PropID: number
  PropType: number
  DeltaCount: number
  Icon: string
  Text: string
  Scale: number
  PreviewMinCount?: number
  PreviewMaxCount?: number
  MaxRollCount?: number
  BoxMiniCount?: number
  BoxCurOpenCount?: number
}

export interface BoxInfo {
  BoxType: number
  Pic: string[]
}
