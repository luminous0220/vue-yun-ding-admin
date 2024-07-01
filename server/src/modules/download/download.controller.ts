import { Controller, Get, Query, Res } from '@nestjs/common'
import { Response } from 'express'
import fs from 'node:fs'
import { ApiOperation, ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { UserService } from '../user/user.service'
import { RoleService } from '../role/role.service'
import { exportExcle } from 'src/utils'
import { FindAllUserDto } from '../user/dto/FindAllUserDto'
import { join } from 'node:path'

@Controller('download')
@ApiTags('下载模块')
export class DownloadController {
  constructor(
    private readonly userService: UserService,
    private readonly roleService: RoleService
  ) {}

  @ApiOperation({ summary: '下载批量新增用户的Excle模版' })
  @Get('usersUploadTml')
  @ApiBearerAuth()
  async download(@Res() res: Response) {
    try {
      const data = await fs.readFileSync(join(__dirname, '../../../public/usersUploadTml.xlsx'))
      res.setHeader(
        'Content-Disposition',
        'attachment; filename=' + encodeURIComponent('用户上传模版.xlsx')
      )
      res.send(data)
    } catch (error) {
      res.status(500).json(error)
    }
  }

  @ApiOperation({ summary: '导出角色列表的Excle文件' })
  @Get('rolesExcle')
  @ApiBearerAuth()
  async getRolesExcle(@Res() res: Response) {
    const { list } = await this.roleService.findAll()

    const buffer = await exportExcle(list)
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=' + encodeURIComponent('角色列表.xlsx')
    )
    res.send(buffer)
  }

  @ApiOperation({ summary: '导出用户列表' })
  @Get('usersExcle')
  @ApiBearerAuth()
  async getUsersExcle(@Res() res: Response, @Query() query: FindAllUserDto) {
    const { list } = await this.userService.findAll(query)
    const _list = list.map((item) => {
      const roles = item.roles.map((sub) => sub.name).join(',')
      return {
        ...item,
        roles
      }
    })
    const buffer = await exportExcle(_list)
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=' + encodeURIComponent('用户列表.xlsx')
    )
    res.send(buffer)
  }
}
