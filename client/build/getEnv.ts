export interface ViteEnvType {
  VITE_BASE_URL: string
  VITE_PORT: number
  VITE_TITLE: string
  VITE_GZIP_COMPRESS: boolean
  VITE_ANALYSIS: boolean
  VITE_DROP_CONSOLE_AND_DEBUGGER: boolean
}

/**
 * @description 添加.env文件中的变量到process.env进程中
 * @returns 含有env键值对的js对象
 */
export function getEnv(env: Record<string, any>): ViteEnvType {
  const ret: any = {}

  for (const [key, val] of Object.entries(env)) {
    let v: any = ''
    v = val === 'true' ? true : val === 'false' ? false : val
    if (typeof v === 'string' && typeof Number(v) === 'number' && !isNaN(Number(v))) {
      v = Number(v)
    }

    process.env[key] = v
    ret[key] = v
  }

  return ret
}
