<script lang="ts" setup>
import type { GoodsInfo, Level, OrderReq, StoreUserInfo } from '@/types/index'
import { myCardOrderApi } from '@/api'
import { PAYPAL_PAY_TYPE } from '@/enum/const'
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
  if (!props.selectedProduct || !props.userInfo) {
    return
  }
  const orderParams: OrderReq = {
    appid: props.appid,
    version: ' 1.0',
    fn_uid: props.userInfo.fnUid,
    fn_deviceid: '',
    token: '',
    os: 'pc',
    game_platform: 'h5',
    ts: new Date().getTime() / 1000,
    price: props.selectedProduct.usd.toString(),
    priceUsd: props.selectedProduct.usd,
    params: '',
    desc: '',
    pid: props.selectedProduct[props.currentLevel].pid,
    title: props.selectedProduct[props.currentLevel].desc,
    game_appid: props.appid,
    game_openid: props.userInfo.fnUid,
    pay_type: PAYPAL_PAY_TYPE,
    content_type: '',
    zoneid: props.userInfo.serverId ? Number(props.userInfo.serverId) : 0,
    roleid: props.userInfo.roleId,
    zone_id: props.userInfo.serverId ? Number(props.userInfo.serverId) : 0,
    role_id: props.userInfo.roleId,
    is_gs: 0,
    channel: 'site',
    // 商品数量
    num: props.productCount,
  }
  const res = await myCardOrderApi(orderParams)
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
function renderBtn() {
  loadScript(`https://www.paypal.com/sdk/js?client-id=${props.payPalClientId}`, () => {
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
  <m-dialog v-model="visible">
    <div class="h-626 w-626 f-c">
      <div
        id="paypal-button-container"
        class="w-480"
      />
    </div>
  </m-dialog>
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

<style lang="less" scoped>
.paypal-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}
</style>
