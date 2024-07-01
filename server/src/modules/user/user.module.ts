import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { UserController } from './user.controller'
import { UserService } from './user.service'
import { UserEntity } from './entities/user.entity'
import { RoleEntity } from '../role/entities/role.entity'
import { VerifyModule } from '../verify/verify.module'

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, RoleEntity]), VerifyModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule {}
