<!-- <script lang="ts" setup>
import type { GoodsInfo, Level, MyCardType, MyCardTypeList, OrderReq, StoreUserInfo } from '@/types/index'
import { myCardOrderApi, myCardTypeApi } from '@/api'
import { MYCARD_PAY_TYPE } from '@/enum/const'
import { t } from '@/language/i18n'
import { Toast } from '@/utils/toast'
import { ref, watch } from 'vue'

interface Props {
  appid: string
  payPalClientId: string
  selectedProduct: GoodsInfo | null
  currentLevel: Level
  userInfo?: StoreUserInfo
  productCount: number
}
const props = withDefaults(defineProps<Props>(), {
  selectedProduct: null,
  productCount: 1,
})
const emits = defineEmits(['created', 'close'])
const currency = ref<string>('TWD')
const mycardTypeList = ref<MyCardTypeList>([])
const visible = ref<boolean>(false)
watch(visible, async (val) => {
  if (!val) {
    emits('close')
  }
})
async function changeCurrency(value: string) {
  currency.value = value
  if (!props.selectedProduct)
    return
  mycardTypeList.value = []
  const { usd } = props.selectedProduct
  await getTypeList(Number(usd))
}
async function start() {
  if (props.selectedProduct) { // 检查 selectedProduct 是否为 null
    const { usd } = props.selectedProduct
    await getTypeList(Number(usd))
    visible.value = true
  }
  else {
    console.error('selectedProduct is null')
    // 处理 selectedProduct 为 null 的情况
  }
}
const payMethod = ref<MyCardType>()
function chageMethod(method: MyCardType) {
  payMethod.value = method
}

const toastVisble = ref(false)
async function getTypeList(amount: number) {
  Toast.loading()
  toastVisble.value = true
  const res = await myCardTypeApi({
    appid: props.appid,
    currency: currency.value,
    amount,
  })
  mycardTypeList.value = res
  payMethod.value = res.length ? res[0] : undefined
  Toast.close()
  toastVisble.value = false
}
async function order() {
  const isSafari = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent)
  const name = 'Mycard'
  const options = 'width=700,height=700,left=-185,top=-220,resizable=no,location=no,menubar=no'
  let win: Window | null = null
  if (isSafari) {
    win = window.open() as Window
  }
  if (!props.selectedProduct || !props.userInfo) {
    return
  }
  const typeItem = payMethod.value
  if (!typeItem) {
    Toast.info('请选择支付方式')
    return
  }
  try {
    const orderParams: OrderReq = {
      appid: props.appid,
      version: ' 1.0',
      fn_uid: props.userInfo.fnUid,
      fn_deviceid: '',
      token: '',
      os: 'pc',
      game_platform: 'h5',
      ts: new Date().getTime() / 1000,
      // price: props.selectedProduct.twd, todo
      price: props.selectedProduct.usd.toString(),
      priceUsd: props.selectedProduct.usd,
      params: '',
      desc: '',
      pid: props.selectedProduct[props.currentLevel].pid,
      title: props.selectedProduct[props.currentLevel].desc,
      game_appid: props.appid,
      game_openid: props.userInfo.fnUid,
      pay_type: MYCARD_PAY_TYPE,
      mycard_pay_type: typeItem.PaymentType,
      content_type: '',
      zoneid: props.userInfo.serverId ? Number(props.userInfo.serverId) : 0,
      roleid: props.userInfo.roleId,
      zone_id: props.userInfo.serverId ? Number(props.userInfo.serverId) : 0,
      role_id: props.userInfo.roleId,
      is_gs: 0,
      channel: 'site',
      // 商品数量 固定为1
      num: props.productCount,
    }
    Toast.loading()
    const res = await myCardOrderApi(orderParams)
    const { fntype14 } = res
    if (fntype14) {
      const url = fntype14
      if (!isSafari) {
        window.open(url, name, options)
      }
      else {
        if (win) {
          win.location.replace(url)
        }
      }
    }
    Toast.close()
    emits('created', res)
  }
  catch (error) {
    console.log(error)
    if (win) {
      win.close()
    }
  }
}
defineExpose({
  start,
  close: () => {
    visible.value = false
  },
})
</script>

<template>
  <m-dialog v-model="visible">
    <div
      class="relative z-100 h-650 w-650 f-s flex-col"
      lg="h-700 w-750"
    >
      <div class="mt-90 w-640 flex flex-col text-30 color-[#fff]">
        <div class="h-54 w-full f-b flex cursor-pointer rounded-16 bg-[#e0e0e0] color-[#222C37]">
          <div
            class="h-full w-[50%] f-c rounded-l-16"
            :class="{ ' bg-[#ED6504] color-[#fff]': currency === 'TWD' }"
            @click="changeCurrency('TWD')"
          >
            TWD
          </div>
          <div class="border-soild h-full border border-[#fff] border-solid" />
          <div
            class="h-full w-[50%] f-c rounded-r-16"
            :class="{ 'bg-[#ED6504] color-[#fff]': currency === 'HKD' }"
            @click="changeCurrency('HKD')"
          >
            HKD
          </div>
        </div>
        <div
          v-if="!mycardTypeList.length && !toastVisble"
          class="mt-80 w-full f-c color-[#222C37]"
        >
          {{ t('no_available_payment_method') }}
        </div>
        <div class="h-348 overflow-auto">
          <div
            v-for=" typeItem in mycardTypeList"
            :key="typeItem.PaymentType"
            class="relative mt-16 h-100 f-b cursor-pointer rounded-16 bg-[#e0e0e0] color-[#222C37]"
            :class="{ ' bg-[#ED6504] color-[#fff]! ': payMethod?.PaymentType === typeItem.PaymentType }"
            @click="chageMethod(typeItem)"
          >
            <img
              class="mx-40 h-64 w-64 f-c rounded-16"
              src="/img/mycard.png"
              alt=""
            >
            <div class="w-full f-s text-30 font-bold">
              {{ typeItem.PaymentTypeDesc }}
            </div>
          </div>
        </div>

        <div
          class="absolute bottom-45 h-100 w-640 f-c cursor-pointer rounded-16 bg-[#ED6504]"
          @click="order"
        >
          {{ t('continue') }}
        </div>
      </div>
    </div>
  </m-dialog>
</template>

<style lang="scss" scoped>
.afterImage::after {
      content: "";
      position: absolute;
      top: -1px;
      left: -1px;
      width: 48px;
      height: 48px;
      background-image: url("/img/selected-flag.png");
      background-size: 100%;
    }
</style> -->
