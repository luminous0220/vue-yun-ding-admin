import { defineStore } from 'pinia'
import { AuthApi, type IMenu } from '@/apis'
import { IsEmail, filterAuthMenuList, flatMenuRoutes, setToken } from '@/utils'
import { MD5 } from 'crypto-js'
import { MENU_TYPE, USER_STATUS } from '@/constants'
export interface IAuthState {
  user: {
    username: string
    nickname: string
    sex: number
    email: string
    avatar: string
    age: number | null
    phone: string
    sign: string
    birthday: string
    status: USER_STATUS
  }
  roles: Array<string>
  permissions: Array<IMenu.IPermission>
  authMenuList: Array<IMenu.Item>
}

export const useAuthStore = defineStore({
  id: 'Authstore',
  state: (): IAuthState => {
    return {
      user: {
        username: '',
        nickname: '',
        sex: 1,
        email: '',
        avatar: '',
        sign: '',
        age: null,
        phone: '',
        birthday: '',
        status: 1
      },
      roles: [],
      permissions: [],
      authMenuList: []
    }
  },
  actions: {
    /**
     * @description 密码登录
     */
    async login(account: string, password: string) {
      const params = {
        email: '',
        username: '',
        password: MD5(password).toString()
      }
      // 检查是否输入了邮箱
      if (IsEmail(account)) {
        params.email = account
      } else {
        params.username = account
      }
      const res = await AuthApi.login(params)
      await setToken(res.data)
    },
    /**
     * @description 短信登录
     */
    async smsLogin(params: { mobile: string; code: string }) {
      const res = await AuthApi.smsLogin(params)
      await setToken(res.data)
    },

    /**
     * @description 获取用户信息
     */
    async getUserInfo() {
      const res = await AuthApi.getUserInfo()
      Object.assign(this.user, res.data)
    },
    /**
     * @description 获取用户权限
     */
    async getPermission() {
      // 按钮权限
      const { data: btnPermissions } = await AuthApi.getUserBtnPermissions()
      this.permissions = btnPermissions
      // 菜单权限
      const { data: menuList } = await AuthApi.getAuthMenuList()
      this.authMenuList = filterAuthMenuList(menuList)
    }
  },
  getters: {
    /**
     * @description 获取扁平化后的路由菜单数组(过滤掉type为2的按钮权限数组)
     */
    flatAuthMenuListGet: (state) => {
      return flatMenuRoutes(state.authMenuList).filter((ite) => ite.type != MENU_TYPE.B)
    }
  }
})
