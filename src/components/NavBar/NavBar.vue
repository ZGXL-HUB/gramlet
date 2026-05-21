<template>
  <view class="nav-bar" :style="barPadStyle">
    <view class="nav-bar__inner">
      <view class="nav-bar__left" @click="onBack">
        <slot name="left">
          <text v-if="showBack" class="nav-bar__back">‹</text>
        </slot>
      </view>
      <text class="nav-bar__title">{{ title }}</text>
      <view class="nav-bar__right">
        <slot name="right" />
      </view>
    </view>
  </view>
  <view class="nav-bar__placeholder" :style="placeholderStyle" />
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const props = defineProps({
  title: { type: String, default: '' },
  showBack: { type: Boolean, default: false }
})

const emit = defineEmits(['back'])

const statusBarHeight = ref(20)
const navHeight = ref(64)

const barPadStyle = computed(() => 'padding-top:' + statusBarHeight.value + 'px')
const placeholderStyle = computed(() => 'height:' + navHeight.value + 'px')

onMounted(() => {
  const info = uni.getSystemInfoSync()
  statusBarHeight.value = info.statusBarHeight || 20
  navHeight.value = statusBarHeight.value + 44
})

const onBack = () => {
  if (props.showBack) emit('back')
}
</script>

<style lang="scss" scoped>
.nav-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: #fff;
  box-shadow: var(--shadow-card);
}

.nav-bar__inner {
  height: 44px;
  display: flex;
  align-items: center;
  padding: 0 16px;
}

.nav-bar__left,
.nav-bar__right {
  width: 80px;
  display: flex;
  align-items: center;
}

.nav-bar__right {
  justify-content: flex-end;
}

.nav-bar__title {
  flex: 1;
  text-align: center;
  font-size: 17px;
  font-weight: 600;
  color: #333;
}

.nav-bar__back {
  font-size: 28px;
  color: var(--primary);
  line-height: 1;
}
</style>
