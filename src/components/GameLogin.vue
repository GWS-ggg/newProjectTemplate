<script setup lang="ts">
import type { UIDRecord } from '@/types/index'
import { ref } from 'vue'

// const props = defineProps<{
//   path: string
//   guideImgList: string[]
// }>()
const emit = defineEmits(['onCloseLogin', 'onClickLogin', 'onShowGuide'])
const inputUid = ref('')
const validateMessage = ref('')

// 输入框选中状态
const isinputFocus = ref(false)
// 账号下拉框开关
const showDropdown = ref(false)
// 选择账号
function selectUIDRecord(uidValue: string) {
  inputUid.value = uidValue
  showDropdown.value = false
}

// 处理输入框失去焦点事件
function handleBlur() {
  setTimeout(() => {
    showDropdown.value = false
    isinputFocus.value = false
    validateInput()
  }, 200)
}

function handleConfirm() {
  // 点击回车时先关闭下拉框
  showDropdown.value = false
  isinputFocus.value = false
  emit('onClickLogin', inputUid.value)
  // 不校验 校验 不能为空
  // if (validateInput()) {
  //   emit('onClickLogin', inputUid.value)
  // }
}

function inputFocus() {
  isinputFocus.value = true
  showDropdown.value = true
}

function validateInput() {
  if (inputUid.value === '') {
    validateMessage.value = '请输入UID'
    showDropdown.value = false
    return false
  }

  // 使用正则表达式校验是否只包含数字
  // const uidPattern = /^\d+$/
  // if (!uidPattern.test(inputUid.value)) {
  //   validateMessage.value = 'uid_format_error_tip'
  //   showDropdown.value = false
  //   return false
  // }

  // 检查输入长度是否大于三个字符
  if (inputUid.value.length <= 3) {
    validateMessage.value = 'UID长度不能小于3'
    showDropdown.value = false
    return false
  }

  validateMessage.value = ''
  return true
}

// UID引导
// const isVisibleUIDGuide = ref(false)
// function onShowUIDGuide() {
//   emit('onShowGuide')
//   // isVisibleUIDGuide.value = true
// }
//
// 缓存uid相关
const uidRecordList = ref<Array<UIDRecord>>([])
const storageKey = `PG_UIDRecord`
uidRecordList.value = getUIDRecord()

function getUIDRecord() {
  try {
    const recordStorage = localStorage.getItem(storageKey)
    const record = recordStorage ? JSON.parse(recordStorage) : []
    console.log(record, 'record')
    return record
  }
  catch (error) {
    console.log(error)
  }
}
function removeUIDRecord(uid: string) {
  console.log('remove')
  try {
    const recordStorage = localStorage.getItem(storageKey)
    console.log(recordStorage, 'recordStorage')
    const record = recordStorage ? JSON.parse(recordStorage) : []
    const index = record.findIndex((_item: UIDRecord) => {
      return _item.uid === uid
    })
    record.splice(index, 1)
    localStorage.setItem(storageKey, JSON.stringify(record))
    uidRecordList.value = getUIDRecord()
  }
  catch (error) {
    console.log(error)
  }
}

function saveUIDRecord(userInfo: UIDRecord) {
  try {
    const recordStorage = localStorage.getItem(storageKey)
    const record = recordStorage ? JSON.parse(recordStorage) : []
    // 去重
    const index = record.findIndex((_item: UIDRecord) => {
      return _item.uid === userInfo.uid
    })
    if (index > -1) {
      record.splice(index, 1)
    }
    record.unshift({
      uid: userInfo.uid,
      userName: userInfo.userName,
    })
    localStorage.setItem(storageKey, JSON.stringify(record))
    uidRecordList.value = getUIDRecord()
    // const uidDom = document.getElementById('uid-input')
    // uidDom && uidDom.focus()
  }
  catch (error) {
    console.log(error)
  }
}
defineExpose({ saveUIDRecord })
</script>

<template>
  <div class="m-auto mb-50 w-694 rounded-20 text-24">
    <div class="flex flex-col">
      <div
        class="mt-50 f-c"
        lg="mt-45"
      >
        <img
          class="h-67 w-287"
          lg="h-80 w-300"
          src="@/assets/images/common/99-logo.png"
          alt=""
        >
      </div>
      <div class="mt-50 f-c text-30">
        用户登录
      </div>
      <div class="relative mt-40 f-c flex-col px-60">
        <input
          v-model="inputUid"
          class="w-full border-none text-24 focus:outline-none"
          type="text"
          autofocus
          placeholder="请输入UID"
          style="font-size: 20px"
          @blur="handleBlur"
          @focus="inputFocus"
          @keydown.enter="handleConfirm"
        >
        <div
          class="relative mt-15 w-full border-b-[3px] border-[#e0e0e0] border-solid"
          :class="{ 'border-[#ED6504]': isinputFocus || validateMessage }"
        />
        <!-- <div class="absolute left-60 top-70 color-[#ED6504]">
          {{ validateMessage }}
        </div> -->
        <div
          v-if="showDropdown"
          class="shadow-[0 [rgba(0,0,0,0.1)]] absolute left-60 top-55 max-h-180 w-578 overflow-auto border-t-none bg-[#fff]"
          :class="{ 'border border-[#ccc] border-solid border-t-none': uidRecordList.length > 0 }"
          lg="w-584 left-60 text- top-65 "
        >
          <div
            v-for="(uidRecord, index) in uidRecordList"
            :key="index"
            class="f-b p-8 hover:bg-[#fff5e6]"
            @click="selectUIDRecord(uidRecord.uid)"
          >
            <span>{{ uidRecord.uid }} ({{ uidRecord.userName }}) </span>
            <div @click.stop="removeUIDRecord(uidRecord.uid)">
              <div
                class="i-iwwa:delete h-26 w-26 cursor-pointer"
                style="color: #ED6504;"
              />
            </div>
          </div>
        </div>
        <div
          class="mt-100 h-80 w-full f-c cursor-pointer rounded-80 bg-[#ED6504] color-[#fff]"

          @click="handleConfirm"
        >
          确认
        </div>
        <!-- <div
          class="mb-50 mt-50 f-c cursor-pointer"
          @click="onShowUIDGuide"
        >
          <div>{{ t('how_to_get_your_user_code') }}</div>
          <div
            class="i-iconamoon:arrow-right-2-light h-30 w-30"
            style="color: #000;"
          />
        </div> -->
      </div>
    </div>
  </div>
</template>
