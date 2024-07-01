import { IsEmail, Length, IsOptional, IsEnum, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { PASSWORD_RESET_ENUM } from 'src/common'

export class UpdatePasswordDto {
  @ApiProperty({ example: 'xxx@qq.com', description: '用户邮箱' })
  @IsEmail({}, { message: '请填写正确格式的邮箱！' })
  @IsOptional()
  email: string

  @ApiProperty({ example: '', description: '验证码' })
  @IsOptional()
  code: string

  @ApiProperty({ example: 0, description: '验证码id' })
  @IsOptional()
  codeId: number

  @ApiProperty({ example: 'admin123', description: '旧密码' })
  @Length(6, 32, { message: '旧密码密码长度为6-32位' })
  @IsOptional()
  oldPwd: string

  @ApiProperty({ example: 'zx123456', description: '新密码' })
  @Length(6, 32, { message: '新密码长度为6-32位' })
  @IsString()
  newPwd: string

  @ApiProperty({ example: 'zx123456', description: '确认密码' })
  @IsString()
  repeatPwd: string

  @ApiProperty({ example: 1, description: '类型（0：通过旧密码修改；1通过邮箱修改）' })
  @IsEnum(PASSWORD_RESET_ENUM, { message: 'type的值只能是1、2' })
  type: PASSWORD_RESET_ENUM
}
