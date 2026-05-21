<template>
  <view class="random-order-bar">
    <view class="random-order-bar__text">
      <text class="random-order-bar__label">乱序出题</text>
      <text class="random-order-bar__hint">开启后题目顺序随机排列</text>
    </view>
    <switch :checked="checked" color="#6c5ce7" @change="onChange" />
  </view>
</template>

<script setup>
defineProps({
  checked: { type: Boolean, default: true }
})

const emit = defineEmits(['change'])

const onChange = (e) => {
  emit('change', !!e.detail.value)
}
</script>

<style lang="scss" scoped>
.random-order-bar {
  margin: 12px 16px 0;
  padding: 12px 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  border-radius: var(--card-radius-sm);
  box-shadow: var(--shadow-card);
}

.random-order-bar__text {
  flex: 1;
  min-width: 0;
  margin-right: 12px;
}

.random-order-bar__label {
  display: block;
  font-size: 15px;
  font-weight: 500;
  color: #333;
}

.random-order-bar__hint {
  display: block;
  margin-top: 4px;
  font-size: 12px;
  color: #999;
  line-height: 1.4;
}
</style>
