import { CommonEntity } from 'src/common'
import { ROLE_TYPE_ENUM } from 'src/common/constants/role.constant'
import { MenuEntity } from 'src/modules/menu/entities/menu.entity'
import { Column, Entity, JoinTable, ManyToMany } from 'typeorm'

@Entity('roles')
export class RoleEntity extends CommonEntity {
  @Column('varchar', { length: 32, comment: '角色标识', nullable: false, unique: true })
  flag: string

  @Column('varchar', { length: 32, comment: '角色名称', nullable: false, unique: true })
  name: string

  @Column('varchar', { length: 32, comment: '描述', nullable: true })
  desc: string

  @Column('tinyint', { comment: '类型', nullable: false, default: ROLE_TYPE_ENUM.CUSTOM })
  type: ROLE_TYPE_ENUM

  @ManyToMany(() => MenuEntity)
  @JoinTable({
    name: 'role_menu_relation'
  })
  menus: MenuEntity[]
}
