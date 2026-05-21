<template>
  <view class="recommend">
    <NavBar title="系统推荐习题" :show-back="true" @back="onNavBack">
      <template #right>
        <view class="recommend__switch">
          <text class="recommend__switch-label">乱序出题</text>
          <switch
            :checked="store.randomOrder"
            color="#6c5ce7"
            @change="onRandomChange"
          />
        </view>
      </template>
    </NavBar>

    <view class="recommend__tags">
      <Tag
        v-for="p in store.selectedPoints"
        :key="p.id"
        :label="p.name"
        selected
        show-delete
        @delete="onRemoveTag(p.id)"
      />
    </view>

    <view class="recommend__topics">
      <view
        v-for="topic in topics"
        :key="topic.id"
        class="recommend__topic-wrap"
        :class="topicWrapCls(topic.id)"
      >
        <Accordion
          :title="topic.name"
          :expanded="expandedTopicId === topic.id"
          :show-select-all="false"
          body-height="600px"
          @toggle="toggleTopic(topic.id)"
        >
          <view
            v-for="point in topic.children"
            :key="point.id"
            class="recommend__point"
            :class="pointSelectedCls(point.id)"
            @click="onTogglePoint(point)"
          >
            <text>{{ point.name }}</text>
          </view>
        </Accordion>
      </view>
    </view>

    <view class="recommend__fab">
      <view
        class="recommend__fab-btn recommend__fab-btn--orange"
        :class="fabDisabledCls"
        @click="onReselect"
      >
        重选一批
      </view>
      <view
        class="recommend__fab-btn recommend__fab-btn--purple"
        :class="fabConfirmDisabledCls"
        @click="onConfirm"
      >
        我选好了
      </view>
    </view>

    <ConfirmModal
      :visible="confirmReselect"
      title="提示"
      content="确定要重新生成10个知识点吗？"
      @confirm="doReselect"
      @cancel="confirmReselect = false"
    />

    <VariantModal
      :visible="variantVisible"
      :selected="variantSelected"
      @select="variantSelected = $event"
      @confirm="onVariantConfirm"
      @cancel="variantVisible = false"
    />
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import NavBar from '../../components/NavBar/NavBar.vue'
import Tag from '../../components/Tag/Tag.vue'
import Accordion from '../../components/Accordion/Accordion.vue'
import ConfirmModal from '../../components/ConfirmModal/ConfirmModal.vue'
import VariantModal from '../../components/VariantModal/VariantModal.vue'
import { pointTree } from '@/config/points.js'
import { useSelectionStore } from '@/store/selection.js'
import { getExercises } from '@/api/index.js'
import { showToast } from '@/utils/toast.js'
import { LIMITS } from '@/utils/limits.js'

const store = useSelectionStore()
const topics = computed(() =>
  pointTree.map((topic) => ({
    ...topic,
    children: topic.children.map((p) => ({
      ...p,
      topicId: topic.id,
      topicName: topic.name
    }))
  }))
)
const expandedTopicId = ref(null)
const confirmReselect = ref(false)
const variantVisible = ref(false)
const variantSelected = ref(0)
const btnDisabled = ref(false)
const isFirstLoad = ref(true)

const topicWrapCls = (topicId) =>
  expandedTopicId.value === topicId ? 'recommend__topic-wrap--full' : ''
const pointSelectedCls = (pointId) =>
  store.isPointSelected(pointId) ? 'recommend__point--selected' : ''
const fabDisabledCls = computed(() => (btnDisabled.value ? 'recommend__fab-btn--disabled' : ''))
const fabConfirmDisabledCls = computed(() =>
  btnDisabled.value || !store.canConfirm ? 'recommend__fab-btn--disabled' : ''
)

const guard = (fn) => {
  if (btnDisabled.value) return
  btnDisabled.value = true
  fn()
  setTimeout(() => {
    btnDisabled.value = false
  }, 1500)
}

const initPage = async () => {
  await store.initRecommendPoints()
}

onMounted(async () => {
  if (store.mode !== 'recommend') {
    uni.redirectTo({ url: '/pages/index/index' })
    return
  }
  if (store.selectedPoints.length === 0) {
    await initPage()
  }
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

const onRemoveTag = async (pointId) => {
  await store.deselectAndSupplement(pointId)
}

const onTogglePoint = async (point) => {
  if (store.isPointSelected(point.id)) {
    await store.deselectAndSupplement(point.id)
  } else if (store.selectedPoints.length < LIMITS.RECOMMEND_POINT_COUNT) {
    store.addPoint({
      id: point.id,
      name: point.name,
      topicId: point.topicId,
      topicName: point.topicName,
      difficulty: point.difficulty,
      count: 1
    })
  } else {
    showToast('已选满10个知识点，请先取消一个')
  }
}

const onReselect = () => {
  guard(() => {
    confirmReselect.value = true
  })
}

const doReselect = async () => {
  confirmReselect.value = false
  store.clearSelection(false)
  await initPage()
}

const onConfirm = () => {
  guard(() => {
    if (!store.hasSelection) {
      showToast('请至少选择1道题目')
      return
    }
    variantSelected.value = store.variantCount
    variantVisible.value = true
  })
}

const onVariantConfirm = async () => {
  variantVisible.value = false
  const variant = variantSelected.value
  if (!store.applyRecommendVariantCounts(variant)) {
    showToast('推荐模式最多' + LIMITS.RECOMMEND_MAX_TOTAL + '道题')
    return
  }

  const res = await getExercises({
    mode: 'recommend',
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
}
</script>

<style lang="scss" scoped>
.recommend {
  min-height: 100vh;
  padding-bottom: 140px;
}

.recommend__switch {
  display: flex;
  align-items: center;
  gap: 4px;
}

.recommend__switch-label {
  font-size: 12px;
  color: #666;
}

.recommend__tags {
  padding: 12px 16px;
  display: flex;
  flex-wrap: wrap;
}

.recommend__topics {
  padding: 0 16px;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.recommend__topic-wrap {
  width: calc(50% - 6px);
}

.recommend__topic-wrap--full {
  width: 100%;
}

.recommend__point {
  padding: 10px 0;
  font-size: 14px;
  color: #666;
  border-bottom: 1px solid #f0f0f0;
}

.recommend__point:active {
  opacity: 0.85;
}

.recommend__point--selected {
  color: var(--purple);
  font-weight: 500;
}

.recommend__fab {
  position: fixed;
  right: 20px;
  bottom: 20px;
  z-index: 90;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.recommend__fab-btn {
  padding: 12px 20px;
  border-radius: 999px;
  color: #fff;
  font-size: 15px;
  text-align: center;
  box-shadow: var(--shadow-modal);
}

.recommend__fab-btn--orange {
  background: var(--orange);
}

.recommend__fab-btn--purple {
  background: var(--purple);
}

.recommend__fab-btn--disabled {
  opacity: 0.5;
  pointer-events: none;
}
</style>
