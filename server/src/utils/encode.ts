import crypto from 'crypto'
import NodeRSA from 'node-rsa'

const privateKey = `-----BEGIN RSA PRIVATE KEY-----
MIICXAIBAAKBgQDubtAXY21I/7Kb1o+EGm1t5XoCwAIDLVNwk1ynZ478zBQtjJEG
DziCDkVgwOzH+JDExkqvTrO0KGb0vGnc8TVM70vekJRfC/NJ8hGEkpWX0Sc0uyMg
kHB+VJAylSjtZ0DQlYwMpRO1AX5zSDKnqjBLIZjXBmNmSi1Q8H6TjO0XfQIDAQAB
AoGAIYJUX30bPk+lT+6DI/s81t2R3LIUdlLX77HeKy7MMy4RReeD+DiKZgjQak0i
2eXOnsEJfQLQEak98vZJ4IHLzhs1CCJqSX6pZT1FGuwscQ5x+y089VSFCVb4O8HB
v31prZyTUz5HfdN/krZ+KwvAKkq29wzUqo0eMf0ORHazLdcCQQDupqe58rC6uvy/
3CSYbp9+2KqGCZYSPJVta25sFXKXaVir/g3QnEGc3xQpKYIQgGPBPp0ttZNRp4da
laU+7l1fAkEA/8QZILEb+zoqoRWkbUtOA8JFsC7w1RsGGchtVMTJerd9hQ1QA67F
ww6D7tuFdyIDLJB8spEhNDthBCYs21bcowJAMuSncCgpOCkYLXIs+7TbnplmBB+X
OVxiIWt/qN0KCvAUUNlk6M/pziJkkkKf0hUPMO7BZjYKrKclXlP7YWhD0QJAI+ly
5cY4eZP3PFr/lWEHeTuj8VMF+cYrmx8rSsW+zH5LH414+KtnlTXKjJVCLjIWZAF9
oM0D7oOP4bdCgSG3JQJBAIfywkzMNnOVbjSy5tU9xcF4jJbhO1FzjSskjKIICIj9
E0URPs/wXkc7fifUAoxPZTH9oaC/Yd5ibeZz7s5UnTA=
-----END RSA PRIVATE KEY-----`

/**
 * @description 解密
 */
export const decrypt = (val: string) => {
  const nodeKey = new NodeRSA(privateKey)
  nodeKey.setOptions({ encryptionScheme: 'pkcs1' }) // 因为jsencrypt自身使用的是pkcs1加密方案, nodejs需要修改成pkcs1。
  const decrypted = nodeKey.decrypt(val, 'utf8')

  return decrypted
}

/**
 * @description md5加密
 */
export const encrypByMd5 = (val: string) => {
  return crypto.createHash('md5').update(val).digest('hex')
}

/**
 * @description 隐藏邮箱
 */
export const maskEmail = (email: string) => {
  if (!email) return ''
  const atIndex = email.indexOf('@')
  if (atIndex <= 1) {
    return email
  }
  const firstPart = email.substring(0, atIndex - 1)
  const lastPart = email.substring(atIndex)
  const maskedPart = '*'.repeat(firstPart.length - 1)
  return `${firstPart.charAt(0)}${maskedPart}${email.charAt(atIndex - 1)}${lastPart}`
}
