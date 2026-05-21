<script setup>
import { ref, onMounted } from 'vue'
import Toast from './components/Toast/Toast.vue'
import Loading from './components/Loading/Loading.vue'
import { registerToast, registerLoading } from '@/utils/toast.js'

const toastVisible = ref(false)
const toastMessage = ref('')
let toastTimer = null

const loadingVisible = ref(false)
const loadingText = ref('加载中...')

onMounted(() => {
  registerToast((message) => {
    toastMessage.value = message
    toastVisible.value = true
    if (toastTimer) clearTimeout(toastTimer)
    toastTimer = setTimeout(() => {
      toastVisible.value = false
    }, 2000)
  })

  registerLoading((show, text = '加载中...') => {
    loadingVisible.value = show
    if (show) loadingText.value = text
  })
})
</script>

<template>
  <Toast :visible="toastVisible" :message="toastMessage" />
  <Loading :visible="loadingVisible" :text="loadingText" />
</template>

<style lang="scss">
@import './uni.scss';

page {
  background-color: #f5f6fa;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial,
    sans-serif;
}
</style>
