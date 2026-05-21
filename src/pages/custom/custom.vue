<template>
  <view class="custom-page">
    <NavBar title="自选出题" :show-back="true" @back="onNavBack">
      <template #right>
        <view class="custom-page__switch">
          <text class="custom-page__switch-label">乱序出题</text>
          <switch :checked="store.randomOrder" color="#6c5ce7" @change="onRandomChange" />
        </view>
      </template>
    </NavBar>

    <view class="custom-page__selected">
      <view class="custom-page__selected-grid">
        <view
          v-for="p in store.selectedPoints"
          :key="p.id"
          class="custom-page__card-wrap"
        >
          <SelectedPointCard
            :name="p.name"
            :count="p.count"
            :disable-plus="isPlusDisabledForId(p.id)"
            :disable-minus="p.count <= 0"
            @plus="onCardPlus(p)"
            @minus="onCardMinus(p)"
            @delete="onCardDelete(p.id)"
          />
        </view>
      </view>
    </view>

    <scroll-view class="custom-page__scroll" scroll-y enable-back-to-top>
    <view class="custom-page__topics">
      <view
        v-for="topic in topics"
        :key="topic.id"
        class="custom-page__topic-wrap"
        :class="topicWrapCls(topic.id)"
      >
        <Accordion
          :title="topic.name"
          :expanded="expandedTopicId === topic.id"
          show-select-all
          :select-all-text="selectAllLabel(topic)"
          body-height="800px"
          @toggle="toggleTopic(topic.id)"
          @select-all="onTopicSelectAll(topic)"
        >
          <view
            v-for="point in topic.children"
            :key="point.id"
            class="custom-page__point"
          >
            <text class="custom-page__point-name">{{ point.name }}</text>
            <view class="custom-page__point-ctrl">
              <view
                class="custom-page__btn"
                :class="minusBtnCls(point)"
                @click="onMinus(point, topic)"
              >−</view>
              <text class="custom-page__count">{{ getCount(point.id) }}</text>
              <view
                class="custom-page__btn"
                :class="plusBtnCls(point)"
                @click="onPlus(point, topic)"
              >+</view>
            </view>
          </view>
        </Accordion>
      </view>
    </view>
    </scroll-view>

    <view class="custom-page__fab">
      <view
        class="custom-page__fab-btn custom-page__fab-btn--orange"
        :class="fabDisabledCls"
        @click="onReselect"
      >
        重选一批
      </view>
      <view
        class="custom-page__fab-btn custom-page__fab-btn--purple"
        :class="fabConfirmDisabledCls"
        @click="onConfirm"
      >
        我选好了
      </view>
    </view>

    <ConfirmModal
      :visible="confirmClear"
      title="提示"
      content="确定要清空所有选择吗？"
      @confirm="doClear"
      @cancel="confirmClear = false"
    />
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import NavBar from '../../components/NavBar/NavBar.vue'
import Accordion from '../../components/Accordion/Accordion.vue'
import ConfirmModal from '../../components/ConfirmModal/ConfirmModal.vue'
import SelectedPointCard from '../../components/SelectedPointCard/SelectedPointCard.vue'
import { useSelectionStore } from '@/store/selection.js'
import { getAllTopics, getExercises } from '@/api/index.js'
import { showToast } from '@/utils/toast.js'
import { LIMITS } from '@/utils/limits.js'

const store = useSelectionStore()
const topics = ref([])
const expandedTopicId = ref(null)
const confirmClear = ref(false)
const btnDisabled = ref(false)
const isFirstLoad = ref(true)

const fabDisabledCls = computed(() => (btnDisabled.value ? 'custom-page__fab-btn--disabled' : ''))
const fabConfirmDisabledCls = computed(() =>
  btnDisabled.value || !store.canConfirm ? 'custom-page__fab-btn--disabled' : ''
)

const topicWrapCls = (topicId) =>
  expandedTopicId.value === topicId ? 'custom-page__topic-wrap--full' : ''

const getCount = (pointId) => {
  const p = store.selectedPoints.find((item) => item.id === pointId)
  return p ? p.count : 0
}

const isPlusDisabledForId = (pointId) => {
  const c = getCount(pointId)
  return c >= LIMITS.PER_POINT_MAX || store.wouldExceedTotal(1)
}

const isPlusDisabled = (point) => isPlusDisabledForId(point.id)

const plusBtnCls = (point) => (isPlusDisabled(point) ? 'custom-page__btn--disabled' : '')
const minusBtnCls = (point) => (getCount(point.id) <= 0 ? 'custom-page__btn--disabled' : '')

const isTopicAllSelected = (topic) =>
  topic.children.length > 0 &&
  topic.children.every((c) => getCount(c.id) >= 1)

const selectAllLabel = (topic) => (isTopicAllSelected(topic) ? '取消全选' : '全选')

onMounted(async () => {
  if (store.mode !== 'custom') {
    uni.redirectTo({ url: '/pages/index/index' })
    return
  }
  const res = await getAllTopics()
  if (res.code === 0) topics.value = res.data
  isFirstLoad.value = false
})

