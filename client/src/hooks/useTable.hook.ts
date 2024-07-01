import { handleExport } from '@/utils'

/**
 * @description 表格相关操作hooks函数
 * @param reqApi 请求函数
 * @param initParam 初始化参数
 * @param isPageable 是否需要分页
 * @param callBack 回调函数
 * @param exportRequestFn 导出函数
 */
export const useTable = <ItemType extends Object>(
  reqApi?: Function,
  initParam: { [key: string]: any } = {},
  isPageable = true,
  callBack?: Function,
  exportRequestFn?: Function
) => {
  // 是否是首次加载
  let first = true

  // 缓存参数
  const cacheParams: any = {}

  // 加载态
  const loading = ref(false)

  // 分页参数
  const pageParam = reactive({
    pageNumber: 1,
    pageSize: 10,
    total: 0
  })

  // 列表
  const list = ref<ItemType[]>([])

  // 查询参数(只包括查询)
  const searchParam = ref<{ [key: string]: any }>({})

  // 总参数
  const totalParam = ref({})

  /**
   * @description 发送请求，加载数据
   * @param pageNumber 当前页
   */
  const loadData = async () => {
    // 设置加载中
    if (!reqApi) return

    // 第一次加载的时候将表单的参数缓存下来，重置的时候需要还原
    if (first) {
      Object.assign(cacheParams, searchParam.value)
      first = false
    }

    loading.value = true
    try {
      // 筛选掉查询参数中值为空的字段
      for (let key in searchParam.value) {
        if (searchParam.value[key] === '') {
          delete searchParam.value[key]
        }
      }

      // 聚合查询参数
      Object.assign(totalParam.value, initParam, searchParam.value, isPageable ? pageParam : {})

      // 发送请求
      let res = await reqApi(totalParam.value)
      let { data } = res
      // 回调处理请求结果
      if (callBack) {
        list.value = callBack(res)
      } else {
        list.value = data.list
      }
      pageParam.total = data.total || 0
    } catch (error) {
      console.error(error)
    } finally {
      // 关闭加载中
      nextTick(() => {
        loading.value = false
      })
    }
  }

  /**
   * @description 搜索
   */
  const search = () => {
    if (
      Object.values(searchParam.value).every((val) => {
        return val === '' ? true : false
      })
    ) {
      window.$message.warning({ message: '查询输入不能全为空' })
      return
    }

    // 若pageNumber不为1，则将pageNumber重置为1
    if (pageParam.pageNumber !== 1) {
      pageParam.pageNumber = 1
      // 在这里return，避免多次调用loadData
      return
    }
    loadData()
  }

  /**
   * @description 重置数据
   */
  const reset = () => {
    for (let key in searchParam.value) {
      searchParam.value[key] = cacheParams[key]
    }
    totalParam.value = {}
    loadData()
  }

  /**
   * @description 导出功能
   */
  const exportFile = async () => {
    try {
      if (!exportRequestFn) {
        throw new Error('当前没有提供exportRequestFn函数')
      }
      if (typeof exportRequestFn !== 'function') {
        throw new Error('exportRequestFn必须是一个函数')
      }
      // 导出
      await handleExport(exportRequestFn, totalParam.value)
      window.$message.error({ message: '导出成功' })
    } catch (error) {
      console.error(error)
    }
  }

  // 监听分页数据改变
  watch(
    () => [pageParam.pageNumber, pageParam.pageSize],
    () => {
      loadData()
    }
  )

  return {
    loading,
    pageParam,
    list,
    searchParam,
    loadData,
    reset,
    search,
    exportFile
  }
}
