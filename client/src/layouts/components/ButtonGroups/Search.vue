<template>
  <div class="search header-icon cursor-pointer" @click="handleOpen">
    <el-icon>
      <i-carbon-search />
    </el-icon>

    <el-dialog
      class="search-dialog lt-sm:w-70%!"
      v-model="visiable"
      @open="_visiable = true"
      @close="_visiable = false">
      <el-autocomplete
        v-if="_visiable"
        v-model="state"
        ref="searchInputRef"
        :fetch-suggestions="querySearch"
        placeholder="搜索菜单（支持菜单名、路径）"
        @select="handleSelect"
        @click.stop>
        <template #suffix>
          <el-icon>
            <Search />
          </el-icon>
        </template>
        <template #default="{ item }">
          <div class="flex items-center">
            <el-icon class="el-input__icon mr-10px">
              <Icon :icon="item.icon" />
            </el-icon>
            <div class="value">{{ item.title }}</div>
          </div>
        </template>
      </el-autocomplete>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores'
import { IMenu } from '@/apis'
import { navigateByPath } from '@/utils'
import { Icon } from '@iconify/vue'
const authStore = useAuthStore()

const visiable = ref(false)
const _visiable = ref(false)
const state = ref('')
const searchInputRef = ref()
const menuList = computed(() =>
  authStore.flatAuthMenuListGet.filter((ite) => {
    return ite.status == 1 && ite.parentId
  })
)

const querySearch = (queryString: string, cb: any) => {
  const results = queryString
    ? menuList.value.filter((ite) => {
        return ite.name.indexOf(queryString) != -1 || ite.path.indexOf(queryString) != -1
      })
    : menuList.value
  cb(results)
}

const handleSelect = (item: IMenu.Item | Record<string, any>) => {
  navigateByPath(item.path)
  visiable.value = false
}

const handleOpen = () => {
  visiable.value = true
  nextTick(() => {
    setTimeout(() => {
      searchInputRef.value.focus()
    }, 200)
  })
}
</script>

<style scoped lang="scss">
.search {
  :deep(.el-dialog) {
    --el-dialog-width: 35%;
    --el-dialog-bg-color: transparent !important;
    padding: 0;
    .el-dialog__header {
      display: none;
    }
    .el-dialog__body {
      padding: 0;
    }
  }
  :deep(.el-autocomplete) {
    width: 100%;
  }
}
</style>
