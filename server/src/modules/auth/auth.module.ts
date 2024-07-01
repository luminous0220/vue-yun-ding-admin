import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { VerifyService } from '../verify/verify.service'
import { VerifyModule } from '../verify/verify.module'
import { EmailAuthEntity } from '../verify/emailAuth.entity'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserModule } from '../user/user.module'
import { UserService } from '../user/user.service'
import { UserEntity } from '../user/entities/user.entity'
import { RoleEntity } from '../role/entities/role.entity'
import { MenuEntity } from '../menu/entities/menu.entity'
import { MenuModule } from '../menu/menu.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([EmailAuthEntity, UserEntity, RoleEntity, MenuEntity]),
    VerifyModule,
    UserModule,
    MenuModule
  ],
  controllers: [AuthController],
  providers: [AuthService, VerifyService, UserService],
  exports: [AuthService]
})
export class AuthModule {}
