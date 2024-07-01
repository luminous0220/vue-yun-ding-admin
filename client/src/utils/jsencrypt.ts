import JSEncrypt from 'jsencrypt'

// 密钥对生成 http://web.chacuo.net/netrsakeypair

const publicKey =`-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDubtAXY21I/7Kb1o+EGm1t5XoC
wAIDLVNwk1ynZ478zBQtjJEGDziCDkVgwOzH+JDExkqvTrO0KGb0vGnc8TVM70ve
kJRfC/NJ8hGEkpWX0Sc0uyMgkHB+VJAylSjtZ0DQlYwMpRO1AX5zSDKnqjBLIZjX
BmNmSi1Q8H6TjO0XfQIDAQAB
-----END PUBLIC KEY-----`

// 加密
export const encrypt = (txt: string) => {
  const encryptor = new JSEncrypt()
  encryptor.setPublicKey(publicKey) // 设置公钥
  return encryptor.encrypt(txt) // 对数据进行加密
}
