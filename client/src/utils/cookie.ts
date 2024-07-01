import Cookies from 'js-cookie'
import { type IAuth } from '@/apis'
import { CFG } from '@/config'

/**
 * @description 设置 token，存储Cookie（设置有效期）
 * @param data
 */
export const setToken = (data: IAuth.ITokenData) => {
  const { token, refreshToken, expires } = data
  const cookieStr = JSON.stringify({ token, refreshToken })
  // 后端返回的expires是毫秒，需要转换为 Date 类型
  Cookies.set(CFG.TOKEN_KEY, cookieStr, { expires })
}

/**
 * @description 获取 token
 */
export const getToken = (): IAuth.ITokenData | undefined => {
  return Cookies.get(CFG.TOKEN_KEY) ? JSON.parse(Cookies.get(CFG.TOKEN_KEY)!) : undefined
}

/**
 * @description 移除 token，清除 sessionStorage
 */
export function removeToken() {
  Cookies.remove(CFG.TOKEN_KEY)
  window.sessionStorage.clear()
}
