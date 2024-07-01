import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { RoleEntity } from './entities/role.entity'
import { Like, Repository } from 'typeorm'
import { MenuEntity } from '../menu/entities/menu.entity'
import { In } from 'typeorm'
import { CreateRoleDto } from './dto/CreateRoleDto'
import { FindAllRoleDto } from './dto/FindAllRoleDto'
import { ROLE_TYPE_ENUM } from 'src/common/constants/role.constant'

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(RoleEntity)
    private readonly roleEntity: Repository<RoleEntity>,
    @InjectRepository(MenuEntity)
    private readonly menuEntity: Repository<MenuEntity>
  ) {}

  /**
   * @description 创建角色
   */
  async createRole(body: CreateRoleDto) {
    const { flag } = body
    const r = await this.roleEntity.findOneBy({ flag })
    if (r) {
      throw new HttpException('角色已存在', HttpStatus.BAD_REQUEST)
    }

    return await this.roleEntity.save(body)
  }

  /**
   * @description 授权菜单
   */
  async assignMenu(id: number, body: { menus: number[] }) {
    const { menus } = body
    const exsitRole = await this.roleEntity.findOneBy({ id })
    if (!exsitRole) {
      throw new HttpException('角色不存在，请检查id是否正确', HttpStatus.BAD_REQUEST)
    }

    const menuArr = await this.menuEntity.findBy({ id: In(menus) })

    exsitRole.menus = menuArr

    await this.roleEntity.save(exsitRole)
  }

  /**
   * @description 编辑角色
   */
  async updateRole(id: number, body: CreateRoleDto) {
    const r = await this.roleEntity.findOneBy({ id })

    if (!r) {
      throw new HttpException('角色id不存在', HttpStatus.BAD_REQUEST)
    }
    if (r.type === ROLE_TYPE_ENUM.BUILT_IN) {
      throw new HttpException('内置角色不能被编辑', HttpStatus.BAD_REQUEST)
    }
    return await this.roleEntity.update({ id }, body)
  }

  /**
   * @description 删除角色
   */
  async removeRole(id: number) {
    const exsitRole = await this.roleEntity.findOne({
      where: { id },
      relations: { menus: true }
    })
    if (exsitRole.type === ROLE_TYPE_ENUM.BUILT_IN) {
      throw new HttpException('系统内置角色不能被删除', HttpStatus.BAD_REQUEST)
    }
    if (exsitRole.menus.length !== 0) {
      throw new HttpException(
        '该角色绑定有多个菜单权限，请解除所有菜单权限后再删除',
        HttpStatus.BAD_REQUEST
      )
    }
    await this.roleEntity.delete(id)
  }

  /**
   * @description 获取角色列表
   */
  async findAll(query: Partial<FindAllRoleDto> = {}) {
    const { name, desc } = query
    const [list, total] = await this.roleEntity.findAndCount({
      where: {
        name: Like(`%${name || ''}%`),
        desc: Like(`%${desc || ''}%`)
      }
    })

    return {
      list,
      total
    }
  }

  /**
   * @description 获取角色菜单权限
   */
  async getRoleMenu(id: number) {
    const r = await this.roleEntity.findOne({
      where: { id },
      relations: { menus: true }
    })
    if (!r) {
      throw new HttpException('该id对应的角色不存在', HttpStatus.BAD_REQUEST)
    }
    return r.menus
  }
}
