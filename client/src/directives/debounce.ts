import { DirectiveBinding } from 'vue'

let params: any = {}

const handle = () => {
  const { el, binding } = params
  if (!el.disabled) {
    el.disabled = true
    setTimeout(() => {
      el.disabled = false
    }, binding.value || 1500)
  }
}

export const debounceDirective = {
  mounted(el: any, binding: DirectiveBinding) {
    //@ts-ignore
    params = { el, binding }
    el.addEventListener('click', handle, false)
  },
  unmounted(el: any) {
    el.removeEventListener('click', handle, false)
  }
}
