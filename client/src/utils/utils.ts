import { type IMenu } from '@/apis'
import { MENU_TYPE } from '@/constants'

/**
 * @description: 引入图片
 * @param  url 图片名称，例如：logo.png
 * @param  path 路径地址
 */
export const getImg = (url: string, path = '/images') => {
  return new URL(`../assets${path}/${url}`, import.meta.url).href
}

/**
 * @description 扁平化数组
 */
export const flatMenuRoutes = (routes: IMenu.Item[]) => {
  // 深拷贝一份副本
  const tempArr: IMenu.Item[] = JSON.parse(JSON.stringify(routes))

  return tempArr.reduce((pre: IMenu.Item[], cur: IMenu.Item) => {
    const newArr = [...pre, cur]
    if (cur.children && cur.children.length > 0) {
      newArr.push(...flatMenuRoutes(cur.children))
    }
    return newArr
  }, [])
}

/**
 * @description 整理菜单(过滤掉按钮（type===2）)
 */
export const filterAuthMenuList = (menus: IMenu.Item[]) => {
  const tempMenus = flatMenuRoutes(menus).filter((ite) => ite.type !== MENU_TYPE.B && ite.status)
  const newTree: IMenu.Item[] = []
  const filterArr = (arr: any[], parentId: number | null) => {
    tempMenus.forEach((ite) => {
      if (ite.parentId === parentId) {
        ite.children = []
        arr.push(ite)
        filterArr(ite.children, ite.id!)
      }
    })
  }
  filterArr(newTree, null)
  return newTree
}

/**
 * @description 检查是否为邮箱
 */
export const IsEmail = (str: string) => {
  let reg = /^([a-zA-Z]|[0-9])(\w|\\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/
  return reg.test(str)
}

// 点击后自动下载
export const handleExport = async (api: Function, params?: any) => {
  const res = await api(params)
  if (!res) return
  const url = window.URL.createObjectURL(new Blob([res.data]))

  // 创建a标签
  let aLink = document.createElement('a')

  aLink.href = url

  // 获取文件名（服务端可能设置得有）
  const fileName = window.decodeURI(res.headers['content-disposition'].split('filename=')[1])

  // 设置文件名（如果不设置文件名，那么浏览器会自动打开预览，设置了文件名后会浏览器会自动下载）
  aLink.setAttribute('download', fileName)

  document.body.appendChild(aLink)
  //点击链接，实现自动下载
  aLink.click()
  //移除
  document.body.removeChild(aLink)
  //释放blob（务必释放，否则下载的文件永远是旧文件）
  window.URL.revokeObjectURL(aLink.href)
}
