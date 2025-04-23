import type { BuyOrderInfoRequest } from '@/api/types'
import { buyOrderApi } from '@/api/index'

export function useBuyOrder() {
  async function handleBuyOrder(key: number, tradeproductId: number, skuId?: string, exchangeId?: number) {
    const buyOrderInfo: BuyOrderInfoRequest = {
      appid: '616876868660610',
      uid: '102191',
      key,
      tradeproductid: tradeproductId,
    }
    // 只有当 TradeProductID 存在时才添加到对象中
    if (skuId) {
      buyOrderInfo.skuid = skuId
    }
    // 只有当 ExchangeID 为0不传？  存在时才添加到对象中
    if (exchangeId) {
      buyOrderInfo.exchangeid = exchangeId
    }

    const res = await buyOrderApi(buyOrderInfo)
    console.log('res', res)
    if (res.ret === 0) {
      return true
    }
    else {
      return false
    }
  }
  return {
    handleBuyOrder,
  }
}
