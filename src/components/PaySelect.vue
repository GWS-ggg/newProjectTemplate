<script setup lang="ts">
import type { OrderPopupInfo, PayOrderReq } from '@/types'

import { payOrderApi } from '@/api'

import { useBuyOrder } from '@/hooks/useBuyOrder'
import { formatPrice, getDeviceType } from '@/utils'
import { MessageBox } from '@/utils/messageBox'

import { ref } from 'vue'

const props = defineProps<{
  orderPopupInfo: OrderPopupInfo
}>()

const emit = defineEmits(['paymentSuccess', 'close'])
const payChannels = ref<PayChannel[]>([
  {
    payType: 23002,
    name: 'Alipay',
    extra: 10,
    level: 1,
    icon: 'https://mprogram-static.forevernine.com/ovsite/icon2/alipay.png',
  },
  {
    payType: 23001,
    name: 'WeChatPay',
    extra: 10,
    level: 1,
    icon: 'https://mprogram-static.forevernine.com/ovsite/icon2/weixin.png',
  },
  {
    payType: 23003,
    name: 'ApplePay',
    extra: 10,
    level: 1,
    icon: 'https://mprogram-static.forevernine.com/ovsite/icon2/apple.png',
  },
  {
    payType: 23004,
    name: 'GooglePay',
    extra: 10,
    level: 1,
    icon: 'https://mprogram-static.forevernine.com/ovsite/icon2/geogle.png',
  },
  {
    payType: 230010,
    name: 'Cards',
    extra: 10,
    level: 1,
    icon: 'https://mprogram-static.forevernine.com/cdn/img/cards.jpeg',
  },
  {
    payType: 23,
    name: 'Payermax',
    extra: 10,
    level: 1,
    icon: 'https://mprogram-static.forevernine.com/ovsite/icon2/payermax.png',
  },
  {
    payType: 20,
    name: 'PayPal',
    extra: 10,
    level: 1,
    icon: 'https://mprogram-static.forevernine.com/ovsite/icon2/paypal.png',
  },
])
interface PayChannel {
  payType: number
  name: string
  extra: number
  level: number
  icon: string
}

const selectedPayChannel = ref<PayChannel | null>(payChannels.value[0])
const { handleBuyOrder } = useBuyOrder()
async function handlePayOrder() {
  const res = await handleBuyOrder(props.orderPopupInfo.key, props.orderPopupInfo.tradeProductId, props.orderPopupInfo.skuId, props.orderPopupInfo.exchangeId)
  console.log('handlePayOrder res', res)
  // dialogVisible.value = true
  MessageBox.orderFailed('支付失败', '确定', () => {
    handleClose()
    handlePaymentSuccess(res)
    console.log('确定')
  })
  setTimeout(() => {
    MessageBox.paymentSuccess('支付成功', '确定', () => {
      handleClose()
      handlePaymentSuccess(res)
      console.log('确定')
    })
  }, 1000)
  // emit('close')
}

function handlePaymentSuccess(res: any) {
  console.log('handlePaymentSuccess res', res)
  emit('paymentSuccess', res)
}
function handleClose() {
  console.log('handleClose')
  emit('close')
}
async function createPayOrder() {
  // if (!product || !userInfo) {
  //   return
  // }
  const os = getDeviceType()
  const orderParams: PayOrderReq = {
    appid: '616876868660610',
    version: ' 1.0',
    fn_uid: '102191',
    fn_deviceid: '',
    token: '',
    os,
    game_platform: 'h5',
    ts: new Date().getTime() / 1000,
    price: '1',
    priceUsd: 1,
    params: 'voucher',
    desc: '',
    pid: '1',
    title: 'test',
    game_appid: '616876868660610',
    game_openid: '102191',
    pay_type: '1', // todo
    content_type: '',
    zoneid: 0,
    roleid: '102191',
    zone_id: 0,
    role_id: '102191',
    is_gs: 0,
    channel: 'site',
    // 商品数量
    num: 1,

    // ??
    // trackSrc: source,
  }
  const res = await payOrderApi(orderParams)
  console.log('订单创建 res', res)
  return res
}
</script>

<template>
  <div class="relative z-1000 max-h-[80vh] min-h-[60vh] bg-[#fff] p-20 pb-120">
    <div class="w-full overflow-y-auto rounded-20 bg-[#f8f8f8] p-20 text-24">
      <div class="mb-20 color-[#666666]">
        支付方式
      </div>
      <div class="w-full flex flex-col gap-20">
        <div
          v-for="channel in payChannels"
          :key="channel.payType"
          class="f-c cursor-pointer gap-10 border border-[#fff] rounded-10 border-solid bg-[#fff] py-5"
          :class="{ 'bg-[#fff8f8]  border-[#ED6504]!': selectedPayChannel?.payType === channel.payType }"
          @click="selectedPayChannel = channel"
        >
          <img
            :src="channel.icon"
            class="h-48"
          >
        </div>
      </div>
    </div>
    <div class="absolute bottom-0 left-0 right-0 h-100 w-full bg-[#f8f8f8] px-15">
      <div class="h-full w-full flex items-center justify-between text-32">
        <div class="color-[#666666]">
          合计:
          <span class="color-[#ED6504]">{{ formatPrice(orderPopupInfo.price) }} </span>
        </div>
        <div
          class="mr-10 h-54 w-200 f-c cursor-pointer rounded-25 bg-[#ED6504] text-32 color-[#fff]"
          @click="handlePayOrder"
        >
          立即支付
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>

</style>
