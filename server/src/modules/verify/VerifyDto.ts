import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsEnum, IsOptional } from 'class-validator'
import { EMAIL_AUTH_ENUM } from 'src/common'

export class SendEmailDto {
  @ApiProperty({ example: '', description: '邮箱' })
  @IsEmail({}, { message: '邮箱格式不正确' })
  email: string

  @ApiProperty({
    example: EMAIL_AUTH_ENUM.PASSWORD_RESET,
    description: '验证类型（1：重置密码；2：更换邮箱）'
  })
  @IsEnum(EMAIL_AUTH_ENUM, { message: 'type的值只能是1、2' })
  type: EMAIL_AUTH_ENUM
}

export class VerifyDto {
  @ApiProperty({ example: '', description: '验证码记录的id' })
  @IsOptional()
  codeId?: number

  @ApiProperty({ example: '', description: '验证码' })
  @IsOptional()
  code?: string
}
