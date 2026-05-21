<template>
  <view class="home">
    <NavBar title="语法作业生成" />
    <view class="home__content">
      <view
        v-for="item in modeCards"
        :key="item.mode"
        class="home__card"
        @click="onSelectMode(item.mode)"
      >
        <view class="home__icon" :style="iconBgStyle(item.color)">
          <text class="home__icon-text">{{ item.icon }}</text>
        </view>
        <text class="home__card-title">{{ item.title }}</text>
        <text class="home__card-desc">{{ item.desc }}</text>
      </view>
    </view>

    <view class="home__feedback" @click="onFeedback">反馈</view>
    <StatusBar @expand="onFeedback" />
  </view>
</template>

<script setup>
import { onShow } from '@dcloudio/uni-app'
import NavBar from '../../components/NavBar/NavBar.vue'
import StatusBar from '../../components/StatusBar/StatusBar.vue'
import { useSelectionStore } from '@/store/selection.js'
import { removeStorageSync, STORAGE_KEY, purgeExpiredCacheIfNeeded } from '@/utils/storage.js'
import { showToast } from '@/utils/toast.js'

const store = useSelectionStore()

const iconBgStyle = (color) => 'background-color:' + color

const modeCards = [
  {
    mode: 'recommend',
    title: '系统推荐组合习题',
    desc: '智能匹配10个高频考点',
    color: '#e84393',
    icon: '📖',
    path: '/pages/recommend/recommend'
  },
  {
    mode: 'topic',
    title: '单个语法专题习题',
    desc: '专注一个语法专题训练',
    color: '#0984e3',
    icon: '🎯',
    path: '/pages/topic/topic'
  },
  {
    mode: 'custom',
    title: '用户自选出题',
    desc: '自由组合知识点与题量',
    color: '#00b894',
    icon: '✏️',
    path: '/pages/custom/custom'
  }
]

onShow(() => {
  purgeExpiredCacheIfNeeded()
  removeStorageSync(STORAGE_KEY)
  store.clearSelection()
})

let clickLocked = false
const onSelectMode = (mode) => {
  if (clickLocked) return
  clickLocked = true
  setTimeout(() => {
    clickLocked = false
  }, 1500)

  const card = modeCards.find((c) => c.mode === mode)
  store.setMode(mode)
  uni.navigateTo({ url: card.path })
}

const onFeedback = () => showToast('功能开发中，敬请期待')
</script>

<style lang="scss" scoped>
.home {
  min-height: 100vh;
  padding-bottom: 72px;
}

.home__content {
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  padding: 24px 16px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.home__card {
  background: #fff;
  border-radius: var(--card-radius-lg);
  padding: 20px;
  box-shadow: var(--shadow-card);
  transition: var(--transition);
}

.home__card:active {
  opacity: 0.92;
  transform: scale(0.99);
}

.home__icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
}

.home__icon-text {
  font-size: 24px;
}

.home__card-title {
  display: block;
  font-size: 17px;
  font-weight: 600;
  color: #333;
  margin-bottom: 6px;
}

.home__card-desc {
  font-size: 13px;
  color: #999;
}

.home__feedback {
  position: fixed;
  right: 20px;
  bottom: 72px;
  z-index: 80;
  padding: 10px 18px;
  background: var(--primary);
  color: #fff;
  font-size: 14px;
  border-radius: 999px;
  box-shadow: var(--shadow-card);
}
</style>
