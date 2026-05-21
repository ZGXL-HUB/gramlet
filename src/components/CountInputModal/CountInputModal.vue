<template>
  <view v-if="visible" class="count-modal">
    <view class="count-modal__mask" @tap="$emit('cancel')" />
    <view class="count-modal__box" @tap.stop>
      <text class="count-modal__title">{{ title }}</text>
      <input
        class="count-modal__input"
        type="number"
        :value="inputValue"
        @input="onInput"
      />
      <text class="count-modal__hint">请输入 {{ min }}–{{ max }} 之间的题量</text>
      <view class="count-modal__actions">
        <view class="count-modal__btn count-modal__btn--cancel" @click="$emit('cancel')">
          取消
        </view>
        <view class="count-modal__btn count-modal__btn--confirm" @click="onConfirm">
          确定
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  visible: { type: Boolean, default: false },
  title: { type: String, default: '输入题量' },
  defaultValue: { type: Number, default: 20 },
  min: { type: Number, default: 1 },
  max: { type: Number, default: 100 }
})

const emit = defineEmits(['confirm', 'cancel'])

const inputValue = ref(String(props.defaultValue))

watch(
  () => props.visible,
  (v) => {
    if (v) inputValue.value = String(props.defaultValue)
  }
)

const onInput = (e) => {
  inputValue.value = e.detail.value.replace(/\D/g, '')
}

const onConfirm = () => {
  const digits = String(inputValue.value).replace(/\D/g, '')
  let n = parseInt(digits, 10)
  if (isNaN(n) || digits === '') n = props.defaultValue
  if (n < props.min) n = props.min
  if (n > props.max) n = props.max
  inputValue.value = String(n)
  emit('confirm', n)
}
</script>

<style lang="scss" scoped>
.count-modal {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.count-modal__mask {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
}

.count-modal__box {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 320px;
  background: #fff;
  border-radius: var(--modal-radius);
  box-shadow: var(--shadow-modal);
  padding: 20px;
}

.count-modal__title {
  display: block;
  font-size: 17px;
  font-weight: 600;
  text-align: center;
  margin-bottom: 16px;
}

.count-modal__input {
  width: 100%;
  height: 44px;
  border: 1px solid #e0e0e0;
  border-radius: var(--card-radius-sm);
  text-align: center;
  font-size: 18px;
  margin-bottom: 8px;
}

.count-modal__hint {
  display: block;
  font-size: 12px;
  color: #999;
  text-align: center;
  margin-bottom: 20px;
}

.count-modal__actions {
  display: flex;
  gap: 12px;
}

.count-modal__btn {
  flex: 1;
  text-align: center;
  padding: 10px 0;
  border-radius: var(--card-radius-sm);
  font-size: 15px;
}

.count-modal__btn--cancel {
  background: #f5f5f5;
  color: #666;
}

.count-modal__btn--confirm {
  background: var(--purple);
  color: #fff;
}
</style>
