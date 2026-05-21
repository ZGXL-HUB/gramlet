<template>
  <view class="accordion">
    <view class="accordion__header accordion__header--tap" @click="$emit('toggle')">
      <text class="accordion__title">{{ title }}</text>
      <view class="accordion__actions">
        <view
          v-if="showSelectAll"
          class="accordion__select-all accordion__header--tap"
          @click.stop="$emit('selectAll')"
        >
          {{ selectAllText }}
        </view>
        <text class="accordion__arrow" :class="arrowCls">›</text>
      </view>
    </view>
    <view v-if="expanded" class="accordion__body">
      <view class="accordion__content">
        <slot />
      </view>
    </view>
  </view>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  title: { type: String, default: '' },
  expanded: { type: Boolean, default: false },
  showSelectAll: { type: Boolean, default: false },
  selectAllText: { type: String, default: '全选' },
  bodyHeight: { type: String, default: '2000px' }
})

defineEmits(['toggle', 'selectAll'])

const arrowCls = computed(() => (props.expanded ? 'accordion__arrow--open' : ''))
</script>

<style lang="scss" scoped>
.accordion {
  background: #fff;
  border-radius: var(--card-radius-lg);
  box-shadow: var(--shadow-card);
  margin-bottom: 12px;
  overflow: hidden;
}

.accordion__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
}

.accordion__header--tap:active {
  opacity: 0.85;
}

.accordion__title {
  font-size: 15px;
  font-weight: 500;
  color: #333;
}

.accordion__actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.accordion__select-all {
  font-size: 13px;
  color: var(--purple);
}

.accordion__arrow {
  font-size: 20px;
  color: #999;
  transform: rotate(90deg);
  transition: transform 0.3s ease;
}

.accordion__arrow--open {
  transform: rotate(-90deg);
}

.accordion__body {
  animation: accordionIn 0.3s ease;
}

.accordion__content {
  padding: 0 16px 14px;
}

@keyframes accordionIn {
  from {
    opacity: 0;
    transform: translateY(-4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
