<template>
  <view v-if="visible" class="variant-modal">
    <view class="variant-modal__mask" @tap="$emit('cancel')" />
    <view class="variant-modal__box" @tap.stop>
      <text class="variant-modal__title">选择变式题数量</text>
      <text class="variant-modal__hint">每知识点题量 = 1 + 变式题数量</text>
      <view class="variant-modal__options">
        <view
          v-for="n in 4"
          :key="n - 1"
          class="variant-modal__option"
          :class="optionCls(n - 1)"
          @click="$emit('select', n - 1)"
        >
          {{ n - 1 }} 道
        </view>
      </view>
      <view class="variant-modal__actions">
        <view class="variant-modal__btn variant-modal__btn--cancel" @click="$emit('cancel')">
          取消
        </view>
        <view class="variant-modal__btn variant-modal__btn--confirm" @click="$emit('confirm')">
          确定
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
const props = defineProps({
  visible: { type: Boolean, default: false },
  selected: { type: Number, default: 0 }
})

defineEmits(['select', 'confirm', 'cancel'])

const optionCls = (n) => (props.selected === n ? 'variant-modal__option--active' : '')
</script>

<style lang="scss" scoped>
.variant-modal {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.variant-modal__mask {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
}

.variant-modal__box {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 320px;
  background: #fff;
  border-radius: var(--modal-radius);
  box-shadow: var(--shadow-modal);
  padding: 20px;
}

.variant-modal__title {
  display: block;
  font-size: 17px;
  font-weight: 600;
  text-align: center;
  margin-bottom: 8px;
}

.variant-modal__hint {
  display: block;
  font-size: 13px;
  color: #999;
  text-align: center;
  margin-bottom: 16px;
}

.variant-modal__options {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
}

.variant-modal__option {
  flex: 1;
  text-align: center;
  padding: 10px 0;
  border-radius: var(--card-radius-sm);
  background: #f5f6fa;
  font-size: 14px;
  color: #666;
  transition: var(--transition);
}

.variant-modal__option--active {
  background: var(--purple);
  color: #fff;
}

.variant-modal__actions {
  display: flex;
  gap: 12px;
}

.variant-modal__btn {
  flex: 1;
  text-align: center;
  padding: 10px 0;
  border-radius: var(--card-radius-sm);
  font-size: 15px;
}

.variant-modal__btn--cancel {
  background: #f5f5f5;
  color: #666;
}

.variant-modal__btn--confirm {
  background: var(--purple);
  color: #fff;
}
</style>
