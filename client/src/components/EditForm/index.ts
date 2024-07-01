import { IFormSchema } from '../Form'
import editForm from './EditForm.vue'

export interface IEditForm<T = any> {
  // 弹窗标题
  title: string
  // 表单模型
  formSchema?: IFormSchema[]
  // 弹窗属性配置：ElDialog、ElDrawer
  attrs?: {
    [pro: string]: any
  }
  // 表单属性配置：ElForm
  formAttrs?: {
    [pro: string]: any
  }
  row: Partial<T>
}

export const EditForm = editForm
