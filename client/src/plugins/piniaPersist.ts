import { PersistedStateOptions } from 'pinia-plugin-persistedstate'

/**
 * @description 持久化本地缓存pinia（localStorage）
 * @param key 缓存数据的 name
 * @param paths 需要持久化的 state 中的属性名，不传默认缓存全部属性
 * */
export const persistLocalConfig = (key: string, paths?: string[]) => {
  const persist: PersistedStateOptions = {
    key,
    storage: window.localStorage,
    paths
  }
  return persist
}

/**
 * @description 持久化本地缓存pinia（sessionStorage）
 * @param key 缓存数据的 name
 * @param paths 需要持久化的 state 中的属性名，不传默认缓存全部属性
 * */
export const persistSessionConfig = (key: string, paths?: string[]) => {
  const persist: PersistedStateOptions = {
    key,
    storage: window.sessionStorage,
    paths
  }
  return persist
}