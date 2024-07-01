/**
 * @description PENDING: 审核中
 * @description ACTIVE: 正常状态
 * @description LOCKED: 账号锁定
 * @description BLACKLISTED: 黑名单账号
 */
export enum USER_STATUS_ENUM {
  PENDING,
  ACTIVE,
  LOCKED
}

/**
 * @description 性别
 */
export enum USER_SEX_ENUM {
  WOMAN,
  MAN
}

export const USER_STATUS_ENUM_ERROR_MSG = {
  [USER_STATUS_ENUM.PENDING]: '当前账户未激活,请前往邮箱验证或重新发送验证码！',
  [USER_STATUS_ENUM.ACTIVE]: '当前账户已激活！',
  [USER_STATUS_ENUM.LOCKED]: '当前账户已锁定,请联系管理员解锁！'
}
