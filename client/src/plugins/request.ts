import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig
} from 'axios'
import { CFG } from '@/config'
import { endFullLoading } from '@/plugins'
import { HTTP_STATUS } from '@/constants'
import router from '@/router'
import { getToken, removeToken, setToken } from '@/utils'
import { AuthApi } from '@/apis'

export interface IHttpRequestConfig extends InternalAxiosRequestConfig {
  noToken?: boolean
}

interface IConfig extends AxiosRequestConfig {
  noToken?: boolean
}

interface IReqParams {
  url: string
  params?: object
  config?: IConfig
}

interface IRes<T = any> {
  code: number
  message: string
  data: T
}

// * 基础配置
const DEFAULT_CONFIG = {
  baseURL: import.meta.env.VITE_BASE_URL as string,
  timeout: CFG.AXIOS_TIME_OUT as number,
  withCredential: true,
  headers: {
    Accept: 'application/json, text/plain, */*',
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  }
}

// * 创建axios实例的类
class RequestHttp {
  // * Axios实例
  private requestServer: AxiosInstance

  constructor(config: AxiosRequestConfig) {
    this.requestServer = axios.create(config)

    // 请求拦截器
    this.requestServer.interceptors.request.use(
      async (confi: IHttpRequestConfig) => {
        const { headers, noToken } = confi

        // 如果是白名单里的请求url，则不需要 token
        if (noToken) {
          return confi
        }

        const cookieData = getToken()
        headers.setAuthorization('Bearer ' + cookieData?.token)
        return confi
      },
      (error: AxiosError) => {
        endFullLoading()
        return Promise.reject(error)
      }
    )

    // 响应拦截器
    this.requestServer.interceptors.response.use(
      async (interRes: AxiosResponse) => {
        endFullLoading()
        const { data, status } = interRes
        // 全局错误信息拦截
        if (status && status !== HTTP_STATUS.SUCCESS) {
          window.$notice.error({ message: data.msg })
          return Promise.reject(data)
        }

        // 文件下载直接返回interRes
        if (data.constructor === Blob) return interRes

        return data
      },
      async (error: AxiosError<{ code: string; message: string } | any>) => {
        const { response, config } = error

        // 下载文件出错时的提示
        if (response?.data.type == 'application/json') {
          const reader = new FileReader() //创建一个FileReader实例
          reader.readAsText(response?.data, 'utf-8') //读取文件,结果用字符串形式表示

          reader.onload = function () {
            //读取完成后,**获取reader.result**
            const { message } = JSON.parse(reader.result as string)
            window.$notice.error({ message })
          }
          return Promise.reject(response)
        }

        // 如果refresh-token也返回401，则抛出错误
        if (response?.status === HTTP_STATUS.OVERDUE && config?.url?.includes('refresh-token')) {
          return Promise.reject(new Error('登录已过期，请重新登录'))
        }
        if (response?.status === HTTP_STATUS.OVERDUE) {
          // 登录失效，重新获取 token
          try {
            let res = await AuthApi.refreshToken()

            removeToken()
            // 设置新的token
            setToken(res.data)

            const { url, method, params, data: configData } = config!
            // 执行之前失败的请求
            if (method === 'get') {
              return this.get({ url: url!, params, config })
            } else if (method === 'post') {
              return this.post({ url: url!, params: configData, config })
            }
          } catch (error: any) {
            if (error.data?.message) window.$notice.error({ message: error.data.message })
            // 刷新token失败，则清空数据，返回登录页

            endFullLoading()
            removeToken()
            router.replace(CFG.LOGIN_ROUTE)
            return Promise.reject(error)
          }
        }
        endFullLoading()
        // 请求超时 && 网络错误单独判断，没有 response
        if (error.message.includes('timeout')) {
          window.$notice.error({ message: '网络请求超时，请您重试' })
          return Promise.reject(response)
        }
        if (!window.navigator.onLine) {
          window.$notice.error({ message: '网络错误，请检查网络' })
          return Promise.reject(response)
        }

        if (response?.data) {
          window.$notice.error({ message: response.data.message })
          return Promise.reject(response)
        }

        return Promise.reject(response)
      }
    )
  }

  get<T>(p: IReqParams): Promise<IRes<T>> {
    const { url, params, config } = p
    return this.requestServer.get(url, { params, ...config })
  }
  post<T>(p: IReqParams): Promise<IRes<T>> {
    const { url, params, config } = p
    return this.requestServer.post(url, params, config)
  }
  put<T>(p: IReqParams): Promise<IRes<T>> {
    const { url, params, config } = p
    return this.requestServer.put(url, params, config)
  }
  delete<T>(p: IReqParams): Promise<IRes<T>> {
    const { url, params, config } = p
    return this.requestServer.delete(url, { params, ...config })
  }
}

export const http = new RequestHttp(DEFAULT_CONFIG)

// * 使用类来封装axxios，可以创建多个实例，适用性更广
// export const http_another = new RequestHttp(OTHER_CONFIG)
