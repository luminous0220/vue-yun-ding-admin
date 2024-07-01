import { SetMetadata } from '@nestjs/common'
import { ROLE_ENUME } from '../constants/role.constant'

export const Roles = (roles: ROLE_ENUME[]) => SetMetadata('roles', roles)

export const Public = () => SetMetadata('isPublic', true)
