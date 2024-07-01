import { IsNotEmpty, IsEmail, Length, IsOptional } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class RegisterDto {
  @ApiProperty({ example: 'xxx@qq.com', description: '用户邮箱' })
  @IsEmail({}, { message: '请填写正确格式的邮箱！' })
  @IsOptional()
  email?: string

  @ApiProperty({
    example: 'admin',
    description: '用户名'
  })
  @Length(5, 32, { message: '用户名长度为5-32位' })
  @IsOptional()
  username?: string

  @ApiProperty({ example: 'admin123', description: '用户密码' })
  @Length(6, 32, { message: '用户密码长度为6-32位' })
  @IsNotEmpty({ message: '用户密码不能为空' })
  password: string

  @ApiProperty({ example: 'admin123', description: '确认密码' })
  @Length(6, 32, { message: '确认密码长度为6-32位' })
  @IsNotEmpty({ message: '确认密码不能为空' })
  repeatPwd: string
}
