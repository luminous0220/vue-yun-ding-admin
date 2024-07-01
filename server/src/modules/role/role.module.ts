import { Module } from '@nestjs/common'
import { RoleService } from './role.service'
import { RoleController } from './role.controller'
import { RoleEntity } from './entities/role.entity'
import { TypeOrmModule } from '@nestjs/typeorm'
import { MenuEntity } from '../menu/entities/menu.entity'

@Module({
  imports: [TypeOrmModule.forFeature([RoleEntity, MenuEntity])],
  controllers: [RoleController],
  providers: [RoleService],
  exports: [RoleService]
})
export class RoleModule {}
