import { USER_SEX } from '@/constants'
import { ROLE_TYPE } from '@/constants'

export namespace IUser {
  export interface Item {
    id: number
    email: string
    username: string
    nickname: string
    status: number
    sex: USER_SEX
    birthday: string
    avatar: string
    sign: string
    roles: {
      id: number
      flag: string
      name: string
      desc: string
    }[]
    createdAt: string
    updatedAt: string
  }

  export interface IGetParams {
    username: string
    email: string
    startTime: string
    endTime: string
    current: number
    pageSize: number
  }

  export interface ICreateParams {
    email: string
    password: string
    username: string
    nickname: string
    sex: USER_SEX
    birthday: string
    avatar: string
    sign: string
    roles: string[]
  }
}

export namespace IRole {
  export interface Item {
    id: number
    flag: string
    name: string
    desc: string
    type: ROLE_TYPE
    createdAt: string
    updatedAt: string
  }
  export interface ICreateParams {
    name: string
    desc: string
    flag: string
  }
  export interface IUpdateParams extends ICreateParams {}
}
