import { http } from '@/plugins'
import { IMenu, IRole, IUser } from './index'
import { USER_STATUS } from '@/constants'

/**
 * @description 新增用户
 */
const createUser = (params: IUser.ICreateParams) => {
  return http.post({
    url: `/api/user/create`,
    params
  })
}

/**
 * @description 获取用户列表
 */
const getUserList = (params: IUser.IGetParams) => {
  return http.get<{ list: IUser.Item[]; total: number }>({
    url: `/api/user/user-list`,
    params
  })
}

/**
 * @description 重置密码
 */
const resetPassword = (id: number) => {
  return http.put({
    url: `/api/user/reset-password?id=${id}`
  })
}

/**
 * @description 删除用户
 */
const removeUser = (ids: number[]) => {
  return http.post({
    url: `/api/user`,
    params: {
      ids
    }
  })
}

/**
 * @description 更新用户状态
 */
const updateStatus = (id: number, status: USER_STATUS) => {
  return http.put({
    url: `/api/user/status`,
    params: { id, status }
  })
}

/**
 * @description 为用户赋予角色
 */
const assignRole = (id: number, roleIds: string[]) => {
  return http.post({
    url: `/api/user/assign/${id}`,
    params: { roleIds }
  })
}

/**
 * @description 获取角色列表
 */
const getRoleList = (params: { name?: string; desc?: string }) => {
  return http.get<{ list: IRole.Item[]; total: number }>({
    url: `/api/role/list`,
    params
  })
}

/**
 * @description 创建角色
 */
const createRole = (params: IRole.ICreateParams) => {
  return http.post({
    url: `/api/role`,
    params
  })
}

/**
 * @description 编辑角色
 */
const updateRole = (id: number, params: IRole.IUpdateParams) => {
  return http.put({
    url: `/api/role?id=${id}`,
    params
  })
}

/**
 * @description 删除角色
 */
const removeRole = (id: number) => {
  return http.delete({
    url: `/api/role?id=${id}`
  })
}

/**
 * @description 获取角色对应的菜单权限列表
 */
const getRoleMenu = (id: number) => {
  return http.get<IMenu.Item[]>({
    url: `/api/role/menu?id=${id}`
  })
}

/**
 * @description 为角色分配菜单权限
 */
const assignRoleMenu = (id: number, menus: number[]) => {
  return http.post<IMenu.Item[]>({
    url: `/api/role/assign/${id}`,
    params: { menus }
  })
}

/**
 * @description 新增菜单
 */
const createMenu = (params: IMenu.ICreateaParams) => {
  return http.post({
    url: `/api/menu`,
    params
  })
}

/**
 * @description 更新菜单
 */
const updateMenu = (id: number, params: IMenu.IUpdateParams) => {
  return http.put({
    url: `/api/menu?id=${id}`,
    params
  })
}

/**
 * @description 删除菜单
 */
const removeMenu = (id: number) => {
  return http.delete({
    url: `/api/menu?id=${id}`
  })
}

export const SysApi = {
  createUser,
  getUserList,
  resetPassword,
  removeUser,
  updateStatus,
  getRoleList,
  createRole,
  updateRole,
  removeRole,
  getRoleMenu,
  assignRoleMenu,
  assignRole,
  createMenu,
  updateMenu,
  removeMenu
}
