import type { BuyOrderInfoRequest } from '@/api/types'
import { buyOrderApi } from '@/api/index'
import { useLoginStore } from '@/store/modules/loginStore'

export function useBuyOrder() {
  const loginStore = useLoginStore()
  async function handleBuyOrder(key: number, tradeproductId: number, skuId?: string, exchangeId?: number) {
    const buyOrderInfo: BuyOrderInfoRequest = {
      appid: '616876868660610',
      uid: loginStore.userUid,
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
    return res
  }
  return {
    handleBuyOrder,
  }
}
