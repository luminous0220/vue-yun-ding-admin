import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const pinia = createPinia()

// pinia 持久化存储
pinia.use(piniaPluginPersistedstate)

export default pinia

export * from './modules/auth'
export * from './modules/global'
export * from './modules/tab'
export * from './modules/keepAlive'