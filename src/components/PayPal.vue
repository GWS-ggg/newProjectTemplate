<script lang="ts" setup>
import type { OrderPopupInfo } from '@/types'
import type { PayOrderReq } from '@/types/index'
import { payOrderApi } from '@/api'
import { PAYPAL_PAY_TYPE, PG_APP_ID } from '@/enum'
import { ref, watch } from 'vue'
import Dialog from './Dialog.vue'

interface Props {
  userUid: string
  param: string
  orderPopupInfo: OrderPopupInfo
  selectedPayChannelId: number
}
const props = withDefaults(defineProps<Props>(), {
  selectedPayChannelId: PAYPAL_PAY_TYPE,
})
const emits = defineEmits(['created', 'statusChange', 'close'])

const visible = ref<boolean>(false)
watch(visible, async (val) => {
  if (!val) {
    emits('close')
  }
})
async function start() {
  renderBtn()
  visible.value = true
}

// 加载script
function loadScript(url: string, callback: () => void) {
  const script = document.createElement('script')
  script.src = url
  script.onload = callback
  document.head.appendChild(script)
}
const curOrder = ref<{
  orderId: string
  fntype14: string
}>()
async function createPaypalOrder() {
  if (!props.userUid || props.selectedPayChannelId !== PAYPAL_PAY_TYPE) {
    return
  }
  const orderParams: PayOrderReq = {
    appid: PG_APP_ID,
    version: ' 1.0',
    fn_uid: props.userUid,
    fn_deviceid: '',
    token: '',
    os: 'pc',
    game_platform: 'h5',
    ts: new Date().getTime() / 1000,
    price: props.orderPopupInfo.price.toString(),
    priceUsd: props.orderPopupInfo.price,
    params: props.param,
    desc: '',
    pid: '1',
    title: 'PG',
    game_appid: PG_APP_ID,
    game_openid: props.userUid,
    pay_type: PAYPAL_PAY_TYPE,
    content_type: '',
    zoneid: 0,
    roleid: props.userUid,
    zone_id: 0,
    role_id: props.userUid,
    is_gs: 0,
    channel: 'site',
    // 商品数量
    num: 1,
  }
  const res = await payOrderApi(orderParams)
  const { fntype14 } = res
  curOrder.value = {
    orderId: res.orderid,
    fntype14,
  }
  emits('created', res)
  return fntype14
}
const STATUS_SUCCESS = 1
const STATUS_ERROR = 0
const STATUS_CANCEL = 3
// TODO
function renderBtn() {
  const testPayPalId = 'AdkfZ6foWFV142QCZQmNkO8QwcfSORMhnPw2IQ0aNpGEdm07J5Oh3NCTr2OipdtbRO4eNRfKd5m8wnY_'
  loadScript(`https://www.paypal.com/sdk/js?client-id=${testPayPalId}`, () => {
    // 定义按钮样式
    const buttonStyle = {
      layout: 'vertical', // 按钮布局：vertical, horizontal
      color: 'gold', // 按钮颜色：gold, blue, silver, black
      shape: 'rect', // 按钮形状：rect, pill
      label: 'paypal', // 按钮标签：paypal, checkout, buynow, pay
      height: 55, // 按钮高度（像素）
    }
    //   // 使用自定义图片
    //   // custom: '@/assets/icons/99-logo.png',
    // }

    const paypal = (window as any).paypal
    // paypal初始化
    paypal.Buttons({
      // 下单
      createOrder() {
        console.log('下单成功')
        return createPaypalOrder()
      },
      // 付款
      onApprove() {
        emits('statusChange', {
          ...curOrder.value,
          status: STATUS_SUCCESS,
        })
        console.log('支付成功')
      },
      // 取消付款
      onCancel() {
        emits('statusChange', {
          ...curOrder.value,
          status: STATUS_CANCEL,
        })
      },
      // 付款失败
      onError(_err: any) {
        emits('statusChange', {
          ...curOrder.value,
          status: STATUS_ERROR,
        })
      },
      // 添加样式选项
      style: buttonStyle,
    }).render('#paypal-button-container')
  })
}

defineExpose({
  start,
  renderBtn,
  close: () => {
    visible.value = false
    curOrder.value = undefined
  },
})
</script>

<template>
  <Dialog v-model="visible">
    <div class="h-626 w-626 f-c">
      <div
        id="paypal-button-container"
        class="w-480"
      />
    </div>
  </Dialog>
  <!-- <Dialog
    v-model:visible="visible"
    title="Paypal"
  >
    <div class="paypal-container">
      <div
        id="paypal-button-container"
        class="main"
      />
    </div>
  </Dialog> -->
</template>

<style lang="scss" scoped>
.paypal-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}
</style>
