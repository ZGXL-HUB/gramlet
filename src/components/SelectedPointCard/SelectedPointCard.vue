<template>
  <view class="sp-card">
    <text class="sp-card__name">{{ name }}</text>
    <view class="sp-card__ctrl">
      <view
        class="sp-card__btn"
        :class="minusDisabledCls"
        @click="$emit('minus')"
      >−</view>
      <text class="sp-card__count">{{ count }}</text>
      <view
        class="sp-card__btn"
        :class="plusDisabledCls"
        @click="$emit('plus')"
      >+</view>
      <text class="sp-card__del" @click="$emit('delete')">×</text>
    </view>
  </view>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  name: { type: String, default: '' },
  count: { type: Number, default: 0 },
  disablePlus: { type: Boolean, default: false },
  disableMinus: { type: Boolean, default: false }
})

defineEmits(['plus', 'minus', 'delete'])

const plusDisabledCls = computed(() => (props.disablePlus ? 'sp-card__btn--disabled' : ''))
const minusDisabledCls = computed(() => (props.disableMinus ? 'sp-card__btn--disabled' : ''))
</script>

<style lang="scss" scoped>
.sp-card {
  background: #fff;
  border-radius: var(--card-radius-lg);
  box-shadow: var(--shadow-card);
  padding: 12px;
  margin-bottom: 12px;
}

.sp-card__name {
  display: block;
  font-size: 14px;
  color: #333;
  margin-bottom: 10px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.sp-card__ctrl {
  display: flex;
  align-items: center;
  gap: 8px;
}

.sp-card__btn {
  width: 28px;
  height: 28px;
  line-height: 26px;
  text-align: center;
  border-radius: var(--card-radius-sm);
  background: #f5f6fa;
  font-size: 18px;
  color: var(--purple);
}

.sp-card__btn--disabled {
  opacity: 0.35;
  pointer-events: none;
}

.sp-card__count {
  min-width: 24px;
  text-align: center;
  font-size: 15px;
  font-weight: 600;
}

.sp-card__del {
  margin-left: auto;
  font-size: 18px;
  color: var(--red);
  padding: 0 4px;
}
</style>
