import { TableColumnCtx } from 'element-plus'
import { IFormSchema } from '@/components/Form'
import basicTable from './BasicTable.vue'

export type IColType = 'index' | 'selection' | 'expand' | 'children'

export type IRenderScope<T> = {
  row: T
  $index: number
  column: TableColumnCtx<T>
  [key: string]: any
}

export interface IColumns<T = any>
  extends Partial<Omit<TableColumnCtx<T>, 'type' | 'children' | 'renderCell'>> {
  type?: IColType // 列类型
  tag?: boolean | Ref<boolean> // 是否是标签展示
  render?: (scope: IRenderScope<T>) => VNode | string | number // 自定义单元格内容渲染（render函数）
  isShow?: boolean // 控制显示隐藏
  children?: IColumns[]
}

export type IToolBtnKey = 'refresh' | 'setting'

export interface ICols {
  xs?: number
  sm?: number
  md?: number
  lg?: number
  xl?: number
}

export interface ITableProps<T = any> {
  columns: IColumns<T>[]
  data?: any[] // 表格静态数据，如果存在则不会调用 reqApi 返回的data
  reqApi?: (params: any) => Promise<any> // 请求表格数据的 api
  exportApi?: (params: any) => any // 导出函数API
  reqAuto?: boolean // 是否自动执行 reqApi 请求（默认为true）
  initParam?: object
  toolButton?: boolean | Array<IToolBtnKey> //
  cols?: ICols // 栅栏设置
  gutter?: number // 表单间距
  callBack?: Function
  isPageable?: boolean
  searchForm?: IFormSchema[] // 查询表单的配置对象
}

export const BasicTable = basicTable
