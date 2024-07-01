import { http } from '@/plugins'

interface ICommon {
  startTime?: Date
  endTime?: Date
  current?: number
  pageSize?: number
}

interface IUsersExcleParams extends ICommon {
  username?: string
  email?: string
}

/**
 * @description 导出角色列表excle文件
 */
const rolesExcle = () => {
  return http.get({
    url: `/api/download/rolesExcle`,
    config: { responseType: 'blob' }
  })
}

/**
 * @description 导出用户列表的Excle文件
 */
const usersExcle = (params: IUsersExcleParams) => {
  return http.get({
    url: `/api/download/usersExcle`,
    params,
    config: { responseType: 'blob' }
  })
}

/**
 * @description 导出用户批量上传的Excle模版文件
 */
const userTmlExcle = (params: IUsersExcleParams) => {
  return http.get({
    url: `/api/download/usersUploadTml`,
    params,
    config: { responseType: 'blob' }
  })
}

export const ExportApi = {
  rolesExcle,
  usersExcle,
  userTmlExcle
}
