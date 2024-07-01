import { Request } from 'express'
import ExcelJS from 'exceljs'
import { MenuEntity } from 'src/modules/menu/entities/menu.entity'
import { HttpException, HttpStatus } from '@nestjs/common'
/**
 * @description 生成随机数（数字与英文）(最少6位)
 * @param n 数字位数
 * @param l 字母位数
 */
export const generateRandom = (num: number, le: number) => {
  const letters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const numbers = '0123456789'

  let result = ''

  // 生成字母
  for (let i = 0; i < num; i++) {
    result += letters[Math.floor(Math.random() * letters.length)]
  }

  // 生成数字
  for (let i = 0; i < le; i++) {
    result += numbers[Math.floor(Math.random() * numbers.length)]
  }

  // 混洗结果
  result = result
    .split('')
    .sort(() => Math.random() - 0.5)
    .join('')

  return result
}

/**
 * @description 通过request获取IP地址
 */
export const getClientIp = (request: Request): string => {
  let ipAddress = ''

  // 预定义的一组请求头列表，按优先级排序
  const headerList = [
    'X-Client-IP',
    'X-Real-IP',
    'X-Forwarded-For',
    'CF-Connecting-IP',
    'True-Client-IP',
    'X-Cluster-Client-IP',
    'Proxy-Client-IP',
    'WL-Proxy-Client-IP',
    'HTTP_CLIENT_IP',
    'HTTP_X_FORWARDED_FOR'
  ]

  // 尝试从预定义的请求头列表中提取客户端的真实 IP 地址
  for (const header of headerList) {
    const value = request.headers[header]
    if (value && typeof value === 'string') {
      const ips = value.split(',')
      // 取最左侧的 IP 地址作为客户端的真实 IP 地址
      ipAddress = ips[0].trim()
      break
    }
  }

  // 如果无法从请求头中获取到客户端的真实 IP 地址，则回退到使用 connection.remoteAddress 属性

  // 对获取到的 IP 地址进行格式化和过滤操作
  if (ipAddress && ipAddress.includes('::')) {
    const isLocal = /^(::1|fe80(:1)?::1(%.*)?)$/i.test(ipAddress)
    if (isLocal) {
      ipAddress = ''
    } else if (ipAddress.includes('::ffff:')) {
      ipAddress = ipAddress.split(':').pop() || ''
    }
  }

  // 如果获取到的 IP 地址不符合格式要求，则设置为空字符串
  if (!ipAddress || !/\d+\.\d+\.\d+\.\d+/.test(ipAddress)) {
    ipAddress = ''
  }
  return ipAddress
}

/**
 * @description 扁平化菜单数组转Tree
 */

export const arrayToTree = (items: MenuEntity[]) => {
  const newTree: MenuEntity[] = []
  const getChildren = (arr, parentId) => {
    items.forEach((ite: any) => {
      if (ite.parentId === parentId) {
        ite.children = []
        arr.push(ite)
        getChildren(ite.children, ite.id)
      }
    })
  }
  getChildren(newTree, null)
  sort(newTree)
  return newTree
}

/**
 * @description 递归排序
 */
export const sort = (routes: any) => {
  routes.sort((pre, cur) => pre.sort - cur.sort)
  routes.forEach((ite) => {
    if (ite.children) sort(ite.children)
  })
}

/**
 * @description 导出excle
 */
export const exportExcle = async (list: any[]) => {
  const workbook = new ExcelJS.Workbook()
  const worksheet = workbook.addWorksheet('sheet1')

  if (!list.length) throw new HttpException('暂无导出数据', HttpStatus.BAD_REQUEST)
  // 添加表头
  const headerRow = worksheet.addRow(Object.keys(list[0]))
  headerRow.eachCell((cell) => {
    cell.font = { bold: true }
    cell.alignment = { horizontal: 'center', vertical: 'middle' }
    cell.border = {
      top: { style: 'medium' },
      left: { style: 'medium' },
      bottom: { style: 'medium' },
      right: { style: 'medium' }
    }
  })

  // 添加数据
  list.forEach((row) => {
    const dataRow = worksheet.addRow(Object.values(row))

    dataRow.eachCell({ includeEmpty: true }, (cell) => {
      cell.alignment = { horizontal: 'center', vertical: 'middle' }
      cell.border = {
        top: { style: 'medium' },
        left: { style: 'medium' },
        bottom: { style: 'medium' },
        right: { style: 'medium' }
      }
      if (cell.value instanceof Date) {
        cell.numFmt = 'yyyy-mm-dd hh:mm:ss'
      }
    })
  })

  // 设置列宽自适应
  worksheet.columns.forEach((column) => {
    const maxLength = column.values.reduce((pre: number, value) => {
      let length = 10
      length = value ? value.toString().length : 0
      if (value instanceof Date) length = 22
      return Math.max(pre, length)
    }, 0)

    column.width = maxLength < 10 ? 10 : maxLength
  })

  // 将工作簿转换为Buffer
  const buffer = await workbook.xlsx.writeBuffer()
  return buffer
}
