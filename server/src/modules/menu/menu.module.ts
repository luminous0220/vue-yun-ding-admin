import { Module } from '@nestjs/common'
import { MenuService } from './menu.service'
import { MenuController } from './menu.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { MenuEntity } from './entities/menu.entity'
import { UserEntity } from '../user/entities/user.entity'
import { RoleEntity } from '../role/entities/role.entity'

@Module({
  imports: [TypeOrmModule.forFeature([MenuEntity, UserEntity, RoleEntity])],
  controllers: [MenuController],
  providers: [MenuService],
  exports: [MenuService]
})
export class MenuModule {}
