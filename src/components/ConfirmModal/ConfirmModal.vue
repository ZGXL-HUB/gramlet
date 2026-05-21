<template>
  <view v-if="visible" class="confirm-modal">
    <view class="confirm-modal__mask" @tap="$emit('cancel')" />
    <view class="confirm-modal__box" @tap.stop>
      <text v-if="title" class="confirm-modal__title">{{ title }}</text>
      <text class="confirm-modal__content">{{ content }}</text>
      <view class="confirm-modal__actions">
        <view class="confirm-modal__btn confirm-modal__btn--cancel" @click="$emit('cancel')">
          {{ cancelText }}
        </view>
        <view class="confirm-modal__btn confirm-modal__btn--confirm" @click="$emit('confirm')">
          {{ confirmText }}
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
defineProps({
  visible: { type: Boolean, default: false },
  title: { type: String, default: '提示' },
  content: { type: String, default: '' },
  confirmText: { type: String, default: '确定' },
  cancelText: { type: String, default: '取消' }
})

defineEmits(['confirm', 'cancel'])
</script>

<style lang="scss" scoped>
.confirm-modal {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.confirm-modal__mask {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
}

.confirm-modal__box {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 320px;
  background: #fff;
  border-radius: var(--modal-radius);
  box-shadow: var(--shadow-modal);
  padding: 20px;
}

.confirm-modal__title {
  display: block;
  font-size: 17px;
  font-weight: 600;
  color: #333;
  text-align: center;
  margin-bottom: 12px;
}

.confirm-modal__content {
  display: block;
  font-size: 15px;
  color: #666;
  text-align: center;
  line-height: 1.5;
  margin-bottom: 20px;
}

.confirm-modal__actions {
  display: flex;
  gap: 12px;
}

.confirm-modal__btn {
  flex: 1;
  text-align: center;
  padding: 10px 0;
  border-radius: var(--card-radius-sm);
  font-size: 15px;
  transition: var(--transition);
}

.confirm-modal__btn--cancel {
  background: #f5f5f5;
  color: #666;
}

.confirm-modal__btn--confirm {
  background: var(--primary);
  color: #fff;
}
</style>
