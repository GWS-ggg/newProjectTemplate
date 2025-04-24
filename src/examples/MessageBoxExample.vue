<script setup lang="ts">
import { ref } from 'vue'
import { MessageBox } from '../components/MessageBox/index'

// 支付成功示例
function showPaymentSuccess() {
  MessageBox.paymentSuccess('您的订单已支付成功！', '确定', () => {
    console.log('点击了确定按钮')
  })
}

// 支付失败示例
function showPaymentFailed() {
  MessageBox.paymentFailed('支付未完成，请重新尝试', '重新支付', () => {
    console.log('点击了重新支付按钮')
  })
}

// 下单失败示例
function showOrderFailed() {
  MessageBox.orderFailed('商品库存不足，请选择其他商品', '返回购物车', () => {
    console.log('点击了返回购物车按钮')
  })
}

// 自定义消息框示例
function showCustomMessage() {
  MessageBox.custom({
    type: 'success',
    content: '自定义消息内容',
    closeable: true,
    defaultBtn: {
      text: '取消',
      onClick: () => {
        console.log('点击了取消按钮')
      },
    },
    primaryBtn: {
      text: '确定',
      onClick: () => {
        console.log('点击了确定按钮')
      },
    },
  })
}
</script>

<template>
  <div class="example-container">
    <h1>消息框示例</h1>
    <div class="buttons">
      <button @click="showPaymentSuccess">
        显示支付成功
      </button>
      <button @click="showPaymentFailed">
        显示支付失败
      </button>
      <button @click="showOrderFailed">
        显示下单失败
      </button>
      <button @click="showCustomMessage">
        显示自定义消息
      </button>
    </div>
  </div>
</template>

<style scoped>
.example-container {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

h1 {
  font-size: 24px;
  margin-bottom: 20px;
  text-align: center;
}

.buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
}

button {
  padding: 10px 20px;
  background-color: #3a7bfc;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

button:hover {
  background-color: #2a6eee;
}
</style>
