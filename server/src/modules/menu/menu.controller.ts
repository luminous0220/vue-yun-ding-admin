import { Controller, Post, Body, Query, Delete, Put, Get, Req } from '@nestjs/common'
import { MenuService } from './menu.service'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { CreateMenuDto } from './dto/CreateMenuDto'
import { Roles } from 'src/common'
import { ROLE_ENUME } from 'src/common/constants/role.constant'
import { FindAllMenuDto } from './dto/FindAllMenuDto'
import { arrayToTree } from 'src/utils'
import type { Request } from 'express'

@ApiTags('菜单模块')
@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @ApiOperation({ summary: '新增菜单' })
  @Post()
  @Roles([ROLE_ENUME.ADMIN])
  @ApiBearerAuth()
  async createMenu(@Body() body: CreateMenuDto) {
    return await this.menuService.createMenu(body)
  }

  @ApiOperation({ summary: '更新菜单' })
  @Put()
  @Roles([ROLE_ENUME.ADMIN])
  @ApiBearerAuth()
  async updateMenu(@Query('id') id: number, @Body() body: CreateMenuDto) {
    return await this.menuService.updateMenu(id, body)
  }

  @ApiOperation({ summary: '获取所有菜单' })
  @Get('list')
  @ApiBearerAuth()
  async findAll(@Query() query: FindAllMenuDto) {
    return await this.menuService.findAll(query.title)
  }

  @ApiOperation({ summary: '获取个人按钮权限' })
  @Get('btn-permissions')
  @ApiBearerAuth()
  async getPermissionList(@Req() req: Request) {
    return await this.menuService.getPermissionList(req)
  }

  @ApiOperation({ summary: '获取个人菜单权限' })
  @Get('auth-list')
  @ApiBearerAuth()
  async findAuthMenuList(@Req() req: Request) {
    const menus = await this.menuService.findAuthMenuList(req)
    return arrayToTree(menus)
  }

  @ApiOperation({ summary: '删除菜单' })
  @Delete()
  @Roles([ROLE_ENUME.ADMIN])
  @ApiBearerAuth()
  async removeMenu(@Query('id') id: number) {
    return await this.menuService.removeMenu(id)
  }
}
