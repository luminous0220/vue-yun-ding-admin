import { http } from '@/plugins'
import { IAuth, IMenu } from './index'
import { getToken } from '@/utils'

/**
 * @description 密码注册
 */
const register = (params: IAuth.IRegisterParams) => {
  return http.post({
    url: `/api/auth/register`,
    params,
    config: {
      noToken: true
    }
  })
}

/**
 * @description 密码登录
 */
const login = (params: { email: string; username: string; password: string }) => {
  return http.post<IAuth.ILoginData>({
    url: `/api/auth/login`,
    params,
    config: {
      noToken: true
    }
  })
}

/**
 * @description 修改密码
 */
const updatePwd = (params: IAuth.IUpdatePwdParams) => {
  return http.put({
    url: `/api/auth/update-password`,
    params
  })
}

/**
 * @description 发送邮箱验证码
 */
const sendEmailCode = (params: { email: string; type: 1 | 2 }) => {
  return http.post<{ codeId: number }>({
    url: `/api/verify/email`,
    params
  })
}

/**
 * @description 发送短信验证码
 */
const sendSmsCode = (mobile: string) => {
  return http.post({
    url: `/api/auth/sms-code`,
    params: { mobile },
    config: {
      noToken: true
    }
  })
}

/**
 * @description 短信验证码登录
 */
const smsLogin = (params: { mobile: string; code: string }) => {
  return http.post<IAuth.ILoginData>({
    url: `/api/auth/sms-login`,
    params,
    config: {
      noToken: true
    }
  })
}

/**
 * @description 获取用个人信息
 */
const getUserInfo = () => {
  return http.get<IAuth.IUserInfo>({
    url: `/api/auth/user-info`
  })
}
/**
 * @description 更新个人信息
 */
const updateUserInfo = (params: IAuth.IUpdateUserParams) => {
  return http.put<IAuth.IUserInfo>({
    url: `/api/auth/user-info`,
    params
  })
}

/**
 * @description 获取个人按钮权限
 */
const getUserBtnPermissions = () => {
  return http.get<IMenu.IPermission[]>({
    url: `/api/menu/btn-permissions`
  })
}

/**
 * @description 获取个人菜单权限
 */
const getAuthMenuList = (params?: { title: string }) => {
  return http.get<IMenu.Item[]>({
    url: `/api/menu/auth-list`,
    params
  })
}

/**
 * @description 获取所有菜单
 */
const getMenuList = (params?: { title: string }) => {
  return http.get<IMenu.Item[]>({
    url: `/api/menu/list`,
    params
  })
}

/**
 * @description 刷新token
 */
const refreshToken = () => {
  const refreshToken = getToken()?.refreshToken
  return http.post<IAuth.ITokenData>({
    url: `/api/auth/refresh-token`,
    config: {
      noToken: true,
      headers: {
        Authorization: 'Bearer ' + refreshToken
      }
    }
  })
}

export const AuthApi = {
  register,
  login,
  smsLogin,
  refreshToken,
  getUserInfo,
  sendSmsCode,
  getAuthMenuList,
  getMenuList,
  getUserBtnPermissions,
  updateUserInfo,
  updatePwd,
  sendEmailCode
}
