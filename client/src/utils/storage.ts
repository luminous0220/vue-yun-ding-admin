/**
 * @description 存储本地数据
 * @param k 键名
 * @param v 键值
 */
export const setLocal = <T>(k: string, v: T) => {
  window.localStorage.setItem(k, JSON.stringify(v))
}

/**
 * @description 获取本地数据
 * @param k 键名
 */
export const getLocal = (k: string) => {
  const item = window.localStorage.getItem(k)
  return item ? JSON.parse(item) : item
}

/**
 * @description 存储临时会话数据
 * @param k 键名
 * @param v 键值（无需stringiiy）
 */
export const setSession = <T>(k: string, v: T) => {
  window.sessionStorage.setItem(k, JSON.stringify(v))
}

/**
 * @description 获取临时会话数据
 * @returns any
 */
export const getSession: (k: string) => any = (k: string) => {
  const item = window.sessionStorage.getItem(k)
  return item ? JSON.parse(item) : item
}