import mitt from 'mitt'

type Events = {
  closeLoginLoading: void
  openThemeDrawer: void
}

export const emitter = mitt<Events>()
