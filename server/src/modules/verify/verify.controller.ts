import { ApiTags, ApiOperation } from '@nestjs/swagger'
import { VerifyService } from './verify.service'
import { Post, Controller, Body, HttpException, HttpStatus } from '@nestjs/common'
import { Public } from 'src/common'
import { SendEmailDto } from './VerifyDto'

@Controller('verify')
@ApiTags('验证模块')
export class VerifyController {
  constructor(private readonly verifyService: VerifyService) {}

  @ApiOperation({ summary: '邮箱验证' })
  @Public()
  @Post('email')
  async sendEmail(@Body() body: SendEmailDto) {
    const { email, type } = body
    if (type != 1 && type != 2) {
      throw new HttpException('type的值只能是1、2', HttpStatus.BAD_REQUEST)
    }
    const id = await this.verifyService.sendEmailAuth(email, type)

    return {
      codeId: id
    }
  }
}
