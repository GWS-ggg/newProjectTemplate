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
  ExchangeID?: number
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
  ExchangeID?: number
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
  ExchangeID?: number
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
  ExchangeID?: number
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
  ExchangeID?: number
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
  ExchangeID?: number
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
  ExchangeID?: number
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
  ExchangeID?: number
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
  ExchangeID?: number
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
  ExchangeID?: number
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
export interface OrderPopupInfo {
  price: number
  key: number
  tradeProductId: number
  skuId?: string
  exchangeId?: number
}

export interface ReqBaseParams {
  appid: string
  version: string
  fn_uid: string
  fn_deviceid: string
  zoneid: number
  roleid: string
  is_gs: number
  token: string
  os: string
  game_platform?: 'app' | 'h5'
  ts: number
}
export interface PayInfo extends Record<string, string | number | undefined> {
  price: string
  params: string
  desc: string
  pid: string
  title: string
  game_appid: string
  game_openid: string
  content_type: string
  trade_type?: string
  method?: string
  zone_id: number
  role_id: string
}
export type PayOrderReq = PayInfo & ReqBaseParams
export interface PayOrderRes {
  fntype14: string
  orderid: string
  paymethod: string
}

export interface OrderStatusReq {
  order_id: string
}
export interface OrderStatusRes {
  status: number
  transaction_id: string
  err_msg: string // 错误信息，需要展示
}

export interface Pop {
  visible?: boolean
  type: string // 'success' | 'error' | 'failed'
  content: string
  closeable?: boolean
  textAlign?: string
  defaultBtn?: {
    text: string
    onClick: () => void
  }
  primaryBtn?: {
    text: string
    onClick: () => void
  }
}

export interface PayTypeRes {
  appid: string
  payChannels: PayType[]
  payPalClientId: string
}

export interface PayType {
  payType: number
  name: string
  extra: number
  level: number
  icon: string
}
