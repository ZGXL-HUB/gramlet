<template>
  <view class="status-bar">
    <view class="status-bar__dot" />
    <text class="status-bar__text">已连接</text>
    <view class="status-bar__expand" @click="$emit('expand')">
      <text>{{ expandText }}</text>
    </view>
  </view>
</template>

<script setup>
defineProps({
  expandText: { type: String, default: '展开' }
})

defineEmits(['expand'])
</script>

<style lang="scss" scoped>
.status-bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 90;
  display: flex;
  align-items: center;
  padding: 10px 16px;
  padding-bottom: calc(10px + env(safe-area-inset-bottom));
  background: #fff;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.05);
}

.status-bar__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--green);
  margin-right: 8px;
}

.status-bar__text {
  flex: 1;
  font-size: 14px;
  color: #666;
}

.status-bar__expand {
  padding: 4px 12px;
  border-radius: var(--card-radius-sm);
  border: 1px solid var(--primary);
  color: var(--primary);
  font-size: 13px;
}
</style>
