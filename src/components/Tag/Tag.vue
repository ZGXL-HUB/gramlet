<template>
  <view
    class="tag"
    :class="selectedCls"
    @click="$emit('click')"
  >
    <text class="tag__label">{{ label }}</text>
    <text
      v-if="showDelete"
      class="tag__delete"
      @click.stop="$emit('delete')"
    >×</text>
  </view>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  label: { type: String, default: '' },
  selected: { type: Boolean, default: false },
  showDelete: { type: Boolean, default: false }
})

defineEmits(['click', 'delete'])

const selectedCls = computed(() => (props.selected ? 'tag--selected' : ''))
</script>

<style lang="scss" scoped>
.tag {
  display: inline-flex;
  align-items: center;
  padding: 6px 12px;
  border-radius: 999px;
  background: #f5f6fa;
  border: 1px solid transparent;
  margin-right: 8px;
  margin-bottom: 8px;
  transition: var(--transition);
}

.tag--selected {
  background: rgba(22, 119, 255, 0.08);
  border-color: var(--primary);
  color: var(--primary);
}

.tag__label {
  font-size: 13px;
  color: #333;
  max-width: 140px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.tag--selected .tag__label {
  color: var(--primary);
}

.tag__delete {
  margin-left: 6px;
  font-size: 16px;
  color: var(--red);
  line-height: 1;
}
</style>
