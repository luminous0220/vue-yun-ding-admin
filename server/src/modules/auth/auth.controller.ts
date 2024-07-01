import {
  Controller,
  Post,
  Body,
  Req,
  Res,
  Get,
  Query,
  Render,
  Header,
  Put,
  HttpException,
  HttpStatus
} from '@nestjs/common'
import { ApiOperation, ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { AuthService } from './auth.service'
import { getClientIp } from 'src/utils'
import { VerifyService } from '../verify/verify.service'
import type { Request, Response } from 'express'
import { VerifyDto } from '../verify/VerifyDto'
import { Public } from 'src/common'
import { RegisterDto } from './dto/RegisterDto'
import { LoginDto } from './dto/LoginDto'
import { UpdatePasswordDto } from './dto/UpdatePasswordDto'
import { MenuService } from '../menu/menu.service'
import { UpdateUserDto } from '../user/dto/UpdateUserDto'
import { UserService } from '../user/user.service'

@ApiTags('权限模块')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly menuService: MenuService,
    private readonly verifyService: VerifyService,
    private readonly userService: UserService
  ) {}

  @ApiOperation({ summary: '初始化数据库' })
  @Public()
  @Post('init')
  async init() {
    return this.authService.init()
  }

  @ApiOperation({ summary: '用户注册' })
  @Public()
  @Post('register')
  async register(@Body() body: RegisterDto, @Req() req: Request) {
    await this.authService.verifyAndCreateUser(body, req)
  }

  @ApiOperation({ summary: '用户登录' })
  @Public()
  @Post('login')
  async login(@Body() body: LoginDto, @Req() req: Request) {
    const u = await this.authService.verifyUserIdentity(body)
    const { id } = u
    const ip = getClientIp(req)
    await this.authService.savaLoginIp(id, ip)
    const { token, refreshToken, expires } = await this.verifyService.generateToken(id)
    return {
      userId: id,
      token,
      refreshToken,
      expires
    }
  }

  @ApiOperation({ summary: '获取个人信息' })
  @Get('user-info')
  @ApiBearerAuth()
  async getUserInfo(@Req() req: Request) {
    const id = req.user.userId
    const { username, nickname, sex, email, avatar, sign, birthday, status, phone, age } =
      await this.authService.getUserInfo(id)
    return { username, nickname, sex, email, avatar, sign, birthday, status, phone, age }
  }

  @ApiOperation({ summary: '编辑个人信息' })
  @Put('user-info')
  @ApiBearerAuth()
  async updateUser(@Req() req: Request, @Body() body: UpdateUserDto) {
    const id = req.user.userId
    await this.userService.updateUser(id, body)
  }

  @ApiOperation({ summary: '更新个人密码' })
  @Public()
  @Put('update-password')
  async updatePassword(@Body() body: UpdatePasswordDto) {
    const { newPwd, repeatPwd } = body
    if (newPwd !== repeatPwd) {
      throw new HttpException('两次输入的密码不一致', HttpStatus.BAD_REQUEST)
    }
    return await this.authService.updatePassword(body)
  }

  @ApiOperation({ summary: '短信验证码' })
  @Post('sms-code')
  @Public()
  async sendSmsCide() {
    return '目前还未支持发送短信验证码'
  }

  @ApiOperation({ summary: '刷新token' })
  @Post('refresh-token')
  @ApiBearerAuth()
  async refreshToken(@Req() req: Request) {
    return await this.authService.refreshToken(req)
  }

  @ApiOperation({ summary: '激活账户' })
  @Public()
  @Get('activeAccount')
  async activeAccount(@Query() query: VerifyDto, @Res() res: Response) {
    return await this.authService.activeAccount(query, res)
  }

  @ApiOperation({ summary: '注册失败页面' })
  @Get('registerError')
  @Render('registerError')
  @Header('Content-Type', 'text/html')
  @Public()
  async registerError(@Query() query) {
    return { message: query.message }
  }

  @ApiOperation({ summary: '注册成功页面' })
  @Public()
  @Get('registerSuccess')
  @Render('registerSuccess')
  @Header('Content-Type', 'text/html')
  async registerSuccess(@Query() query) {
    return { message: query.message, username: query.username, email: query.email }
  }
}
