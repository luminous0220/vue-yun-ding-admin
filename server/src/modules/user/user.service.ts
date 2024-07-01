import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Between, In, Like, Repository } from 'typeorm'
import { USER_STATUS_ENUM } from 'src/common'
import { encrypByMd5 } from 'src/utils'
import { UserEntity } from './entities/user.entity'
import { UpdateUserDto } from './dto/UpdateUserDto'
import { AssignRoleDto } from './dto/AssignRoleDto'
import { RoleEntity } from '../role/entities/role.entity'
import { FindAllUserDto } from './dto/FindAllUserDto'
import { VerifyService } from '../verify/verify.service'

import { CreateUserDto } from './dto/CreateUserDto'
import { UpdateUserStatusDto } from './dto/UpdateUserStatusDto'
import { ROLE_ENUME } from 'src/common/constants/role.constant'
import { DeleteUserDto } from './dto/DeleteUserDto'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userEntity: Repository<UserEntity>,
    @InjectRepository(RoleEntity)
    private readonly roleEntity: Repository<RoleEntity>,
    private readonly verifyService: VerifyService
  ) {}

  /**
   * @description 新增用户
   */
  async create(body: CreateUserDto) {
    body.password = encrypByMd5(body.password)
    const role = await this.roleEntity.findOne({
      where: { flag: ROLE_ENUME.USER }
    })

    await this.userEntity.save({ ...body, roles: [role], status: USER_STATUS_ENUM.ACTIVE })
  }

  /**
   * @description 删除用户
   */
  async delete(body: DeleteUserDto) {
    await this.userEntity.softDelete(body.ids)
  }

  /**
   * @description 修改用户状态
   */
  async updateStatus(query: UpdateUserStatusDto) {
    const { id, status } = query
    return await this.userEntity.update({ id }, { status })
  }

  /**
   * @description 更新用户信息
   */
  async updateUser(id: number, body: UpdateUserDto) {
    const u = await this.userEntity.findOneBy({ id })
    if (!u) {
      throw new HttpException('当前用户不存在', HttpStatus.BAD_REQUEST)
    }
    await this.userEntity.update({ id }, body)
  }

  /**
   * @description 更新用户信息
   */
  async resetPassword(id: number) {
    const u = await this.userEntity.findOneBy({ id })
    if (!u) {
      throw new HttpException('当前用户不存在', HttpStatus.BAD_REQUEST)
    }
    u.password = encrypByMd5('123456')
    await this.userEntity.save(u)
  }

  /**
   * @description 更新用户状态
   */
  async updateUserStatus(userId: number, status: USER_STATUS_ENUM) {
    const u = await this.userEntity.update({ id: userId }, { status })
    return u.affected > 0
  }

  /**
   * @description 授予用户角色
   */
  async assign(id: number, body: AssignRoleDto) {
    const u = await this.userEntity.findOneBy({ id })

    const { roleIds } = body

    const ids = await this.roleEntity.findBy({ id: In(roleIds) })

    u.roles = ids

    await this.userEntity.save(u)
  }

  /**
   * @description 获取用户列表
   */
  async findAll(query: FindAllUserDto) {
    const { username, email, startTime, endTime } = query
    let { pageNumber, pageSize } = query
    pageNumber = pageNumber ? pageNumber : 1
    pageSize = pageSize ? pageSize : 10
    const [data, total] = await this.userEntity.findAndCount({
      where: {
        createdAt: Between(startTime, endTime),
        username: Like(`%${username || ''}%`),
        email: Like(`%${email || ''}%`)
      },
      skip: (pageNumber - 1) * pageSize,
      take: pageSize,
      order: {
        createdAt: 'DESC'
      },
      relations: {
        roles: true
      },
      select: {
        id: true,
        email: true,
        status: true,
        username: true,
        nickname: true,
        sex: true,
        birthday: true,
        avatar: true,
        sign: true,
        createdAt: true,
        updatedAt: true
      }
    })

    const list = data.map((ite) => {
      let roles = []
      if (ite.roles.length !== 0) {
        roles = ite.roles.map((sub) => {
          return {
            id: sub.id,
            flag: sub.flag,
            name: sub.name,
            desc: sub.desc
          }
        })
      }
      return {
        ...ite,
        roles
      }
    })
    return {
      list: list.filter((u) => !u.roles.some((r) => r.flag === ROLE_ENUME.SUPER)),
      total
    }
  }
}
