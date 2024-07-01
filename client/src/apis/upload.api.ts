import { http } from '@/plugins'

/**
 * @description 新增用户
 */
const uploadImage = (params: any) => {
  return http.post({
    url: `/api/upload/image`,
    params,
    config: {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
  })
}

export const UploadApi = {
  uploadImage
}
