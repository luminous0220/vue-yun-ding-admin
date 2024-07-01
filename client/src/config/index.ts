  const SYSTEM_NAME = 'yun-ding-admin'

  // 首页地址
  const HOME_ROUTE = '/home'

  // 登录页地址
  const LOGIN_ROUTE = '/login'

  // 默认主题颜色，只能使用hex格式
  const PRIMARY_COLOR = '#1890ff'

  // 白名单地址，（不需要token访问、不需要添加到 tabs 的路由地址）
  const WHITE_LIST_PATH = ['/403', '/404', '/500', '/Login']

  // axios 请求的 timeout
  const AXIOS_TIME_OUT = 1000 * 10

  // 存储在cookie中的key
  const TOKEN_KEY = 'auth-admin-token'

  // 存储在 session 中的key
  const SESSION_KEY = 'session-token'

  export const CFG = {
    SYSTEM_NAME,
    HOME_ROUTE,
    LOGIN_ROUTE,
    PRIMARY_COLOR,
    WHITE_LIST_PATH,
    AXIOS_TIME_OUT,
    TOKEN_KEY,
    SESSION_KEY
  }
