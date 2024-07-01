<template>
  <div
    class="tabs flex-align-center justify-between pr-20px select-none transition-primarymary h-50px lt-sm:pr-5px!">
    <div class="overflow-auto">
      <!-- tab栏 -->
      <el-tabs
        type="card"
        class="transition-primarymary"
        v-model="activeName"
        @tab-click="handleClick"
        @tab-remove="handleRemove"
        @contextmenu.prevent.stop="preventRightClick">
        <el-tab-pane
          :label="item.title"
          :name="item.path"
          v-for="item in tabsMenuList"
          :key="item.path"
          :closable="item.close">
          <template #label>
            <div class="wrap" @contextmenu.prevent.stop="rightClick($event, item)">
              <el-icon class="mr-10px">
                <Icon :icon="item.icon" />
              </el-icon>
              <div>{{ item.title }}</div>
            </div>
          </template>
        </el-tab-pane>
      </el-tabs>
    </div>
    <!-- 更多 -->
    <tab-ctr class="ml-12" />

    <!-- 右键tab栏popover -->
    <el-dropdown
      ref="dropdown1"
      :teleported="false"
      class="right-click-menu"
      trigger="click"
      v-if="!globalStore.isMobile">
      <span></span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item @click="refresh(tempTab)">
            <el-icon><i-ep-refresh /></el-icon>刷新页面
          </el-dropdown-item>
          <el-dropdown-item divided @click="closeTab(tempTab)">
            <el-icon><i-ep-remove /></el-icon>关闭页面
          </el-dropdown-item>
          <el-dropdown-item @click="closeOtherTab(tempTab)">
            <el-icon><i-ep-circle-close /></el-icon>关闭其它页面
          </el-dropdown-item>
          <el-dropdown-item @click="closeAllTab">
            <el-icon><i-ep-folder-delete /></el-icon>关闭所有页面
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script setup lang="ts">
import TabCtr from './components/TabCtr.vue'
import { useTabCtr } from '@/hooks'
import type { TabsPaneContext, TabPaneName, DropdownInstance } from 'element-plus'
import { useRoute } from 'vue-router'
import {
  useTabsStore,
  useAuthStore,
  useKeepAliveStore,
  ITabsMenuProps,
  useGlobalStore
} from '@/stores'
import { navigateByPath } from '@/utils'
import { CFG } from '@/config'
import { Icon } from '@iconify/vue'

const tabStore = useTabsStore()
const authStore = useAuthStore()
const globalStore = useGlobalStore()
const keepAliveStore = useKeepAliveStore()
const route = useRoute()
const { refresh, closeTab, closeOtherTab, closeAllTab } = useTabCtr()

onMounted(() => {
  initTabs()
})

const activeName = ref(route.fullPath)
const tabsMenuList = computed(() => tabStore.tabsMenuList)

const handleClick = (tab: TabsPaneContext) => {
  const fullPath = tab.props.name as string
  navigateByPath(fullPath)
}

// 初始化需要固定的标签
const initTabs = () => {
  authStore.flatAuthMenuListGet.forEach((item) => {
    if (!item.status) {
      const tabsParams = {
        icon: item.icon,
        title: item.name,
        path: item.path,
        name: item.name,
        close: true
      }
      tabStore.addTab(tabsParams)
    }
  })
}

const dropdown1 = ref<DropdownInstance>()
const _top = ref('')
const _left = ref('')
let tempTab = reactive({}) as ITabsMenuProps

// 右键点击弹出菜单
const rightClick = (e: MouseEvent, item: ITabsMenuProps) => {
  if (!dropdown1.value) return
  let { clientX, clientY } = e
  _top.value = clientY + 15 + 'px'
  _left.value = clientX + 'px'
  tempTab = item
  dropdown1.value.handleOpen()
}

// 优化体验，阻止右键点击tab标签时的默认行为
const preventRightClick = () => {
  return
}

// 移除标签
const handleRemove = (fullPath: TabPaneName) => {
  const name = tabStore.tabsMenuList.filter((item) => item.path == fullPath)[0].name || ''
  keepAliveStore.removeKeepAliveName(name)
  tabStore.removeTab(fullPath as string, route.fullPath)
}

watch(
  () => route.fullPath,
  () => {
    activeName.value = route.fullPath
    const tabsParams = {
      icon: route.meta.icon as string,
      title: route.meta.title as string,
      path: route.fullPath,
      name: route.name as string,
      close: route.path === CFG.HOME_ROUTE ? false : true
    }
    tabStore.addTab(tabsParams)
    if (route.meta.isKeepAlive) {
      keepAliveStore.addKeepAliveName(route.name as string)
    }
  },
  { immediate: true }
)
</script>

<style scoped lang="scss">
::-webkit-scrollbar {
  height: 2px;
}

.tabs {
  background-color: var(--header-bg);
  color: var(--text-primary);
}
:deep(.el-tabs) {
  .el-tabs__header {
    margin: 0;
  }
  .el-tabs__nav-wrap {
    .el-tabs__nav {
      border: none !important;
      .el-tabs__item {
        border-left: none;
        transition: border linear 0.2s;
        border-bottom-width: 2px;
        &.is-active {
          border-bottom: 2px solid var(--el-color-primary);
        }
        &.is-closable {
          padding-left: 12px !important;
          padding-right: 12px !important;
        }
      }

      .wrap {
        display: flex;
        height: 100%;
        width: 100%;
        align-items: center;
      }
    }
  }
}

.right-click-menu {
  position: absolute;
  top: v-bind(_top);
  left: v-bind(_left);
}
</style>