onShow(() => {
  if (isFirstLoad.value) return
  store.restoreFromStorage()
})

const toggleTopic = (topicId) => {
  expandedTopicId.value = expandedTopicId.value === topicId ? null : topicId
}

const onNavBack = () => {
  uni.navigateBack()
}

const onRandomChange = (e) => {
  store.setRandomOrder(e.detail.value)
}

const guard = (fn) => {
  if (btnDisabled.value) return
  btnDisabled.value = true
  fn()
  setTimeout(() => {
    btnDisabled.value = false
  }, 1500)
}

const toastLimit = () => showToast('最多选择' + LIMITS.CUSTOM_MAX_TOTAL + '道题目')

const addPointWithCheck = (point, topic) => {
  if (store.wouldExceedTotal(1)) {
    toastLimit()
    return false
  }
  const ok = store.addPoint({
    id: point.id,
    name: point.name,
    topicId: topic.id,
    topicName: topic.name,
    difficulty: point.difficulty,
    count: 1
  })
  if (!ok) toastLimit()
  return ok
}

const onPlus = (point, topic) => {
  const count = getCount(point.id)
  if (count >= LIMITS.PER_POINT_MAX) return
  if (count === 0) {
    addPointWithCheck(point, topic)
    return
  }
  if (!store.updatePointCount(point.id, count + 1)) toastLimit()
}

const onMinus = (point) => {
  const count = getCount(point.id)
  if (count <= 0) return
  store.updatePointCount(point.id, count - 1)
}

const onCardPlus = (point) => onPlus(point, { id: point.topicId, name: point.topicName })
const onCardMinus = (point) => onMinus(point)
const onCardDelete = (pointId) => store.removePoint(pointId)

const onTopicSelectAll = (topic) => {
  if (isTopicAllSelected(topic)) {
    topic.children.forEach((c) => {
      if (getCount(c.id) > 0) store.updatePointCount(c.id, 0)
    })
    expandedTopicId.value = null
    return
  }

  expandedTopicId.value = topic.id
  for (const c of topic.children) {
    if (getCount(c.id) > 0) continue
    if (!addPointWithCheck(c, topic)) break
  }
}

const onReselect = () => {
  guard(() => {
    confirmClear.value = true
    btnDisabled.value = false
  })
}

const doClear = () => {
  confirmClear.value = false
  store.clearSelection(false)
  expandedTopicId.value = null
}

const onConfirm = () => {
  guard(async () => {
    if (store.totalCount === 0) {
      showToast('请至少选择1道题目')
      return
    }

    const res = await getExercises({
      mode: 'custom',
      random_order: store.randomOrder,
      questions: store.selectedPoints.map((p) => ({
        point_id: p.id,
        count: p.count
      }))
    })

    if (res.code === 0) {
      store.setExercises(res.data.exercises)
      uni.navigateTo({ url: '/pages/worksheet/worksheet' })
    }
  })
}
</script>

<style lang="scss" scoped>
.custom-page {
  min-height: 100vh;
  padding-bottom: 140px;
}

.custom-page__switch {
  display: flex;
  align-items: center;
  gap: 4px;
}

.custom-page__switch-label {
  font-size: 12px;
  color: #666;
}

.custom-page__selected {
  padding: 12px 16px 0;
}

.custom-page__selected-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.custom-page__card-wrap {
  width: calc(50% - 6px);
}

.custom-page__topics {
  padding: 12px 16px;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.custom-page__topic-wrap {
  width: calc(50% - 6px);
}

.custom-page__topic-wrap--full {
  width: 100%;
}

.custom-page__scroll {
  flex: 1;
  height: calc(100vh - 200px);
}

.custom-page__point {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #f0f0f0;
}

.custom-page__point:active {
  opacity: 0.85;
}

.custom-page__point-name {
  flex: 1;
  font-size: 14px;
  color: #666;
  padding-right: 8px;
}

.custom-page__point-ctrl {
  display: flex;
  align-items: center;
  gap: 8px;
}

.custom-page__btn {
  width: 28px;
  height: 28px;
  line-height: 26px;
  text-align: center;
  border-radius: var(--card-radius-sm);
  background: #f5f6fa;
  font-size: 18px;
  color: var(--purple);
}

.custom-page__btn--disabled {
  opacity: 0.35;
  pointer-events: none;
}

.custom-page__count {
  min-width: 20px;
  text-align: center;
  font-size: 14px;
}

.custom-page__fab {
  position: fixed;
  right: 20px;
  bottom: 20px;
  z-index: 90;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.custom-page__fab-btn {
  padding: 12px 20px;
  border-radius: 999px;
  color: #fff;
  font-size: 15px;
  text-align: center;
  box-shadow: var(--shadow-modal);
}

.custom-page__fab-btn--orange {
  background: var(--orange);
}

.custom-page__fab-btn--purple {
  background: var(--purple);
}

.custom-page__fab-btn--disabled {
  opacity: 0.5;
  pointer-events: none;
}
</style>
