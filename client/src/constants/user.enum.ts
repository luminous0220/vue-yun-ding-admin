/**
 * @description：用户性别
 */
export const GENDER_OPIONS = [
  { label: '男', value: 1 },
  { label: '女', value: 0 }
]

/**
 * @description 性别
 */
export enum USER_SEX {
  WOMAN,
  MAN
}

/**
 * @description PENDING: 审核中
 * @description ACTIVE: 正常状态
 * @description LOCKED: 账号锁定
 */
export enum USER_STATUS {
  PENDING,
  ACTIVE,
  LOCKED
}
