import { CommonEntity } from 'src/common'
import { Column, Entity } from 'typeorm'

@Entity('menus')
export class MenuEntity extends CommonEntity {
  @Column('varchar', { length: 32, comment: '菜单标题', nullable: false })
  title: string

  @Column('varchar', { length: 32, comment: '菜单路径', nullable: true })
  path: string

  @Column('varchar', { length: 32, comment: '路由名称', nullable: true })
  name: string

  @Column('varchar', { length: 32, comment: '前端组件路径', nullable: true })
  componentPath: string

  @Column('varchar', { length: 64, comment: '默认跳转地址', nullable: true })
  redirect: string

  @Column('int', { comment: '上级菜单', nullable: true })
  parentId: number

  @Column('tinyint', { comment: '排序', default: 0, nullable: true })
  sort: number

  @Column('varchar', { length: 64, comment: '授权标识', nullable: true })
  permission: string

  @Column('tinyint', { comment: '类型（0目录，1菜单，2按钮）', nullable: false })
  type: number

  @Column('varchar', { length: 64, comment: '图标', nullable: true })
  icon: string

  @Column('tinyint', {
    comment: '状态:',
    nullable: false,
    default: 1
  })
  status: number

  @Column('tinyint', {
    comment: '是否缓存',
    nullable: false,
    default: 1
  })
  isKeepAlive: number
}
