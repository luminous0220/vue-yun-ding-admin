import { FormItemRule } from 'element-plus'
import basicForm from './BasicForm.vue'

type IElType = 'input' | 'input-number' | 'select' | 'radio' | 'tree-select' | 'switch' | 'date'

export interface IFormSchema {
  el?: IElType
  prop: string
  label: string
  default?: string | number | Date | boolean
  attrs?: Partial<{
    placeholder: string
    type: string
    format: string
    rangeSeparator: string
    startPlaceholder: string
    endPlaceholder: string
    inlinePrompt: boolean
    activeValue: number | string | boolean
    inactiveValue: number | string | boolean
    activeText: string
    inactiveText: string
    [pro: string]: any
  }>
  options?: { value?: any; label?: any; [pro: string]: any }[]
  rule?: FormItemRule[]
  render?: () => VNode | string
}

export const BasicForm = basicForm
