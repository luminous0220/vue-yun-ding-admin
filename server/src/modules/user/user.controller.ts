import { Controller, Body, Get, Query, Put, Post, Param } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'

import { UserService } from './user.service'
import { UpdateUserDto } from './dto/UpdateUserDto'
import { AssignRoleDto } from './dto/AssignRoleDto'
import { FindAllUserDto } from './dto/FindAllUserDto'

import { Roles } from 'src/common'
import { CreateUserDto } from './dto/CreateUserDto'
import { UpdateUserStatusDto } from './dto/UpdateUserStatusDto'
import { ROLE_ENUME } from 'src/common/constants/role.constant'
import { DeleteUserDto } from './dto/DeleteUserDto'

@Controller('user')
@ApiTags('用户模块')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: '新增用户' })
  @Post('create')
  @Roles([ROLE_ENUME.ADMIN])
  @ApiBearerAuth()
  async create(@Body() body: CreateUserDto) {
    return await this.userService.create(body)
  }

  @ApiOperation({ summary: '删除用户' })
  @Post()
  @Roles([ROLE_ENUME.SUPER])
  @ApiBearerAuth()
  async delete(@Body() body: DeleteUserDto) {
    return await this.userService.delete(body)
  }

  @ApiOperation({ summary: '修改用户状态' })
  @Put('status')
  @Roles([ROLE_ENUME.ADMIN])
  @ApiBearerAuth()
  async updateStatus(@Body() body: UpdateUserStatusDto) {
    return await this.userService.updateStatus(body)
  }

  @ApiOperation({ summary: '获取用户列表' })
  @Get('user-list')
  @ApiBearerAuth()
  async findAll(@Query() query: FindAllUserDto) {
    return await this.userService.findAll(query)
  }

  @ApiOperation({ summary: '重置密码' })
  @Roles([ROLE_ENUME.ADMIN])
  @Put('reset-password')
  async resetPassword(@Query('id') id: number) {
    return await this.userService.resetPassword(id)
  }

  @ApiOperation({ summary: '编辑用户' })
  @Put()
  @Roles([ROLE_ENUME.ADMIN])
  @ApiBearerAuth()
  async updateUser(@Query('id') id: number, @Body() body: UpdateUserDto) {
    await this.userService.updateUser(id, body)
  }

  @ApiOperation({ summary: '授予用户角色' })
  @Post('assign/:id')
  @Roles([ROLE_ENUME.ADMIN])
  @ApiBearerAuth()
  async assign(@Param('id') id: number, @Body() body: AssignRoleDto) {
    await this.userService.assign(id, body)
  }
}
