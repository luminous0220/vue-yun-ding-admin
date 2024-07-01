import { Column, Entity } from 'typeorm'
import { CommonEntity, EMAIL_AUTH_ENUM } from 'src/common'
import { USERD_ENUM } from 'src/common/constants/bool.constant'

@Entity('email_auth')
export class EmailAuthEntity extends CommonEntity {
  @Column('int', { comment: '用户id' })
  userId: number

  @Column('enum', { enum: EMAIL_AUTH_ENUM, comment: '验证类型' })
  type: EMAIL_AUTH_ENUM

  @Column({ nullable: false, comment: '验证码' })
  code: string

  @Column('datetime', { comment: '过期时间' })
  expiresAt: Date

  @Column({ length: 64, nullable: false, comment: '发送的邮箱' })
  email: string

  @Column('tinyint', { comment: '是否已经使用了', default: USERD_ENUM.UNUSED })
  used: USERD_ENUM
}
