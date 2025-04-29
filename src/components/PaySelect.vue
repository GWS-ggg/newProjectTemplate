<script setup lang="ts">
import type { OrderPopupInfo, PayOrderReq, PayOrderRes, PayType } from '@/types'

import { payOrderApi, payOrderStasuApi, paypalSettleApi } from '@/api'

import { MYCARD_PAY_TYPE, PAYPAL_PAY_TYPE, PG_APP_ID } from '@/enum'
import { useBuyOrder } from '@/hooks/useBuyOrder'
import { usePayStore } from '@/store/modules/payStore'

import { formatPrice, getDeviceType } from '@/utils'
import { MessageBox } from '@/utils/messageBox'
import { computed, ref } from 'vue'
import { useLoginStore } from '../store/modules/loginStore'

const props = defineProps<{
  orderPopupInfo: OrderPopupInfo
}>()

const emit = defineEmits(['paymentSuccess', 'close'])
// const payChannels = ref<PayChannel[]>([
//   {
//     payType: 23002,
//     name: 'Alipay',
//     extra: 10,
//     level: 1,
//     icon: 'https://mprogram-static.forevernine.com/ovsite/icon2/alipay.png',
//   },
//   {
//     payType: 23001,
//     name: 'WeChatPay',
//     extra: 10,
//     level: 1,
//     icon: 'https://mprogram-static.forevernine.com/ovsite/icon2/weixin.png',
//   },
//   {
//     payType: 23003,
//     name: 'ApplePay',
//     extra: 10,
//     level: 1,
//     icon: 'https://mprogram-static.forevernine.com/ovsite/icon2/apple.png',
//   },
//   {
//     payType: 23004,
//     name: 'GooglePay',
//     extra: 10,
//     level: 1,
//     icon: 'https://mprogram-static.forevernine.com/ovsite/icon2/geogle.png',
//   },
//   {
//     payType: 230010,
//     name: 'Cards',
//     extra: 10,
//     level: 1,
//     icon: 'https://mprogram-static.forevernine.com/cdn/img/cards.jpeg',
//   },
//   {
//     payType: 23,
//     name: 'Payermax',
//     extra: 10,
//     level: 1,
//     icon: 'https://mprogram-static.forevernine.com/ovsite/icon2/payermax.png',
//   },
//   {
//     payType: 20,
//     name: 'PayPal',
//     extra: 10,
//     level: 1,
//     icon: 'https://mprogram-static.forevernine.com/ovsite/icon2/paypal.png',
//   },
// ])
const payStore = usePayStore()
const payChannels = computed(() => payStore.payTypeList)

// TODO 缓存
const selectedPayChannel = ref<PayType | null>(payChannels.value[0])
const { handleBuyOrder } = useBuyOrder()
const loginStore = useLoginStore()
const userUid = computed(() => loginStore.userUid)

const orderParam = ref('')
async function handlePayOrder() {
  if (!selectedPayChannel.value) {
    return
  }

  showPaymentLoading()
  try {
    // 先走下单接口
    const res = await handleBuyOrder(props.orderPopupInfo.key, props.orderPopupInfo.tradeProductId, props.orderPopupInfo.skuId, props.orderPopupInfo.exchangeId)
    console.log('handlePayOrder res', res)
    orderParam.value = res.param
  }
  catch (error) {
    console.log('handlePayOrder error', error)
    showOrderFailed()
    return
  }
  // 再调支付接口
  try {
    // await checkout()
    // await new Promise((resolve) => {
    //   setTimeout(() => {
    //     resolve(true)
    //   }, 1000)
    // })
    // throw new Error('test')

    // showPaymentSuccess()
    checkout()
  }
  catch (error) {
    console.log('handlePayOrder error', error)
    showPaymentFailed()
  }
}

// 正在支付
function showPaymentLoading() {
  MessageBox.paymentLoading('请在新打开的页面完成支付', '取消', () => {
    console.log('取消支付')
  })
}

// 支付成功
function showPaymentSuccess() {
  MessageBox.paymentSuccess('支付成功', '确定', () => {
    handleClose()
    showPaymentSuccessAnimation()
    console.log('确定')
  })
}

// 支付失败
function showPaymentFailed() {
  MessageBox.paymentFailed('支付失败', '确定', () => {
    // handleClose()
    console.log('确定')
  })
}

// 下单失败
function showOrderFailed() {
  MessageBox.orderFailed('下单失败', '确定', () => {
    handleClose()
    console.log('确定')
  })
}

function showPaymentSuccessAnimation() {
  console.log('showPaymentSuccessAnimation')
  emit('paymentSuccess')
}
function handleClose() {
  console.log('handleClose')
  emit('close')
}
// 结算下单
const mycardRef = ref()
const payPalRef = ref()
async function checkout() {
  if (!orderParam.value) {
    throw new Error('orderParam.value is empty')
  }
  // maycard支付
  if (selectedPayChannel.value?.payType === MYCARD_PAY_TYPE) {
    mycardRef.value.start()
  }
  else if (selectedPayChannel.value?.payType === PAYPAL_PAY_TYPE) {
    payPalRef.value.start()
  }
  else {
    handlePayerMaxCheckout()
  }
}

let win: Window | null = null

