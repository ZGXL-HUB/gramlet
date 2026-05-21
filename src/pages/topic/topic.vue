<template>
  <view class="topic-page">
    <NavBar title="专题习题" :show-back="true" @back="onNavBack">
      <template #right>
        <view class="topic-page__switch">
          <text class="topic-page__switch-label">乱序出题</text>
          <switch :checked="store.randomOrder" color="#6c5ce7" @change="onRandomChange" />
        </view>
      </template>
    </NavBar>

    <view class="topic-page__grid">
      <view
        v-for="topic in topics"
        :key="topic.id"
        class="topic-page__card"
        :class="topicCardCls(topic.id)"
        @click="onSelectTopic(topic)"
      >
        <text class="topic-page__name">{{ topic.name }}</text>
        <text class="topic-page__count">{{ topic.children.length }} 个知识点</text>
      </view>
    </view>

    <view
      class="topic-page__fab"
      :class="fabDisabledCls"
      @click="onConfirm"
    >
      我选好了
    </view>

    <CountInputModal
      :visible="countVisible"
      title="输入题量"
      :default-value="20"
      :min="1"
      :max="countMax"
      @confirm="onCountConfirm"
      @cancel="countVisible = false"
    />
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import NavBar from '../../components/NavBar/NavBar.vue'
import CountInputModal from '../../components/CountInputModal/CountInputModal.vue'
import { useSelectionStore } from '@/store/selection.js'
import { getAllTopics, getExercises } from '@/api/index.js'
import { distributeQuestions } from '@/utils/common.js'
import { showToast } from '@/utils/toast.js'
import { getCountInputMax } from '@/utils/limits.js'

const store = useSelectionStore()
const topics = ref([])
const countVisible = ref(false)
const btnDisabled = ref(false)
const isFirstLoad = ref(true)

const countMax = getCountInputMax('topic')

const fabDisabledCls = computed(() =>
  btnDisabled.value || !store.canConfirm ? 'topic-page__fab--disabled' : ''
)

const topicCardCls = (topicId) =>
  store.selectedTopic && store.selectedTopic.id === topicId ? 'topic-page__card--active' : ''

onMounted(async () => {
  if (store.mode !== 'topic') {
    uni.redirectTo({ url: '/pages/index/index' })
    return
  }
  const res = await getAllTopics()
  if (res.code === 0) {
    topics.value = res.data
  }
  isFirstLoad.value = false
})

onShow(() => {
  if (isFirstLoad.value) return
  store.restoreFromStorage()
})

const onNavBack = () => {
  uni.navigateBack()
}

const onRandomChange = (e) => {
  store.setRandomOrder(e.detail.value)
}

const onSelectTopic = (topic) => {
  store.setSelectedTopic({
    id: topic.id,
    name: topic.name,
    children: topic.children
  })
}

const guard = (fn) => {
  if (btnDisabled.value) return
  btnDisabled.value = true
  fn()
  setTimeout(() => {
    btnDisabled.value = false
  }, 1500)
}

const onConfirm = () => {
  guard(() => {
    if (!store.selectedTopic) {
      showToast('请先选择一个语法专题')
      return
    }
    countVisible.value = true
    btnDisabled.value = false
  })
}

const onCountConfirm = async (total) => {
  countVisible.value = false
  if (!store.selectedTopic?.children?.length) return

  const distribution = distributeQuestions(total, store.selectedTopic.children)
  const questions = distribution.map((d) => ({
    point_id: d.id,
    count: d.count
  }))

  const res = await getExercises({
    mode: 'topic',
    random_order: store.randomOrder,
    questions
  })

  if (res.code === 0) {
    store.setExercises(res.data.exercises)
    uni.navigateTo({ url: '/pages/worksheet/worksheet' })
  }
}
</script>

<style lang="scss" scoped>
.topic-page {
  min-height: 100vh;
  padding-bottom: 100px;
}

.topic-page__switch {
  display: flex;
  align-items: center;
  gap: 4px;
}

.topic-page__switch-label {
  font-size: 12px;
  color: #666;
}

.topic-page__grid {
  padding: 16px;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.topic-page__card {
  width: calc(50% - 6px);
  background: #fff;
  border-radius: var(--card-radius-lg);
  box-shadow: var(--shadow-card);
  padding: 16px;
  border: 2px solid transparent;
  transition: var(--transition);
}

.topic-page__card--active {
  border-color: var(--purple);
  background: rgba(108, 92, 231, 0.05);
}

.topic-page__card:active {
  opacity: 0.9;
}

.topic-page__name {
  display: block;
  font-size: 15px;
  font-weight: 600;
  color: #333;
  margin-bottom: 6px;
}

.topic-page__count {
  font-size: 12px;
  color: #999;
}

.topic-page__fab {
  position: fixed;
  right: 20px;
  bottom: 20px;
  z-index: 90;
  padding: 12px 24px;
  background: var(--purple);
  color: #fff;
  font-size: 15px;
  border-radius: 999px;
  box-shadow: var(--shadow-modal);
}

.topic-page__fab--disabled {
  opacity: 0.5;
  pointer-events: none;
}
</style>
