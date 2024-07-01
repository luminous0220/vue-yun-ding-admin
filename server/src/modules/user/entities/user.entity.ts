import { Column, Entity, JoinTable, ManyToMany } from 'typeorm'
import { CommonEntity } from 'src/common'
import { USER_SEX_ENUM, USER_STATUS_ENUM } from 'src/common/constants/user.constant'
import { RoleEntity } from 'src/modules/role/entities/role.entity'

@Entity('users')
export class UserEntity extends CommonEntity {
  @Column('varchar', { length: 32, comment: '用户名' })
  username: string

  @Column('varchar', { length: 32, comment: '用户昵称', default: '' })
  nickname: string

  @Column('varchar', { length: 32, comment: '用户密码' })
  password: string

  @Column('tinyint', {
    default: USER_STATUS_ENUM.PENDING,
    comment: '用户状态:0审核中，1正常状态，2账号锁定，3黑名单'
  })
  status: USER_STATUS_ENUM

  @Column('tinyint', { default: USER_SEX_ENUM.MAN, comment: '用户性别' })
  sex: USER_SEX_ENUM

  @Column('varchar', { length: 64, unique: true, comment: '用户邮箱' })
  email: string

  @Column('date', { comment: '生日', nullable: true })
  birthday: Date

  @Column('varchar', {
    length: 300,
    nullable: true,
    comment: '用户头像'
  })
  avatar: string

  @Column('tinyint', {
    nullable: true,
    comment: '年龄'
  })
  age: number

  @Column('varchar', {
    length: 12,
    nullable: true,
    comment: '手机'
  })
  phone: string

  @Column('varchar', {
    length: 300,
    nullable: true,
    comment: '用户签名'
  })
  sign: string

  @ManyToMany(() => RoleEntity)
  @JoinTable({
    name: 'user_role_relation'
  })
  roles: RoleEntity[]

  @Column('char', { length: 64, comment: '注册IP', nullable: true })
  registerIp: string

  @Column('char', {
    length: 64,
    comment: '最后一次登录IP',
    nullable: true
  })
  lastLoginIp: string
}
