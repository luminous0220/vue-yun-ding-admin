import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { ROLE_ENUME } from '../constants/role.constant'
import { InjectRepository } from '@nestjs/typeorm'
import { UserEntity } from 'src/modules/user/entities/user.entity'
import { Repository } from 'typeorm'

@Injectable()
export class RolesGuard implements CanActivate {
  // 要访问路由的角色（自定义的元数据），我们将再次使用 Reflector 助手类。Reflector 可以以正常方式注入到类中
  constructor(
    private reflector: Reflector,
    @InjectRepository(UserEntity)
    private readonly UserEntity: Repository<UserEntity>
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.get<ROLE_ENUME[]>('roles', context.getHandler())
    // 如果没有获取到当前路由的Roles元数据，则默认不需要做角色认证，允许访问
    if (!requiredRoles) {
      return true
    }

    // 否则需要校验角色权限
    const { user } = context.switchToHttp().getRequest()
    const u = await this.UserEntity.findOne({
      where: {
        id: user?.userId
      },
      relations: {
        roles: true
      }
    })

    // 用户不存在或者角色信息为空则拒绝访问
    if (!u || !u.roles) {
      throw new ForbiddenException()
    }

    // 如果用户角色是超级管理员则允许访问
    if (u.roles.some((ite) => ite.flag === ROLE_ENUME.SUPER)) return true

    // 如果用户角色不包含在requiredRoles中，则拒绝访问
    // @ts-ignore
    if (!u.roles.some((ite) => requiredRoles.includes(ite.flag))) {
      throw new ForbiddenException()
    }
    return true
  }
}
