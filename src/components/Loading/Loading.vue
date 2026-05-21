<template>
  <view v-if="visible" class="global-loading">
    <view class="global-loading__box">
      <view class="global-loading__spinner" />
      <text class="global-loading__text">{{ text }}</text>
    </view>
  </view>
</template>

<script setup>
defineProps({
  visible: { type: Boolean, default: false },
  text: { type: String, default: '加载中...' }
})
</script>

<style lang="scss" scoped>
.global-loading {
  position: fixed;
  inset: 0;
  z-index: 1500;
  background: rgba(0, 0, 0, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
}

.global-loading__box {
  background: #fff;
  border-radius: var(--modal-radius);
  padding: 24px 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: var(--shadow-modal);
}

.global-loading__spinner {
  width: 36px;
  height: 36px;
  border: 3px solid #eee;
  border-top-color: var(--primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-bottom: 12px;
}

.global-loading__text {
  font-size: 14px;
  color: #666;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
