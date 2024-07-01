import nodemailer from 'nodemailer'
import hbs from 'hbs'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { EMAIL_AUTH_ENUM } from 'src/common'

// 发送邮件
export const sendEmail = async (
  to: string,
  code: string,
  codeId: number,
  type: EMAIL_AUTH_ENUM
) => {
  // 开启一个 SMTP 连接池
  const transport = nodemailer.createTransport({
    host: 'smtp.qq.com', // qq邮箱主机 host
    secure: true, // 如果为true，则连接将在连接到服务器时使用 TLS。如果为false（默认值），则如果服务器支持STARTTLS扩展，则使用 TLS。在大多数情况下，如果连接到端口465，请将此值设置为true
    port: 465, // SMTP 端口
    auth: {
      user: '947839867@qq.com', // 账号：域名邮箱账号
      pass: 'dphxgvehubohbahf' // 密码：SMPT获取的授权密码
    }
  })

  try {
    let htmlStr = ''
    if (type == EMAIL_AUTH_ENUM.REGISTRATION) {
      htmlStr = readFileSync(join(__dirname, '../../views/activeMail.html'), 'utf-8')
    } else if (type == EMAIL_AUTH_ENUM.PASSWORD_RESET) {
      htmlStr = readFileSync(join(__dirname, '../../views/resetPasswordMail.html'), 'utf-8')
    } else if (type == EMAIL_AUTH_ENUM.CHANGE_MAIL) {
      htmlStr = readFileSync(join(__dirname, '../../views/changeMail.html'), 'utf-8')
    } else return

    const template = hbs.compile(htmlStr)
    const htmlBody = template({
      code,
      codeId,
      baseurl: process.env.BASEURL,
      port: process.env.PORT
    })
    const info = await transport.sendMail({
      // 发送者的信息
      from: '947839867@qq.com', // 也可以是 "sendname <sender@server.com>""
      // 接受者的信息
      to,
      // 主题
      subject: `一封来自${process.env.TITLE}的邮箱验证码`,
      html: htmlBody
    })
    info.code = code
    transport.close()
    return info
  } catch (error: any) {
    transport.close()
    if (error.responseCode === 550) {
      throw new Error('发送邮件失败，请检查邮箱是否正确')
    }
  }
}
