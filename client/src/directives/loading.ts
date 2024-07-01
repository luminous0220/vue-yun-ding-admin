import { DirectiveBinding, Transition, createApp, defineComponent, h } from 'vue'
import Loading from '@/components/Loading/Loading.vue'

// 根节点
const root = window.document.documentElement

//自定义组件，为 Loading 组件加上一层 Transition，使用该方式是为了搭配visiable变量进行显隐控制
const loadingWrap = defineComponent({
  setup(props, { expose }) {
    // 控制显示隐藏
    const visiable = ref(true)
    // 加载文字，（支持html）
    const text = ref('')
    expose({
      visiable,
      text
    })
    return () =>
      h(
        Transition,
        { name: 'fade', appear: true },
        {
          default: () => {
            return [visiable.value ? h(Loading, { text: text.value }) : h('span')]
          }
        }
      )
  }
})

export const loadingDirective = {
  mounted(el: any, binding: DirectiveBinding) {
    // 创建 app 实例（使用单例的方式）
    const app = createApp(loadingWrap)
    // 创建div标签,将实例挂载到div标签上
    const instance = app.mount(document.createElement('div'))
    // 把instance和app赋在el上，方便数据传递
    el.instance = instance
    el.app = app
    // 各种修饰符
    const { arg, value, modifiers } = binding
    el.instance.text = arg ?? '加载中...'
    value && appendEl(el, modifiers.full)
  },
  updated(el: any, binding: DirectiveBinding) {
    const { value, oldValue, modifiers } = binding
    if (value !== oldValue) {
      value ? appendEl(el, modifiers.full) : (el.instance.visiable = false)
    }
  },
  beforeUnmount(el: any) {
    el.app.unmount()
  }
}

// 挂载
const appendEl = (el: any, isFull: boolean) => {
  // 每次挂载时都要将visiable置为true
  el.instance.visiable = true
  // isFull修饰表示全屏，将组件挂载到根节点上
  if (isFull) {
    root.appendChild(el.instance.$el)
    return
  }
  el.style.position = 'relative'
  el?.appendChild(el.instance.$el)
}
