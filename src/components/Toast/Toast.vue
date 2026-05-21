<template>
  <view v-if="visible" class="global-toast">
    <text class="global-toast__text">{{ message }}</text>
  </view>
</template>

<script setup>
defineProps({
  visible: { type: Boolean, default: false },
  message: { type: String, default: '' }
})
</script>

<style lang="scss" scoped>
.global-toast {
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 2000;
  max-width: 70%;
  padding: 12px 20px;
  background: rgba(0, 0, 0, 0.75);
  border-radius: var(--card-radius-sm);
}

.global-toast__text {
  color: #fff;
  font-size: 14px;
  text-align: center;
  line-height: 1.4;
}
</style>
