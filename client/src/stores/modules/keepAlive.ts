import { defineStore } from 'pinia'

export interface KeepAliveState {
  keepAliveName: string[]
}

export const useKeepAliveStore = defineStore({
  id: 'KeepAliveStore',
  state: (): KeepAliveState => ({
    keepAliveName: []
  }),
  actions: {
    /**
     * @description 添加需缓存的页面
     */
    async addKeepAliveName(name: string) {
      !this.keepAliveName.includes(name) && this.keepAliveName.push(name)
    },
    /**
     * @description 移除需缓存的页面
     */
    async removeKeepAliveName(name: string) {
      this.keepAliveName = this.keepAliveName.filter((item) => item !== name)
    },
    async setKeepAliveName(keepAliveName: string[] = []) {
      this.keepAliveName = keepAliveName
    }
  }
})
