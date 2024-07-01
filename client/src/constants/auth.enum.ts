/**
 * @description：菜单类型
 */
export enum MENU_TYPE {
  D, // 目录
  M, // 菜单
  B // 按钮
}

/**
 * @description PASSWORD_RESET: 重置密码
 * @description CHANGE_MAIL: 换绑邮箱
 */
export enum EMAIL_AUTH_ENUM {
  PASSWORD_RESET = 1,
  CHANGE_MAIL = 2
}

/**
 * @description PWD:通过旧密码修改
 * @description EMAIL:通过邮箱修改
 */
export enum PASSWORD_RESET_ENUM {
  PWD,
  EMAIL
}
