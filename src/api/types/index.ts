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

}
