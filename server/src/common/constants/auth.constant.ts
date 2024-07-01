/**
 * @description REGISTRATION: 注册账户
 * @description PASSWORD_RESET: 重置密码
 * @description CHANGE_MAIL: 换绑邮箱
 */
export enum EMAIL_AUTH_ENUM {
  REGISTRATION,
  PASSWORD_RESET,
  CHANGE_MAIL
}

/**
 * @description PWD:通过旧密码修改
 * @description EMAIL:通过邮箱修改
 */
export enum PASSWORD_RESET_ENUM {
  PWD,
  EMAIL
}