async function handlePayerMaxCheckout() {
  // if (!selectedProduct.value || !userInfo.value) {
  //   return
  // }
  const isSafari = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent)
  const name = 'PayerMax'
  const options = 'width=700,height=700,left=-185,top=-220,resizable=no,location=no,menubar=no'
  if (isSafari) {
    win = window.open() as Window
  }
  try {
    // Toast.loading()
    const res = await createPayOrder()
    if (res) {
      const { fntype14 } = res
      if (fntype14) {
        const url = fntype14
        if (!isSafari) {
          win = window.open(url, name, options)
        }
        else {
          if (win) {
            win.location.replace(url)
          }
        }
      }
      // 先清除旧的事件监听
      window.removeEventListener('message', payermaxMsghandler)
      window.addEventListener('message', payermaxMsghandler)
      handleOrderCreated(res)
    }
  }
  catch (err: unknown) {
    if (err instanceof Error) {
      showPaymentFailed()
    }
  // finally {
  //   Toast.close()
  // }
  }
}

function handleOrderCreated(res: PayOrderRes) {
  console.log(res, 'handleOrderCreated')
  startCheckStatus(res)
}

// 轮序查询订单状态
let currentPayId: string
const ORDER_STATUS_SUCCESS = 1
const ORDER_STATUS_FAILED = -1
const ORDER_STATUS_PENDDING = 0
async function startCheckStatus(res: PayOrderRes) {
  const { orderid } = res
  const payId = orderid
  currentPayId = payId
  let count = 0
  const maxCount = 600
  const interval = 1000
  const check = async () => {
    console.log('check', payId, currentPayId)
    if (payId !== currentPayId)
      return
    const checkRes = await checkOrderStatus(payId)
    if (checkRes.status === ORDER_STATUS_SUCCESS) {
      showPaymentSuccess()
      mycardRef.value.close()
      payPalRef.value.close()
    }
    else if (checkRes.status === ORDER_STATUS_PENDDING) {
      if (count < maxCount) {
        count++
        setTimeout(check, interval)
      }
      else {
        showPaymentFailed()
        mycardRef.value.close()
        payPalRef.value.close()
      }
    }
    else if (checkRes.status === ORDER_STATUS_FAILED) {
      showPaymentFailed()
    }
  }
  check()
}

// 关闭定时
function handleModalClose() {
  console.log('定时查询关闭')
  currentPayId = ''
}
// 查询订单状态
async function checkOrderStatus(orderId: string) {
  console.log('checkOrderStatus', orderId)
  const res = await payOrderStasuApi({
    order_id: orderId,
  })
  return res
}
function handlePaypalStatusChange(data: {
  orderId: string
  fntype14: string
  status: 0 | 1 | 3
}) {
  const { orderId, fntype14, status } = data
  console.log('handlePaypalStatusChange', data)
  paypalSettleApi({
    orderid: orderId,
    fntype14,
    status,
  })
  // 支付成功 直接弹出成功窗口 不走轮询查找
  if (status === 1) {
    showPaymentSuccess()
    payPalRef.value.close()
  }
  if (status === 3) {
    // 取消支付
    payPalRef.value.close()
    showPaymentFailed()
  }
  if (status === 0) {
    // 支付失败
    payPalRef.value.close()
    showPaymentFailed()
  }
}

// 监听postMessage
function payermaxMsghandler(event: MessageEvent) {
  const PAYERMAX_SUCCESS_RET = 0
  const PAYERMAX_CANCEL_RET = 1
  const PAYERMAX_FAILED_RET = -2
  const { data } = event
  try {
    if (typeof data === 'string') {
      const message = JSON.parse(data)
      console.log(message, 'message')
      const { Ret, OrderId } = message
      if (OrderId === currentPayId) {
        win?.close()
        switch (Ret) {
          case PAYERMAX_SUCCESS_RET:
            currentPayId = ''
            showPaymentSuccess()
            break
          case PAYERMAX_CANCEL_RET:
            console.log('PAYERMAX_CANCEL_RET')
            showPaymentFailed()
            break
          case PAYERMAX_FAILED_RET:
            console.log('PAYERMAX_FAILED_RET')
            currentPayId = ''
            showPaymentFailed()
            break
        }
      }
    }
  }
  catch (error) {
    console.log(error)
  }
}
async function createPayOrder() {
  // if (!product || !userInfo) {
  //   return
  // }
  const os = getDeviceType()
  const orderParams: PayOrderReq = {
    appid: PG_APP_ID,
    version: ' 1.0',
    fn_uid: userUid.value,
    fn_deviceid: '',
    token: '',
    os,
    game_platform: 'h5',
    ts: new Date().getTime() / 1000,
    price: props.orderPopupInfo.price.toString(),
    priceUsd: props.orderPopupInfo.price,
    params: orderParam.value,
    desc: '',
    pid: '1',
    title: 'PG',
    game_appid: PG_APP_ID, // 写死
    game_openid: userUid.value,
    pay_type: selectedPayChannel.value?.payType.toString() || '', // todo
    content_type: '',
    zoneid: 0,
    roleid: userUid.value,
    zone_id: 0,
    role_id: userUid.value,
    is_gs: 0,
    channel: 'site',
    // 商品数量
    num: 1,
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

    <PayPal
      ref="payPalRef"
      :user-uid="userUid"
      :param="orderParam"
      :order-popup-info="orderPopupInfo"
      :selected-pay-channel-id="selectedPayChannel?.payType"
      @created="handleOrderCreated"
      @close="handleModalClose"
      @status-change="handlePaypalStatusChange"
    />

    <MyCard
      ref="mycardRef"
      :user-uid="userUid"
      :param="orderParam"
      :order-popup-info="orderPopupInfo"
      :selected-pay-channel-id="selectedPayChannel?.payType"
      @created="handleOrderCreated"
      @close="handleModalClose"
    />
  </div>
</template>

<style lang="scss" scoped>

</style>
