import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import dayjs from 'dayjs'
import { EMAIL_AUTH_ENUM } from 'src/common'
import { Repository } from 'typeorm'
import { generateRandom, sendEmail } from 'src/utils'
import { EmailAuthEntity } from './emailAuth.entity'
import { JwtService } from '@nestjs/jwt'
import ms from 'ms'
import { UserEntity } from '../user/entities/user.entity'
import { VerifyDto } from './VerifyDto'
import { USERD_ENUM } from 'src/common/constants/bool.constant'

@Injectable()
export class VerifyService {
  constructor(
    @InjectRepository(EmailAuthEntity)
    private readonly emailAuthEntity: Repository<EmailAuthEntity>,
    private readonly jwtService: JwtService,
    @InjectRepository(UserEntity)
    private readonly userEntity: Repository<UserEntity>
  ) {}

  // 验证邮箱
  async sendEmailAuth(mail: string, type: EMAIL_AUTH_ENUM, expir = 5 * 60) {
    const u = await this.userEntity.findOne({ where: { email: mail } })
    if (!u) {
      throw new HttpException('该邮箱尚未注册', HttpStatus.BAD_REQUEST)
    }
    const { email, id } = u
    const authDoc = await this.emailAuthEntity.findOne({
      where: { userId: id, type },
      order: { createdAt: 'DESC' }
    })
    // 限制一分钟内不得重新发送
    if (authDoc) {
      const gapTime = dayjs().diff(authDoc.createdAt)
      if (gapTime < 60000) {
        const diffS = Math.ceil((60000 - gapTime) / 1000)
        throw new HttpException(`${diffS}S内不得重新发送`, HttpStatus.BAD_REQUEST)
      }
    }

    const code = generateRandom(4, 2)
    const expiresAt = new Date(Date.now() + expir * 1000) // 有效时间
    const doc = { userId: id, type, code, expiresAt, email }
    const newEmailAuthDoc = await this.emailAuthEntity.save(doc)
    try {
      await sendEmail(email, code, newEmailAuthDoc.id, type)
      return newEmailAuthDoc.id
    } catch (error) {
      await this.emailAuthEntity.remove(newEmailAuthDoc)
      throw error
    }
  }

  // 验证码校验
  async verifyCode(params: VerifyDto) {
    const { codeId, code } = params
    const v = await this.emailAuthEntity.findOne({
      where: { id: codeId }
    })
    if (v?.code !== code) {
      throw new HttpException('验证码不正确', HttpStatus.BAD_REQUEST)
    }
    if (v.used) {
      throw new HttpException('验证码已被使用', HttpStatus.BAD_REQUEST)
    } else {
      v.used = USERD_ENUM.USED
      await this.emailAuthEntity.update({ id: codeId }, v)
    }
    if (v.expiresAt < new Date()) {
      throw new HttpException('验证码已过期', HttpStatus.BAD_REQUEST)
    }
    return v
  }

  async generateToken(userId: number) {
    const token = await this.jwtService.signAsync(
      { userId },
      {
        expiresIn: process.env.TOKEN_EXPIRESIN
      }
    )
    const refreshToken = await this.jwtService.signAsync(
      { userId },
      {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRESIN
      }
    )

    return {
      token,
      refreshToken,
      expires: ms(process.env.REFRESH_TOKEN_EXPIRESIN)
    }
  }
}
