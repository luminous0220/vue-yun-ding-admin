import { MENU_TYPE, PASSWORD_RESET_ENUM, USER_STATUS } from '@/constants'

export namespace IMenu {
  export interface ICreateaParams {
    title: string
    path: string
    name: string
    componentPath: string
    redirect: string
    parentId: number | null
    sort: number
    permission: string
    type: MENU_TYPE
    icon: string
    status: number
    isKeepAlive: number
  }

  export interface IUpdateParams extends ICreateaParams {}

  export interface Item extends ICreateaParams {
    id: number
    createdAt: Date
    updatedAt: Date
    deletedAt: Date
    children?: Item[]
  }

  export interface IPermission {
    permission: string
    title: string
  }
}

export namespace IAuth {
  export interface IRegisterParams {
    email: string
    username: string
    password: string
    repeatPwd: string
  }

  /**
   * @description expires 单位为毫秒
   */
  export interface ITokenData {
    token: string
    refreshToken: string
    expires: number
  }

  export interface ILoginData extends ITokenData {
    userId: string
  }

  export interface IUserInfo {
    username: string
    nickname: string
    sex: number
    age: number
    phone: string
    email: string
    avatar: string
    sign: string
    birthday: string
    status: USER_STATUS
  }

  export interface IUpdateUserParams {
    nickname: string
    sex: number
    age: number | null
    phone: string
    sign: string
    birthday: string
  }
  export interface IUpdatePwdParams {
    email?: string
    code?: string
    codeId?: number
    newPwd: string
    repeatPwd: string
    oldPwd?: string
    type: PASSWORD_RESET_ENUM // 类型（1：通过旧密码修改；2通过邮箱修改）
  }
}
