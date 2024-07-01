import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { MenuEntity } from './entities/menu.entity'
import { In, Like, Repository } from 'typeorm'
import type { Request } from 'express'
import { UserEntity } from '../user/entities/user.entity'
import { RoleEntity } from '../role/entities/role.entity'
import { CreateMenuDto } from './dto/CreateMenuDto'
import { MENU_TYPE_ENUM } from 'src/common/constants/menu.constant'
import { arrayToTree } from 'src/utils'

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(MenuEntity)
    private readonly menuEntity: Repository<MenuEntity>,
    @InjectRepository(UserEntity)
    private readonly userEntity: Repository<UserEntity>,
    @InjectRepository(RoleEntity)
    private readonly roleEntity: Repository<RoleEntity>
  ) {}

  /**
   * @description 新增菜单
   */
  async createMenu(body: CreateMenuDto) {
    await this.menuEntity.save(body)
  }

  /**
   * @description 更新菜单
   */
  async updateMenu(id: number, body: CreateMenuDto) {
    return await this.menuEntity.update(id, body)
  }

  /**
   * @description 删除菜单
   */
  async removeMenu(id: number) {
    return await this.menuEntity.delete(id)
  }

  /**
   * @description 获取所有菜单
   */
  async findAll(title: string) {
    // 获取当前用户的角色数组
    const list = await this.menuEntity.find({
      where: {
        title: Like(`%${title || ''}%`)
      }
    })

    // 如果是检索查询，则无需转成树形结构
    if (title) return list
    else return arrayToTree(list)
  }

  /**
   * @description 获取角色对应的菜单
   */
  async findAuthMenuList(req: Request) {
    // 获取当前用户的角色数组
    const u = await this.userEntity.findOne({
      where: { id: req.user.userId },
      relations: { roles: true }
    })

    // 将角色id提取为数组
    const ids = u.roles.reduce((pre, cur) => {
      return [...pre, cur.id]
    }, [])

    // 查询角色
    const roles = await this.roleEntity.find({
      where: { id: In(ids) },
      relations: { menus: true }
    })

    // 提取角色对应的菜单
    const menus = roles.reduce((pre, cur) => {
      return [...pre, ...cur.menus]
    }, [] as MenuEntity[])

    // 去重
    const set = new Set()
    const newMenus = menus.reduce((pre, cur) => {
      if (!set.has(cur.id)) {
        set.add(cur.id)
        return [...pre, cur]
      } else {
        return pre
      }
    }, [] as MenuEntity[])

    return newMenus
  }

  /**
   * @description 获取功能列表
   */
  async getPermissionList(req: Request) {
    const menus = await this.findAuthMenuList(req)
    return menus.reduce((pre, cur) => {
      if (cur.type === MENU_TYPE_ENUM.B) {
        return [...pre, { title: cur.title, permission: cur.permission }]
      } else {
        return pre
      }
    }, [])
  }
}
