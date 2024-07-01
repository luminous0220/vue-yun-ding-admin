import { Controller, Query, Get, Post, Body, Put, Delete, Param } from '@nestjs/common'
import { RoleService } from './role.service'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { CreateRoleDto } from './dto/CreateRoleDto'
import { AssignDto } from './dto/AssignDto'
import { FindAllRoleDto } from './dto/FindAllRoleDto'
import { Roles } from 'src/common'
import { ROLE_ENUME } from 'src/common/constants/role.constant'

@ApiTags('角色模块')
@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @ApiOperation({ summary: '创建角色' })
  @Post()
  @ApiBearerAuth()
  @Roles([ROLE_ENUME.ADMIN])
  async createRole(@Body() body: CreateRoleDto) {
    return await this.roleService.createRole(body)
  }

  @ApiOperation({ summary: '为角色分配菜单' })
  @Post('assign/:id')
  @Roles([ROLE_ENUME.ADMIN])
  @ApiBearerAuth()
  async assignMenu(@Param('id') id: number, @Body() body: AssignDto) {
    return await this.roleService.assignMenu(id, body)
  }

  @ApiOperation({ summary: '获取用户角色菜单权限' })
  @Get('menu')
  @ApiBearerAuth()
  async getRoleMenu(@Query('id') id: number) {
    return await this.roleService.getRoleMenu(id)
  }

  @ApiOperation({ summary: '编辑角色' })
  @Put()
  @Roles([ROLE_ENUME.ADMIN])
  @ApiBearerAuth()
  async updateRole(@Query('id') id: number, @Body() body: CreateRoleDto) {
    return await this.roleService.updateRole(id, body)
  }

  @ApiOperation({ summary: '删除角色' })
  @Delete()
  @Roles([ROLE_ENUME.ADMIN])
  @ApiBearerAuth()
  async removeRole(@Query('id') id: number) {
    return await this.roleService.removeRole(id)
  }

  @ApiOperation({ summary: '获取角色列表' })
  @Get('list')
  @ApiBearerAuth()
  async findAll(@Query() query: FindAllRoleDto) {
    return await this.roleService.findAll(query)
  }
}
